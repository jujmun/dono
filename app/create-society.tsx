import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
} from "react-native";
import { Link } from "expo-router";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {
  CheckCircle2,
  ArrowRight,
  ImagePlus,
  Paperclip,
  IdCard,
  Globe,
  Link2,
  ShieldCheck,
} from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { CampaignImage } from "@/components/ui/campaign-image";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { uploadImageToConvexStorage } from "@/lib/convex-storage-upload";
import { launchIdentityVerification } from "@/lib/stripe/launch-identity-verification";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

const dinoLogo = require("../assets/dino-hero.png");

const steps = ["Details", "About", "Verification", "Review", "Submit"];

const DEFAULT_UNIVERSITY = "University of Oxford";
const MAX_DOCUMENTS = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

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

/** Pulsing (bigger/smaller) shield icon — reads as "still working on it". */
function VerifyingIndicator({ size, color }: { size: number; color: string }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.25,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <ShieldCheck size={size} color={color} />
    </Animated.View>
  );
}

export default function CreateSocietyPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const generateUploadUrl = useMutation(api.societies.generateUploadUrl);
  const createSociety = useMutation(api.societies.create);
  const updateVerificationMaterials = useMutation(
    api.societies.updateVerificationMaterials,
  );
  const createVerificationSession = useAction(
    api.societyIdentity.createVerificationSession,
  );
  const refreshVerificationStatus = useAction(
    api.societyIdentity.refreshVerificationStatus,
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
  const [docsPopupVisible, setDocsPopupVisible] = useState(false);
  const [syncingMaterials, setSyncingMaterials] = useState(false);
  // Storage ids of docs already uploaded, keyed by local uri, so revisions
  // after the society exists don't re-upload unchanged files.
  const uploadedDocIds = useRef(new Map<string, Id<"_storage">>());

  // Once a slug exists, this reflects the webhook-driven status in real time.
  const verification = useQuery(
    api.societies.getMine,
    societySlug ? { slug: societySlug } : "skip",
  );

  // Fallback to the webhook: directly poll Stripe every few seconds while
  // unverified, in case the webhook is delayed, misconfigured, or hasn't
  // reached this deployment. Stops as soon as the query reflects "verified".
  useEffect(() => {
    if (!societySlug || verification?.stripeVerificationStatus === "verified") {
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

  /** Creates the society (once) so Stripe Identity has a record to attach to. */
  const ensureSocietyCreated = async (): Promise<string> => {
    if (societySlug) return societySlug;
    if (!idDocument) {
      throw new Error("A student card is required.");
    }

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
    });

    setSocietySlug(result.slug);
    return result.slug;
  };

  const handleVerifyIdentity = async () => {
    setError(null);
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
    if (!societySlug) return;
    setError(null);
    setSyncingMaterials(true);
    try {
      await syncVerificationMaterials(societySlug);
      setStep(3);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setSyncingMaterials(false);
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

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.name.trim().length > 0;
      case 1:
        return form.description.trim().length > 0 && form.story.trim().length > 0;
      case 2:
        // The manual ID document is already implied by societySlug existing
        // (societies.create enforces it). Identity verification itself can
        // finish in the background — don't block moving on while it's still
        // processing; the final step shows a waiting state until it's done.
        return societySlug !== null;
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
    "w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text";

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
        <LoginGate message="If you're a student, sign in with your Oxford email to create a society." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-2xl px-4 py-8">
        <View className="mb-8 items-center">
          <Text className="font-display-medium text-2xl text-dono-text">Create a Society</Text>
          <Text className="mt-1 text-center text-dono-muted">
            Set up your society's page and verify it so alumni can find and support it.
          </Text>
        </View>

        <View className="mb-8 items-center">
          <View className="flex-row items-center">
            {steps.map((s, i) => (
              <View key={s} className="flex-row items-center">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    i <= step ? "bg-dono-primary" : "bg-dono-surface-muted"
                  }`}
                >
                  {i < step ? (
                    <Image
                      source={dinoLogo}
                      style={{ width: 18, height: 18, tintColor: "#fff" }}
                      resizeMode="contain"
                      accessibilityLabel="Step complete"
                    />
                  ) : (
                    <Text
                      className={`text-xs font-bold ${
                        i === step ? "text-white" : "text-dono-muted"
                      }`}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
                {i < steps.length - 1 && (
                  <View
                    className={`mx-2 h-0.5 w-10 ${
                      i < step ? "bg-dono-primary" : "bg-dono-border"
                    }`}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          {step === 0 && (
            <View className="gap-5">
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Society Name
                </Text>
                <TextInput
                  value={form.name}
                  onChangeText={(v) => update("name", v)}
                  placeholder="e.g. Oxford Computing Society"
                  placeholderTextColor="#56615A"
                  className={inputClass}
                />
              </View>

              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Cover Image
                </Text>
                <View className="overflow-hidden rounded-2xl border border-dono-border">
                  <CampaignImage image={coverImage?.uri ?? "default"} className="h-48" />
                </View>
                <View className="mt-3 flex-row flex-wrap gap-2">
                  <Pressable
                    onPress={() => void pickCoverImage()}
                    disabled={pickingCover}
                    className={`flex-row items-center gap-2 rounded-full border border-dono-border px-4 py-2 ${
                      pickingCover ? "opacity-50" : ""
                    }`}
                  >
                    <ImagePlus size={16} color="#17211B" />
                    <Text className="font-sans-medium text-sm text-dono-text">
                      {pickingCover
                        ? "Opening library..."
                        : coverImage
                          ? "Change image"
                          : "Add cover image"}
                    </Text>
                  </Pressable>
                  {coverImage ? (
                    <Pressable
                      onPress={() => setCoverImage(null)}
                      className="rounded-full border border-dono-border px-4 py-2"
                    >
                      <Text className="font-sans-medium text-sm text-dono-muted">Remove</Text>
                    </Pressable>
                  ) : null}
                </View>
                <Text className="mt-1.5 text-xs text-dono-muted">
                  Optional. JPG or PNG, 5MB max.
                </Text>
              </View>
            </View>
          )}

          {step === 1 && (
            <View className="gap-5">
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Short Description
                </Text>
                <TextInput
                  value={form.description}
                  onChangeText={(v) => update("description", v)}
                  placeholder="One-line summary of your society"
                  placeholderTextColor="#56615A"
                  className={inputClass}
                />
              </View>
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  About Your Society
                </Text>
                <TextInput
                  value={form.story}
                  onChangeText={(v) => update("story", v)}
                  placeholder="Tell alumni what your society does and why it matters..."
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
            <View className="gap-6">
              <View>
                <View className="mb-1.5 flex-row items-center gap-2">
                  <Paperclip size={16} color="#17211B" />
                  <Text className="font-sans-medium text-sm text-dono-text">
                    Supporting Documents
                  </Text>
                </View>
                <Text className="mb-3 text-xs text-dono-muted">
                  Upload your society's constitution or proof of official university
                  recognition. Optional — but approval is less likely without
                  supporting documentation.
                </Text>

                {supportingDocs.length > 0 ? (
                  <View className="mb-3 gap-2">
                    {supportingDocs.map((doc, index) => (
                      <View
                        key={`${doc.uri}-${index}`}
                        className="flex-row items-center gap-3 rounded-xl border border-dono-border p-2"
                      >
                        <Image
                          source={{ uri: doc.uri }}
                          style={{ width: 40, height: 40, borderRadius: 8 }}
                          resizeMode="cover"
                          accessibilityLabel="Supporting document thumbnail"
                        />
                        <Text
                          className="flex-1 text-sm text-dono-text"
                          numberOfLines={1}
                        >
                          {doc.name}
                        </Text>
                        <Pressable
                          onPress={() => removeSupportingDocument(index)}
                          className="h-6 w-6 items-center justify-center rounded-full bg-dono-surface-muted"
                        >
                          <Text className="text-xs font-bold text-dono-text">×</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : null}

                <Pressable
                  onPress={() => void pickSupportingDocuments()}
                  disabled={pickingDocs || supportingDocs.length >= MAX_DOCUMENTS}
                  className={`flex-row items-center justify-center gap-2 self-start rounded-full border border-dono-border px-4 py-2 ${
                    pickingDocs || supportingDocs.length >= MAX_DOCUMENTS ? "opacity-50" : ""
                  }`}
                >
                  <Paperclip size={16} color="#17211B" />
                  <Text className="font-sans-medium text-sm text-dono-text">
                    {pickingDocs ? "Opening library..." : "Add document"}
                  </Text>
                </Pressable>
              </View>

              <View className="border-t border-dono-border pt-6">
                <View className="mb-3 flex-row items-center gap-2">
                  <Globe size={16} color="#17211B" />
                  <Text className="font-sans-medium text-sm text-dono-text">
                    Website &amp; Links
                  </Text>
                </View>
                <View className="gap-4">
                  <View>
                    <Text className="mb-1.5 text-sm text-dono-muted">
                      Website URL (optional)
                    </Text>
                    <TextInput
                      value={form.website}
                      onChangeText={(v) => update("website", v)}
                      placeholder="e.g. https://oxfordsociety.co.uk"
                      placeholderTextColor="#56615A"
                      autoCapitalize="none"
                      keyboardType="url"
                      className={inputClass}
                    />
                    {websiteInvalid ? (
                      <Text className="mt-1 text-xs text-rose-700">
                        Enter a valid URL, e.g. https://example.com
                      </Text>
                    ) : null}
                  </View>
                  <View>
                    <View className="mb-1.5 flex-row items-center gap-1.5">
                      <Link2 size={12} color="#56615A" />
                      <Text className="text-sm text-dono-muted">
                        Secondary link (social media, optional)
                      </Text>
                    </View>
                    <TextInput
                      value={form.secondaryLink}
                      onChangeText={(v) => update("secondaryLink", v)}
                      placeholder="e.g. https://instagram.com/oxfordsociety"
                      placeholderTextColor="#56615A"
                      autoCapitalize="none"
                      keyboardType="url"
                      className={inputClass}
                    />
                    {secondaryLinkInvalid ? (
                      <Text className="mt-1 text-xs text-rose-700">
                        Enter a valid URL, e.g. https://example.com
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View className="rounded-xl border border-dono-border bg-dono-surface-muted p-4">
                <View className="mb-1.5 flex-row items-center gap-2">
                  <IdCard size={16} color="#17211B" />
                  <Text className="font-sans-medium text-sm text-dono-text">
                    Student Verification
                  </Text>
                </View>
                <Text className="mb-3 text-xs text-dono-muted">
                  Upload a photo of your student card to confirm you're a current student
                  setting up this society. Only student cards are accepted. This is used
                  for verification only and is never shown publicly.
                </Text>

                {idDocument ? (
                  <View className="mb-3 flex-row items-center gap-3 rounded-xl border border-dono-border bg-white p-2">
                    <Image
                      source={{ uri: idDocument.uri }}
                      style={{ width: 40, height: 40, borderRadius: 8 }}
                      resizeMode="cover"
                      accessibilityLabel="Student card thumbnail"
                    />
                    <Text className="flex-1 text-sm text-dono-text" numberOfLines={1}>
                      {idDocument.name}
                    </Text>
                    <Pressable
                      onPress={() => setIdDocument(null)}
                      className="h-6 w-6 items-center justify-center rounded-full bg-dono-surface-muted"
                    >
                      <Text className="text-xs font-bold text-dono-text">×</Text>
                    </Pressable>
                  </View>
                ) : null}

                <Pressable
                  onPress={() => void pickIdDocument()}
                  disabled={pickingId}
                  className={`flex-row items-center justify-center gap-2 self-start rounded-full border border-dono-border bg-white px-4 py-2 ${
                    pickingId ? "opacity-50" : ""
                  }`}
                >
                  <IdCard size={16} color="#17211B" />
                  <Text className="font-sans-medium text-sm text-dono-text">
                    {pickingId
                      ? "Opening library..."
                      : idDocument
                        ? "Replace student card"
                        : "Add student card"}
                  </Text>
                </Pressable>
              </View>

              <View className="rounded-xl border border-dono-border bg-white p-4">
                <View className="mb-1.5 flex-row items-center gap-2">
                  <ShieldCheck size={16} color="#17211B" />
                  <Text className="font-sans-medium text-sm text-dono-text">
                    Identity Check
                  </Text>
                </View>
                <Text className="mb-3 text-xs text-dono-muted">
                  You'll be asked for a quick photo of your ID and a selfie so we can
                  confirm it's really you — it only takes a minute.
                </Text>

                {renderVerificationStatus()}

                <Pressable
                  onPress={() => void handleVerifyIdentity()}
                  disabled={!manualFieldsValid || verifying || stripeVerified}
                  className={`mt-3 flex-row items-center justify-center gap-2 self-start rounded-full bg-dono-primary px-4 py-2.5 ${
                    !manualFieldsValid || verifying || stripeVerified ? "opacity-50" : ""
                  }`}
                >
                  {verifying ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-sans-medium text-sm text-white">
                      Verify your identity
                    </Text>
                  )}
                </Pressable>
                {!manualFieldsValid ? (
                  <Text className="mt-2 text-xs text-dono-muted">
                    Add your student card above first.
                  </Text>
                ) : stripeFailed ? (
                  <Text className="mt-2 text-xs text-rose-700">
                    That didn't go through — please try again.
                  </Text>
                ) : null}
              </View>
            </View>
          )}

          {step === 3 && (
            <View className="gap-4">
              <View>
                <Text className="text-lg font-sans-medium text-dono-text">
                  Review your society
                </Text>
                <Text className="mt-1 text-sm text-dono-muted">
                  Check the details below before submitting for verification.
                </Text>
              </View>

              <View className="overflow-hidden rounded-2xl border border-dono-border">
                <CampaignImage image={coverImage?.uri ?? "default"} className="h-40" />
              </View>

              <View>
                <Text className="font-display-medium text-xl text-dono-text">
                  {form.name || "Untitled society"}
                </Text>
                <Text className="mt-1 text-sm text-dono-muted">{DEFAULT_UNIVERSITY}</Text>
                {form.description ? (
                  <Text className="mt-2 text-sm text-dono-muted">{form.description}</Text>
                ) : null}
              </View>

              {form.story ? (
                <View className="rounded-xl border border-dono-border bg-white p-4">
                  <Text className="mb-2 font-sans-medium text-sm text-dono-text">About</Text>
                  <Text className="text-sm leading-relaxed text-dono-muted">{form.story}</Text>
                </View>
              ) : null}

              <View className="gap-2 rounded-xl border border-dono-border bg-white p-4">
                <Text className="mb-1 font-sans-medium text-sm text-dono-text">
                  Verification
                </Text>
                <View className="flex-row items-center gap-2">
                  <CheckCircle2
                    size={14}
                    color={supportingDocs.length > 0 ? "#17211B" : "#56615A"}
                  />
                  <Text className="text-sm text-dono-muted">
                    {supportingDocs.length} supporting document
                    {supportingDocs.length === 1 ? "" : "s"} attached
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <CheckCircle2 size={14} color={idDocument ? "#17211B" : "#56615A"} />
                  <Text className="text-sm text-dono-muted">
                    {idDocument ? "Student card provided" : "No student card provided"}
                  </Text>
                </View>
                <Text className="text-sm text-dono-muted">
                  Website: {form.website.trim() || "Not provided"}
                </Text>
                <Text className="text-sm text-dono-muted">
                  Secondary link: {form.secondaryLink.trim() || "Not provided"}
                </Text>
                <View className="mt-1">{renderVerificationStatus()}</View>
              </View>
            </View>
          )}

          {step === 4 && (
            <View className="items-center gap-3 py-4">
              {stripeVerified ? (
                <>
                  <CheckCircle2 size={32} color="#17211B" />
                  <Text className="text-center text-lg font-sans-medium text-dono-text">
                    Application submitted
                  </Text>
                  <Text className="text-center text-sm leading-relaxed text-dono-muted">
                    Thanks — we've received your society, its verification documents, and
                    your Stripe identity check. We'll review it and let you know once a
                    decision is made.
                  </Text>
                  <Link href="/societies" asChild>
                    <Pressable className="mt-2 rounded-full bg-dono-primary px-6 py-2.5">
                      <Text className="font-sans-medium text-sm text-white">
                        Back to Societies
                      </Text>
                    </Pressable>
                  </Link>
                </>
              ) : (
                <>
                  <VerifyingIndicator size={48} color="#17211B" />
                  <Text className="text-center text-lg font-sans-medium text-dono-text">
                    Verifying your identity...
                  </Text>
                  <Text className="text-center text-sm leading-relaxed text-dono-muted">
                    Your society has already been submitted. This usually takes a
                    minute or two — feel free to leave this page open, it'll update
                    automatically the moment it's done.
                  </Text>
                </>
              )}
            </View>
          )}

          <View className="mt-8 flex-row justify-between">
            {step > 0 ? (
              <Pressable
                onPress={() => setStep(step - 1)}
                className="rounded-full border border-dono-border px-5 py-2.5"
              >
                <Text className="font-sans-medium text-sm text-dono-muted">Back</Text>
              </Pressable>
            ) : (
              <View />
            )}

            {step < 4 ? (
              <Pressable
                onPress={handleContinue}
                disabled={!canProceed() || syncingMaterials}
                className={`flex-row items-center gap-2 rounded-full bg-dono-primary px-5 py-2.5 ${
                  !canProceed() || syncingMaterials ? "opacity-50" : ""
                }`}
              >
                {syncingMaterials ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text className="font-sans-medium text-sm text-white">
                      {step === 3 ? "Submit" : "Continue"}
                    </Text>
                    <ArrowRight size={16} color="#fff" />
                  </>
                )}
              </Pressable>
            ) : null}
          </View>

          {error && (
            <View className="mt-4 rounded-xl bg-rose-50 px-4 py-3">
              <Text className="text-sm text-rose-700">{error}</Text>
            </View>
          )}
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
            <View className="rounded-3xl border border-dono-border bg-white p-6">
              <View className="mb-3 flex-row items-center gap-2">
                <Paperclip size={18} color="#17211B" />
                <Text className="flex-1 font-sans-medium text-base text-dono-text">
                  Continue without supporting documents?
                </Text>
              </View>
              <Text className="text-sm leading-relaxed text-dono-muted">
                Approval is less likely without supporting documentation. Adding
                your society's constitution or proof of university recognition
                makes it much easier for us to approve your society.
              </Text>
              <View className="mt-5 flex-row justify-end gap-2">
                <Pressable
                  onPress={() => setDocsPopupVisible(false)}
                  className="rounded-full border border-dono-border px-4 py-2.5"
                >
                  <Text className="font-sans-medium text-sm text-dono-text">
                    Add documents
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setDocsPopupVisible(false);
                    void continueFromVerification();
                  }}
                  className="rounded-full bg-dono-primary px-4 py-2.5"
                >
                  <Text className="font-sans-medium text-sm text-white">
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
