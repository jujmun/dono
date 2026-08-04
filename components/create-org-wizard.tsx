import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  Modal,
  Linking,
  Platform,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import * as ExpoLinking from "expo-linking";
import {
  CheckCircle2,
  ArrowRight,
  ImagePlus,
  Paperclip,
  IdCard,
  Globe,
  Link2,
  ShieldCheck,
  Banknote,
} from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { DonorCreateGate } from "@/components/donor-create-gate";
import { isAlumni } from "@/lib/auth/user-type";
import { LegalAcceptanceCheckbox } from "@/components/legal-acceptance-checkbox";
import { CampaignImage } from "@/components/ui/campaign-image";
import { VerifyingIndicator } from "@/components/ui/verifying-indicator";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { isAtLeastAge, parseIsoDateOnly } from "@/lib/age";
import { uploadImageToConvexStorage } from "@/lib/convex-storage-upload";
import { launchIdentityVerification } from "@/lib/stripe/launch-identity-verification";
import { isStripeIdentityEnabled } from "@/lib/stripe/identity-enabled";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { OrgType } from "@/lib/types";

const STEPS = [
  "Details",
  "About",
  "Verification",
  "Payouts",
  "Review",
  "Submit",
] as const;

const DEFAULT_UNIVERSITY = "University of Oxford";
const MAX_DOCUMENTS = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function slugStorageKey(orgType: OrgType) {
  return orgType === "college"
    ? "dono:create-college:slug"
    : "dono:create-society:slug";
}

function persistOrgSlug(orgType: OrgType, slug: string) {
  if (Platform.OS === "web" && typeof sessionStorage !== "undefined") {
    try {
      sessionStorage.setItem(slugStorageKey(orgType), slug);
    } catch {
      // Ignore quota / private-mode failures — URL + in-memory still work.
    }
  }
}

function readPersistedOrgSlug(orgType: OrgType): string | null {
  if (Platform.OS === "web" && typeof sessionStorage !== "undefined") {
    try {
      return sessionStorage.getItem(slugStorageKey(orgType));
    } catch {
      return null;
    }
  }
  return null;
}

function clearPersistedOrgSlug(orgType: OrgType) {
  if (Platform.OS === "web" && typeof sessionStorage !== "undefined") {
    try {
      sessionStorage.removeItem(slugStorageKey(orgType));
    } catch {
      // ignore
    }
  }
}

interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string | null;
  fileSize?: number | null;
}

const initialForm = {
  name: "",
  description: "",
  story: "",
  website: "",
  secondaryLink: "",
};

function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function fileNameFromAsset(asset: ImagePicker.ImagePickerAsset): string {
  return asset.fileName ?? asset.uri.split("/").pop() ?? "file";
}

export type CreateOrgWizardProps = {
  orgType: OrgType;
};

export function CreateOrgWizard({ orgType }: CreateOrgWizardProps) {
  const isCollege = orgType === "college";
  const entityLabel = isCollege ? "college" : "society";
  const entityLabelCap = isCollege ? "College" : "Society";
  const createPath = isCollege ? "/create-college" : "/create-society";

  const { isAuthenticated, isLoading } = useConvexAuth();
  const params = useLocalSearchParams<{ connect?: string; slug?: string }>();
  const generateUploadUrl = useMutation(api.societies.generateUploadUrl);
  const createSociety = useMutation(api.societies.create);
  const acceptDocuments = useMutation(api.legal.acceptDocuments);
  const updateProfile = useMutation(api.users.updateProfile);
  const myProfile = useQuery(
    api.users.me,
    isAuthenticated && !isLoading ? {} : "skip",
  );
  const updateVerificationMaterials = useMutation(
    api.societies.updateVerificationMaterials,
  );
  const createVerificationSession = useAction(
    api.societyIdentity.createVerificationSession,
  );
  const refreshVerificationStatus = useAction(
    api.societyIdentity.refreshVerificationStatus,
  );
  const createConnectOnboardingLink = useAction(
    api.stripeConnect.createConnectOnboardingLink,
  );
  const refreshConnectAccountStatus = useAction(
    api.stripeConnect.refreshConnectAccountStatus,
  );
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [coverImage, setCoverImage] = useState<PickedFile | null>(null);
  const [supportingDocs, setSupportingDocs] = useState<PickedFile[]>([]);
  const [idDocument, setIdDocument] = useState<PickedFile | null>(null);
  const [pickingCover, setPickingCover] = useState(false);
  const [pickingDocs, setPickingDocs] = useState(false);
  const [pickingId, setPickingId] = useState(false);
  const [societySlug, setSocietySlug] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [docsPopupVisible, setDocsPopupVisible] = useState(false);
  const [syncingMaterials, setSyncingMaterials] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [dobInput, setDobInput] = useState("");
  const [dobError, setDobError] = useState<string | null>(null);
  const [dobSaving, setDobSaving] = useState(false);
  // Storage ids of docs already uploaded, keyed by local uri, so revisions
  // after the society exists don't re-upload unchanged files.
  const uploadedDocIds = useRef(new Map<string, Id<"_storage">>());

  // Once a slug exists, this reflects the webhook-driven status in real time.
  // Skip until Convex auth is ready — Stripe return restores slug before the
  // session finishes loading, and getMine requires a signed-in user.
  const verification = useQuery(
    api.societies.getMine,
    societySlug && isAuthenticated && !isLoading
      ? { slug: societySlug }
      : "skip",
  );
  const connectStatus = useQuery(
    api.stripeConnectInternal.getMyConnectStatus,
    societySlug && isAuthenticated && !isLoading
      ? { communitySlug: societySlug }
      : "skip",
  );


  // Resume after Stripe Connect redirect (full page reload drops React state).
  const resumeHandled = useRef(false);
  useEffect(() => {
    if (resumeHandled.current) return;
    // Wait for auth — otherwise getMine / refreshConnect race UNAUTHENTICATED.
    if (isLoading || !isAuthenticated) return;
    const connectParam =
      typeof params.connect === "string" ? params.connect : null;
    if (connectParam !== "return" && connectParam !== "refresh") return;

    const paramSlug =
      typeof params.slug === "string" && params.slug.trim()
        ? params.slug.trim()
        : null;
    const restoredSlug = paramSlug ?? readPersistedOrgSlug(orgType);
    if (!restoredSlug) return;

    resumeHandled.current = true;
    setSocietySlug(restoredSlug);
    persistOrgSlug(orgType, restoredSlug);
    setStep(3);
    void refreshConnectAccountStatus({ communitySlug: restoredSlug }).catch(
      () => {},
    );
  }, [
    params.connect,
    params.slug,
    refreshConnectAccountStatus,
    isAuthenticated,
    isLoading,
    orgType,
  ]);


  // Fallback to the webhook: directly poll Stripe every few seconds while
  // unverified, in case the webhook is delayed, misconfigured, or hasn't
  // reached this deployment. Stops as soon as the query reflects "verified".
  useEffect(() => {
    if (
      !isStripeIdentityEnabled() ||
      !societySlug ||
      verification?.stripeVerificationStatus === "verified"
    ) {
      return;
    }
    const interval = setInterval(() => {
      void refreshVerificationStatus({ slug: societySlug }).catch(() => {
        // Best-effort background poll — surfaced errors would be noisy here;
        // the webhook or the next tick may still succeed.
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [societySlug, verification?.stripeVerificationStatus, refreshVerificationStatus]);

  const update = (field: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const pickCoverImage = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to add a cover image.");
      return;
    }

    setPickingCover(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
        setError("The cover image must be 5MB or smaller.");
        return;
      }

      setCoverImage({
        uri: asset.uri,
        name: fileNameFromAsset(asset),
        mimeType: asset.mimeType,
        fileSize: asset.fileSize,
      });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setPickingCover(false);
    }
  };

  const pickSupportingDocuments = async () => {
    if (supportingDocs.length >= MAX_DOCUMENTS) {
      setError(`You can add up to ${MAX_DOCUMENTS} supporting documents.`);
      return;
    }

    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to add supporting documents.");
      return;
    }

    setPickingDocs(true);
    try {
      const remaining = MAX_DOCUMENTS - supportingDocs.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        quality: 0.85,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const nextDocs: PickedFile[] = [];
      for (const asset of result.assets) {
        if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
          setError("Each supporting document must be 5MB or smaller.");
          return;
        }
        nextDocs.push({
          uri: asset.uri,
          name: fileNameFromAsset(asset),
          mimeType: asset.mimeType,
          fileSize: asset.fileSize,
        });
      }

      setSupportingDocs((current) => [...current, ...nextDocs].slice(0, MAX_DOCUMENTS));
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setPickingDocs(false);
    }
  };

  const removeSupportingDocument = (index: number) => {
    setSupportingDocs((current) => current.filter((_, i) => i !== index));
  };

  const pickIdDocument = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to add your student card.");
      return;
    }

    setPickingId(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
        setError("The student card image must be 5MB or smaller.");
        return;
      }

      setIdDocument({
        uri: asset.uri,
        name: fileNameFromAsset(asset),
        mimeType: asset.mimeType,
        fileSize: asset.fileSize,
      });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setPickingId(false);
    }
  };

  const uploadPickedFile = async (file: PickedFile): Promise<Id<"_storage">> => {
    const uploadUrl = await generateUploadUrl({});
    return await uploadImageToConvexStorage(uploadUrl, file.uri, file.mimeType);
  };

  /** Creates the org record (once) so Stripe Identity has a record to attach to. */
  const ensureSocietyCreated = async (): Promise<string> => {
    if (societySlug) return societySlug;
    if (!legalAccepted) {
      throw new Error(`Please accept the ${entityLabel} terms to continue.`);
    }
    if (!idDocument) {
      throw new Error("A student card is required.");
    }

    await acceptDocuments({ context: "create_society" });

    const coverImageStorageId = coverImage
      ? await uploadPickedFile(coverImage)
      : undefined;

    const supportingDocumentStorageIds: Id<"_storage">[] = [];
    for (const doc of supportingDocs) {
      const storageId = await uploadPickedFile(doc);
      uploadedDocIds.current.set(doc.uri, storageId);
      supportingDocumentStorageIds.push(storageId);
    }

    const idDocumentStorageId = await uploadPickedFile(idDocument);

    const result = await createSociety({
      name: form.name,
      description: form.description,
      story: form.story,
      websiteUrl: form.website,
      secondaryLink: form.secondaryLink.trim() || undefined,
      coverImageStorageId,
      supportingDocumentStorageIds,
      idDocumentStorageId,
      orgType,
    });

    setSocietySlug(result.slug);
    persistOrgSlug(orgType, result.slug);
    return result.slug;
  };

  const handleSaveDateOfBirth = async () => {
    setDobError(null);
    const trimmed = dobInput.trim();
    if (!parseIsoDateOnly(trimmed)) {
      setDobError("Enter your date of birth as YYYY-MM-DD.");
      return;
    }
    if (!isAtLeastAge(trimmed)) {
      setDobError(`You must be at least 18 years old to create a ${entityLabel}.`);
      return;
    }
    setDobSaving(true);
    try {
      await updateProfile({
        name: myProfile?.name ?? "",
        dateOfBirth: trimmed,
      });
      setDobInput("");
    } catch (err) {
      setDobError(getFriendlyAuthError(err));
    } finally {
      setDobSaving(false);
    }
  };

  const handleVerifyIdentity = async () => {
    setError(null);
    if (!hasDateOfBirth) {
      setError("Please confirm your date of birth before verifying your identity.");
      return;
    }
    if (!legalAccepted) {
      setError(`Please accept the ${entityLabel} terms before verifying your identity.`);
      return;
    }
    setVerifying(true);
    try {
      const slug = await ensureSocietyCreated();
      const { clientSecret, url } = await createVerificationSession({ slug });
      const result = await launchIdentityVerification({ clientSecret, url });
      if (result.error) {
        setError(result.error);
      } else {
        // Don't wait on the webhook — ask Stripe directly as soon as the
        // user finishes, the background poll (above) picks up from here.
        void refreshVerificationStatus({ slug }).catch(() => {});
      }
    } catch (err) {
      setError(getFriendlyAuthError(err) || "Could not start verification.");
    } finally {
      setVerifying(false);
    }
  };

  const websiteInvalid = !isValidOptionalUrl(form.website);
  const secondaryLinkInvalid = !isValidOptionalUrl(form.secondaryLink);
  const manualFieldsValid =
    idDocument !== null && !websiteInvalid && !secondaryLinkInvalid;

  /**
   * The society record is created the moment identity verification starts,
   * so documents or links changed after that are pushed to the server as the
   * user leaves the verification step.
   */
  const syncVerificationMaterials = async (slug: string) => {
    const supportingDocumentStorageIds: Id<"_storage">[] = [];
    for (const doc of supportingDocs) {
      let storageId = uploadedDocIds.current.get(doc.uri);
      if (!storageId) {
        storageId = await uploadPickedFile(doc);
        uploadedDocIds.current.set(doc.uri, storageId);
      }
      supportingDocumentStorageIds.push(storageId);
    }
    await updateVerificationMaterials({
      slug,
      websiteUrl: form.website,
      secondaryLink: form.secondaryLink.trim() || undefined,
      supportingDocumentStorageIds,
    });
  };

  const continueFromVerification = async () => {
    setError(null);
    setSyncingMaterials(true);
    try {
      const slug = societySlug ?? (await ensureSocietyCreated());
      await syncVerificationMaterials(slug);
      setStep(3);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setSyncingMaterials(false);
    }
  };

  const connectReturnUrls = (slug: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const origin = window.location.origin;
      return {
        returnUrl: `${origin}${createPath}?connect=return&slug=${encodeURIComponent(slug)}`,
        refreshUrl: `${origin}${createPath}?connect=refresh&slug=${encodeURIComponent(slug)}`,
      };
    }
    return {
      returnUrl: ExpoLinking.createURL(createPath, {
        queryParams: { connect: "return", slug },
      }),
      refreshUrl: ExpoLinking.createURL(createPath, {
        queryParams: { connect: "refresh", slug },
      }),
    };
  };

  const handleConnectOnboarding = async () => {
    if (!societySlug) return;
    setError(null);
    setConnectLoading(true);
    try {
      persistOrgSlug(orgType, societySlug);
      const urls = connectReturnUrls(societySlug);
      const { url } = await createConnectOnboardingLink({
        communitySlug: societySlug,
        returnUrl: urls.returnUrl,
        refreshUrl: urls.refreshUrl,
      });
      await Linking.openURL(url);
      // Soft refresh after returning — user may stay in this tab on web.
      void refreshConnectAccountStatus({ communitySlug: societySlug }).catch(
        () => {},
      );
    } catch (err) {
      setError(getFriendlyAuthError(err) || "Could not start payout setup.");
    } finally {
      setConnectLoading(false);
    }
  };

  const handleContinue = () => {
    if (step === 2) {
      if (supportingDocs.length === 0) {
        setDocsPopupVisible(true);
        return;
      }
      void continueFromVerification();
      return;
    }
    setStep(step + 1);
  };

  const stripeStatus = verification?.stripeVerificationStatus ?? null;
  const stripeVerified = stripeStatus === "verified";
  const dobLoading = isAuthenticated && myProfile === undefined;
  const hasDateOfBirth = Boolean(myProfile?.dateOfBirth);
  // requires_input is Stripe's status both for "awaiting your first
  // submission" (its normal initial state) and "a check ran and failed" —
  // only the presence of a real last_error means an actual attempt failed.
  const hasVerificationError = Boolean(
    verification?.stripeVerificationLastErrorCode ||
      verification?.stripeVerificationLastErrorReason,
  );
  const stripeFailed =
    stripeStatus === "canceled" ||
    (stripeStatus === "requires_input" && hasVerificationError);

  const connectReady =
    connectStatus?.exists === true &&
    (connectStatus.cardPaymentsActive || connectStatus.chargesEnabled);
  const connectStarted = connectStatus?.exists === true;

  // Poll Connect status while on the Payouts step after the user opens Stripe.
  useEffect(() => {
    if (!societySlug || step !== 3 || connectReady || !connectStarted) return;
    const interval = setInterval(() => {
      void refreshConnectAccountStatus({ communitySlug: societySlug }).catch(
        () => {},
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [societySlug, step, connectReady, connectStarted, refreshConnectAccountStatus]);

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.name.trim().length > 0;
      case 1:
        return form.description.trim().length > 0 && form.story.trim().length > 0;
      case 2:
        // Student card + DOB + legal + Stripe Identity verified.
        return (
          legalAccepted &&
          manualFieldsValid &&
          hasDateOfBirth &&
          stripeVerified
        );
      case 3:
        // Require at least that a Connect account was created / onboarding started.
        return connectStarted;
      default:
        return true;
    }
  };

  const renderVerificationStatus = () => {
    if (!stripeStatus) return null;
    if (stripeVerified) {
      return (
        <View className="flex-row items-center gap-2 rounded-xl bg-green-50 px-3 py-2">
          <ShieldCheck size={14} color="#15803d" />
          <Text className="text-xs text-green-800">Verified</Text>
        </View>
      );
    }
    return (
      <View className="flex-row items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
        <VerifyingIndicator size={14} color="#b45309" />
        <Text className="text-xs text-amber-800">
          Verifying your identity... you can keep filling in the form
        </Text>
      </View>
    );
  };

  const inputClass =
    "w-full rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 font-retro-mono text-sm text-retro-ink outline-none";
  const secondaryActionClass =
    "flex-row items-center gap-2 rounded-lg border-2 border-retro-ink bg-white px-3 py-2";
  const inkActionClass =
    "flex-row items-center justify-center gap-2 rounded-lg bg-retro-ink px-4 py-2.5";

  if (isLoading) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppShell>
        <LoginGate message={`If you're a student, sign in with your Oxford email to create a ${entityLabel}.`} />
      </AppShell>
    );
  }

  if (isAlumni(myProfile)) {
    return (
      <AppShell>
        <DonorCreateGate
          message={`Donor accounts can't create a ${entityLabel}. Browse communities to follow one instead.`}
          backHref="/societies"
          backLabel="Browse communities"
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-2xl gap-6 px-4 py-8">
        <View className="items-center gap-2">
          <Text className="font-retro-display text-2xl text-retro-ink">
            {isCollege ? "Create a College" : "Create a Society"}
          </Text>
          <Text className="text-center font-retro-mono text-sm text-retro-ink/70">
            {isCollege
              ? "Set up your college's page and verify it so alumni can find and support it."
              : "Set up your society's page and verify it so alumni can find and support it."}
          </Text>
        </View>

        <View className="w-full flex-row items-start">
          {STEPS.map((label, i) => (
            <View key={label} className="flex-1 items-center">
              <View className="w-full flex-row items-center">
                {i > 0 ? (
                  <View
                    className={`h-0.5 flex-1 ${
                      i <= step ? "bg-retro-mint" : "bg-retro-ink/20"
                    }`}
                  />
                ) : (
                  <View className="flex-1" />
                )}
                <View
                  className={`h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-retro-ink ${
                    i <= step ? "bg-retro-mint" : "bg-retro-cream"
                  }`}
                >
                  {i < step || (i === step && step === 5 && stripeVerified) ? (
                    <CheckCircle2 size={16} color="#17211B" />
                  ) : (
                    <Text
                      className={`font-retro-mono text-xs ${
                        i === step ? "text-white" : "text-[#5c574f]"
                      }`}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
                {i < STEPS.length - 1 ? (
                  <View
                    className={`h-0.5 flex-1 ${
                      i < step ? "bg-retro-mint" : "bg-retro-ink/20"
                    }`}
                  />
                ) : (
                  <View className="flex-1" />
                )}
              </View>
              <Text className="mt-1 text-center font-retro-mono text-[10px] text-retro-ink/60">
                {label}
              </Text>
            </View>
          ))}
        </View>

        {error ? (
          <View className="rounded-lg border border-red-300 bg-red-50 px-3 py-2">
            <Text className="font-retro-mono text-xs text-red-800">{error}</Text>
          </View>
        ) : null}

        {step === 0 && (
          <View className="gap-4">
            <View className="gap-3">
              <Text className="font-retro-display text-lg text-retro-ink">
                {entityLabelCap} name
              </Text>
              <TextInput
                value={form.name}
                onChangeText={(v) => update("name", v)}
                placeholder={
                  isCollege
                    ? "e.g. St Anne's College"
                    : "e.g. Oxford Computing Society"
                }
                placeholderTextColor="#56615A"
                className={inputClass}
              />
            </View>

            <View className="gap-3">
              <Text className="font-retro-display text-lg text-retro-ink">
                Cover image
              </Text>
              <Text className="font-retro-mono text-xs text-retro-ink/60">
                Optional. JPG or PNG, 5MB max.
              </Text>
              <CampaignImage image={coverImage?.uri ?? "default"} className="h-48" />
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => void pickCoverImage()}
                  disabled={pickingCover}
                  className={`${secondaryActionClass} ${pickingCover ? "opacity-50" : ""}`}
                >
                  {pickingCover ? (
                    <ActivityIndicator color="#17211B" />
                  ) : (
                    <ImagePlus size={16} color="#17211B" />
                  )}
                  <Text className="font-retro-mono text-xs text-retro-ink">
                    {pickingCover
                      ? "Opening library..."
                      : coverImage
                        ? "Replace image"
                        : "Upload cover"}
                  </Text>
                </Pressable>
                {coverImage ? (
                  <Pressable
                    onPress={() => setCoverImage(null)}
                    className="rounded-lg border-2 border-retro-ink/30 px-3 py-2"
                  >
                    <Text className="font-retro-mono text-xs text-retro-ink/70">
                      Remove
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
        )}

        {step === 1 && (
          <View className="gap-4">
            <View className="gap-3">
              <Text className="font-retro-display text-lg text-retro-ink">
                Short description
              </Text>
              <TextInput
                value={form.description}
                onChangeText={(v) => update("description", v)}
                placeholder={
                  isCollege
                    ? "One-line summary of your college"
                    : "One-line summary of your society"
                }
                placeholderTextColor="#56615A"
                className={inputClass}
              />
            </View>
            <View className="gap-3">
              <Text className="font-retro-display text-lg text-retro-ink">
                About your {entityLabel}
              </Text>
              <TextInput
                value={form.story}
                onChangeText={(v) => update("story", v)}
                placeholder={
                  isCollege
                    ? "Tell alumni about your college and why it matters..."
                    : "Tell alumni what your society does and why it matters..."
                }
                placeholderTextColor="#56615A"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className={`${inputClass} min-h-[140px]`}
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="gap-4">
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <Paperclip size={16} color="#17211B" />
                <Text className="font-retro-display text-lg text-retro-ink">
                  Supporting documents
                </Text>
              </View>
              <Text className="font-retro-mono text-xs text-retro-ink/60">
                {isCollege
                  ? "Upload proof of official university recognition or another document that confirms you represent this college. Optional — but approval is less likely without supporting documentation."
                  : "Upload your society's constitution or proof of official university recognition. Optional — but approval is less likely without supporting documentation."}
              </Text>

              {supportingDocs.length > 0 ? (
                <View className="gap-2">
                  {supportingDocs.map((doc, index) => (
                    <View
                      key={`${doc.uri}-${index}`}
                      className="flex-row items-center gap-3 rounded-lg border-2 border-retro-ink/20 bg-white p-2"
                    >
                      <Image
                        source={{ uri: doc.uri }}
                        style={{ width: 40, height: 40, borderRadius: 8 }}
                        resizeMode="cover"
                        accessibilityLabel="Supporting document thumbnail"
                      />
                      <Text
                        className="flex-1 font-retro-mono text-sm text-retro-ink"
                        numberOfLines={1}
                      >
                        {doc.name}
                      </Text>
                      <Pressable
                        onPress={() => removeSupportingDocument(index)}
                        className="h-6 w-6 items-center justify-center rounded-full bg-retro-cream"
                      >
                        <Text className="font-retro-mono text-xs text-retro-ink">
                          ×
                        </Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : null}

              <Pressable
                onPress={() => void pickSupportingDocuments()}
                disabled={pickingDocs || supportingDocs.length >= MAX_DOCUMENTS}
                className={`${secondaryActionClass} self-start ${
                  pickingDocs || supportingDocs.length >= MAX_DOCUMENTS
                    ? "opacity-50"
                    : ""
                }`}
              >
                <Paperclip size={16} color="#17211B" />
                <Text className="font-retro-mono text-xs text-retro-ink">
                  {pickingDocs ? "Opening library..." : "Add document"}
                </Text>
              </Pressable>
            </View>

            <View className="gap-3 border-t border-retro-ink/20 pt-4">
              <View className="flex-row items-center gap-2">
                <Globe size={16} color="#17211B" />
                <Text className="font-retro-display text-lg text-retro-ink">
                  Website &amp; links
                </Text>
              </View>
              <View className="gap-4">
                <View className="gap-1.5">
                  <Text className="font-retro-mono text-xs text-retro-ink">
                    Website URL (optional)
                  </Text>
                  <TextInput
                    value={form.website}
                    onChangeText={(v) => update("website", v)}
                    placeholder={
                      isCollege
                        ? "e.g. https://st-annes.ox.ac.uk"
                        : "e.g. https://oxfordsociety.co.uk"
                    }
                    placeholderTextColor="#56615A"
                    autoCapitalize="none"
                    keyboardType="url"
                    className={inputClass}
                  />
                  {websiteInvalid ? (
                    <Text className="font-retro-mono text-[10px] text-red-700">
                      Enter a valid URL
                    </Text>
                  ) : null}
                </View>
                <View className="gap-1.5">
                  <View className="flex-row items-center gap-1.5">
                    <Link2 size={14} color="#17211B" />
                    <Text className="font-retro-mono text-xs text-retro-ink">
                      Secondary link (social media, optional)
                    </Text>
                  </View>
                  <TextInput
                    value={form.secondaryLink}
                    onChangeText={(v) => update("secondaryLink", v)}
                    placeholder={
                      isCollege
                        ? "e.g. https://instagram.com/stannescollege"
                        : "e.g. https://instagram.com/oxfordsociety"
                    }
                    placeholderTextColor="#56615A"
                    autoCapitalize="none"
                    keyboardType="url"
                    className={inputClass}
                  />
                  {secondaryLinkInvalid ? (
                    <Text className="font-retro-mono text-[10px] text-red-700">
                      Enter a valid URL
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>

            <View className="gap-3 rounded-lg border-2 border-retro-ink/20 bg-white p-3">
              <View className="flex-row items-center gap-2">
                <IdCard size={16} color="#17211B" />
                <Text className="font-retro-display text-base text-retro-ink">
                  Student verification
                </Text>
              </View>
              <Text className="font-retro-mono text-xs text-retro-ink/60">
                Upload a photo of your Bodleian / university student card to confirm
                you&apos;re a current student setting up this {entityLabel}. Only
                student cards are accepted. This is used for verification only and
                is never shown publicly.
              </Text>

              {!dobLoading && !hasDateOfBirth ? (
                <View className="gap-2 rounded-lg border-2 border-retro-ink/20 bg-retro-cream/40 p-3">
                  <Text className="font-retro-mono text-xs text-retro-ink">
                    Confirm you are 18+ (YYYY-MM-DD)
                  </Text>
                  <TextInput
                    value={dobInput}
                    onChangeText={setDobInput}
                    placeholder="1998-05-21"
                    placeholderTextColor="#56615A"
                    autoCapitalize="none"
                    className={inputClass}
                  />
                  {dobError ? (
                    <Text className="font-retro-mono text-[10px] text-red-700">
                      {dobError}
                    </Text>
                  ) : null}
                  <Pressable
                    onPress={() => void handleSaveDateOfBirth()}
                    disabled={dobSaving || !dobInput.trim()}
                    className={`self-start rounded-lg bg-retro-ink px-3 py-2 ${
                      dobSaving || !dobInput.trim() ? "opacity-50" : ""
                    }`}
                  >
                    {dobSaving ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-retro-mono text-xs text-white">
                        Save date of birth
                      </Text>
                    )}
                  </Pressable>
                </View>
              ) : null}

              {idDocument ? (
                <View className="flex-row items-center gap-3 rounded-lg border-2 border-retro-ink/20 bg-white p-2">
                  <Image
                    source={{ uri: idDocument.uri }}
                    style={{ width: 40, height: 40, borderRadius: 8 }}
                    resizeMode="cover"
                    accessibilityLabel="Student card thumbnail"
                  />
                  <Text
                    className="flex-1 font-retro-mono text-sm text-retro-ink"
                    numberOfLines={1}
                  >
                    {idDocument.name}
                  </Text>
                  <Pressable
                    onPress={() => setIdDocument(null)}
                    className="h-6 w-6 items-center justify-center rounded-full bg-retro-cream"
                  >
                    <Text className="font-retro-mono text-xs text-retro-ink">×</Text>
                  </Pressable>
                </View>
              ) : null}

              <Pressable
                onPress={() => void pickIdDocument()}
                disabled={pickingId}
                className={`${secondaryActionClass} self-start ${
                  pickingId ? "opacity-50" : ""
                }`}
              >
                <IdCard size={16} color="#17211B" />
                <Text className="font-retro-mono text-xs text-retro-ink">
                  {pickingId
                    ? "Opening library..."
                    : idDocument
                      ? "Replace student card"
                      : "Add student card"}
                </Text>
              </Pressable>
            </View>

            <View className="gap-3 rounded-lg border-2 border-retro-ink/20 bg-white p-3">
              <View className="flex-row items-center gap-2">
                <ShieldCheck size={16} color="#17211B" />
                <Text className="font-retro-display text-base text-retro-ink">
                  Identity check
                </Text>
              </View>
              <Text className="font-retro-mono text-xs text-retro-ink/60">
                You&apos;ll be asked for a quick photo of your ID and a selfie so we
                can confirm it&apos;s really you — it only takes a minute.
              </Text>

              <LegalAcceptanceCheckbox
                context="create_society"
                accepted={legalAccepted}
                onAcceptedChange={setLegalAccepted}
              />

              {renderVerificationStatus()}

              <Pressable
                onPress={() => void handleVerifyIdentity()}
                disabled={
                  !manualFieldsValid ||
                  verifying ||
                  stripeVerified ||
                  !legalAccepted ||
                  !hasDateOfBirth
                }
                className={`${inkActionClass} self-start ${
                  !manualFieldsValid ||
                  verifying ||
                  stripeVerified ||
                  !legalAccepted ||
                  !hasDateOfBirth
                    ? "opacity-50"
                    : ""
                }`}
              >
                {verifying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-retro-mono text-sm text-white">
                    Verify your identity
                  </Text>
                )}
              </Pressable>
              {!hasDateOfBirth ? (
                <Text className="font-retro-mono text-xs text-retro-ink/60">
                  Confirm your date of birth above before starting identity
                  verification.
                </Text>
              ) : !legalAccepted ? (
                <Text className="font-retro-mono text-xs text-retro-ink/60">
                  Accept the terms above before starting identity verification.
                </Text>
              ) : !manualFieldsValid ? (
                <Text className="font-retro-mono text-xs text-retro-ink/60">
                  Add your student card above first.
                </Text>
              ) : stripeFailed ? (
                <Text className="font-retro-mono text-xs text-red-700">
                  That didn&apos;t go through — please try again.
                </Text>
              ) : !stripeVerified ? (
                <Text className="font-retro-mono text-xs text-retro-ink/60">
                  You&apos;ll be able to continue once your identity is verified.
                </Text>
              ) : null}
            </View>
          </View>
        )}

        {step === 3 && (
          <View className="gap-4">
            <Text className="font-retro-display text-lg text-retro-ink">
              Stripe payouts
            </Text>
            <Text className="font-retro-mono text-xs text-retro-ink/70">
              Set up a Stripe merchant account so your {entityLabel} can accept
              campaign donations directly. Dono collects a 5% + 20p fee on each gift
              (shared with Stripe processing). This is separate from identity
              verification and only takes a few minutes.
            </Text>
            {connectReady ? (
              <View className="flex-row items-center gap-2 rounded-xl bg-green-50 px-3 py-2">
                <ShieldCheck size={14} color="#15803d" />
                <Text className="text-xs text-green-800">
                  Stripe payments active
                </Text>
              </View>
            ) : connectStarted ? (
              <View className="flex-row items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
                <VerifyingIndicator size={14} color="#b45309" />
                <Text className="text-xs text-amber-800">
                  Finish the Stripe form if it&apos;s still open — we&apos;ll update
                  this automatically.
                </Text>
              </View>
            ) : null}
            <Pressable
              onPress={() => void handleConnectOnboarding()}
              disabled={!societySlug || connectLoading || connectReady}
              className={`flex-row items-center justify-center gap-2 rounded-lg border-2 border-retro-ink bg-white px-4 py-3 ${
                !societySlug || connectLoading || connectReady ? "opacity-50" : ""
              }`}
            >
              {connectLoading ? (
                <ActivityIndicator color="#17211B" />
              ) : (
                <>
                  <Banknote size={16} color="#17211B" />
                  <Text className="font-retro-mono text-sm text-retro-ink">
                    {connectStarted
                      ? "Continue Stripe setup"
                      : "Set up Stripe Connect"}
                  </Text>
                </>
              )}
            </Pressable>
            {!connectStarted ? (
              <Text className="font-retro-mono text-xs text-retro-ink/60">
                You need to start payout setup before continuing. You can finish bank
                details later from Communities if you leave mid-flow.
              </Text>
            ) : null}
          </View>
        )}

        {step === 4 && (
          <View className="gap-4">
            <Text className="font-retro-display text-lg text-retro-ink">
              Review your {entityLabel}
            </Text>
            <Text className="font-retro-mono text-xs text-retro-ink/70">
              Check the details below before submitting for verification.
            </Text>

            <CampaignImage image={coverImage?.uri ?? "default"} className="h-40" />

            <View className="gap-1">
              <Text className="font-retro-display text-xl text-retro-ink">
                {form.name || `Untitled ${entityLabel}`}
              </Text>
              <Text className="font-retro-mono text-sm text-retro-ink/60">
                {DEFAULT_UNIVERSITY}
              </Text>
              {form.description ? (
                <Text className="mt-1 font-retro-mono text-sm text-retro-ink/70">
                  {form.description}
                </Text>
              ) : null}
            </View>

            {form.story ? (
              <View className="gap-2 rounded-lg border-2 border-retro-ink/20 bg-white p-3">
                <Text className="font-retro-mono text-xs text-retro-ink">About</Text>
                <Text className="font-retro-mono text-sm leading-relaxed text-retro-ink/70">
                  {form.story}
                </Text>
              </View>
            ) : null}

            <View className="gap-2 rounded-lg border-2 border-retro-ink/20 bg-white p-3">
              <Text className="mb-1 font-retro-mono text-xs text-retro-ink">
                Verification
              </Text>
              <View className="flex-row items-center gap-2">
                <CheckCircle2
                  size={14}
                  color={supportingDocs.length > 0 ? "#17211B" : "#56615A"}
                />
                <Text className="font-retro-mono text-sm text-retro-ink/70">
                  {supportingDocs.length} supporting document
                  {supportingDocs.length === 1 ? "" : "s"} attached
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <CheckCircle2 size={14} color={idDocument ? "#17211B" : "#56615A"} />
                <Text className="font-retro-mono text-sm text-retro-ink/70">
                  {idDocument ? "Student card provided" : "No student card provided"}
                </Text>
              </View>
              <Text className="font-retro-mono text-sm text-retro-ink/70">
                Website: {form.website.trim() || "Not provided"}
              </Text>
              <Text className="font-retro-mono text-sm text-retro-ink/70">
                Secondary link: {form.secondaryLink.trim() || "Not provided"}
              </Text>
              <View className="mt-1">{renderVerificationStatus()}</View>
              <View className="mt-2 flex-row items-center gap-2">
                <CheckCircle2
                  size={14}
                  color={connectReady ? "#17211B" : "#56615A"}
                />
                <Text className="font-retro-mono text-sm text-retro-ink/70">
                  {connectReady
                    ? "Stripe payments active"
                    : connectStarted
                      ? "Stripe setup started"
                      : "Stripe setup not started"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {step === 5 && (
          <View className="items-center gap-3 py-4">
            {stripeVerified ? (
              <>
                <View className="gap-3 rounded-lg border-2 border-retro-ink bg-retro-mint/30 p-4">
                  <View className="flex-row items-center justify-center gap-2">
                    <CheckCircle2 size={20} color="#17211B" />
                    <Text className="font-retro-display text-base text-retro-ink">
                      Application submitted
                    </Text>
                  </View>
                  <Text className="text-center font-retro-mono text-xs text-retro-ink/70">
                    Thanks — we&apos;ve received your {entityLabel}, its verification
                    documents, your Stripe identity check
                    {connectStarted ? ", and payout account setup" : ""}. We&apos;ll
                    review it and let you know once a decision is made.
                  </Text>
                  <Link href="/societies" asChild>
                    <Pressable
                      onPress={() => clearPersistedOrgSlug(orgType)}
                      className="self-center rounded-lg bg-retro-ink px-4 py-2.5"
                    >
                      <Text className="font-retro-mono text-sm text-white">
                        Back to Communities
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              </>
            ) : (
              <>
                <VerifyingIndicator size={48} color="#17211B" />
                <Text className="text-center font-retro-display text-lg text-retro-ink">
                  Verifying your identity...
                </Text>
                <Text className="text-center font-retro-mono text-sm leading-relaxed text-retro-ink/70">
                  Your {entityLabel} has already been submitted. This usually takes a
                  minute or two — feel free to leave this page open, it&apos;ll update
                  automatically the moment it&apos;s done.
                </Text>
              </>
            )}
          </View>
        )}

        <View className="flex-row items-center justify-between gap-3 pt-2">
          {step > 0 && step < 5 ? (
            <Pressable
              onPress={() => setStep(step - 1)}
              className="rounded-lg border-2 border-retro-ink/30 px-4 py-2.5"
            >
              <Text className="font-retro-mono text-sm text-retro-ink">Back</Text>
            </Pressable>
          ) : (
            <View />
          )}

          {step < 5 ? (
            <Pressable
              onPress={handleContinue}
              disabled={!canProceed() || syncingMaterials}
              className={`flex-row items-center gap-2 rounded-lg bg-retro-ink px-4 py-2.5 ${
                !canProceed() || syncingMaterials ? "opacity-50" : ""
              }`}
            >
              {syncingMaterials ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="font-retro-mono text-sm text-white">
                    {step === 4 ? "Submit" : "Continue"}
                  </Text>
                  <ArrowRight size={16} color="#fff" />
                </>
              )}
            </Pressable>
          ) : null}
        </View>
      </View>

      <Modal
        visible={docsPopupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDocsPopupVisible(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-6"
          onPress={() => setDocsPopupVisible(false)}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="w-full max-w-md"
          >
            <View className="rounded-lg border-2 border-retro-ink bg-white p-6">
              <View className="mb-3 flex-row items-center gap-2">
                <Paperclip size={18} color="#17211B" />
                <Text className="flex-1 font-retro-display text-base text-retro-ink">
                  Continue without supporting documents?
                </Text>
              </View>
              <Text className="font-retro-mono text-sm leading-relaxed text-retro-ink/70">
                {isCollege
                  ? "Approval is less likely without supporting documentation. Adding proof of university recognition makes it much easier for us to approve your college."
                  : "Approval is less likely without supporting documentation. Adding your society's constitution or proof of university recognition makes it much easier for us to approve your society."}
              </Text>
              <View className="mt-5 flex-row justify-end gap-2">
                <Pressable
                  onPress={() => setDocsPopupVisible(false)}
                  className="rounded-lg border-2 border-retro-ink/30 px-4 py-2.5"
                >
                  <Text className="font-retro-mono text-sm text-retro-ink">
                    Add documents
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setDocsPopupVisible(false);
                    void continueFromVerification();
                  }}
                  className="rounded-lg bg-retro-ink px-4 py-2.5"
                >
                  <Text className="font-retro-mono text-sm text-white">
                    Continue anyway
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </AppShell>
  );
}
