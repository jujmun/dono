import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
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
  Globe,
  Link2,
  Banknote,
  Share2,
} from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { LegalAcceptanceCheckbox } from "@/components/legal-acceptance-checkbox";
import { CampaignImage } from "@/components/ui/campaign-image";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { isAtLeastAge, parseIsoDateOnly } from "@/lib/age";
import { uploadImageToConvexStorage } from "@/lib/convex-storage-upload";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

const STEPS = ["Name", "Logo", "Description", "Links", "Payouts"] as const;
const CREATE_PATH = "/create-college";
const SLUG_KEY = "dono:create-college:slug";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_DESCRIPTION = 500;

function persistSlug(slug: string) {
  if (Platform.OS === "web" && typeof sessionStorage !== "undefined") {
    try {
      sessionStorage.setItem(SLUG_KEY, slug);
    } catch {
      // ignore
    }
  }
}

function readPersistedSlug(): string | null {
  if (Platform.OS === "web" && typeof sessionStorage !== "undefined") {
    try {
      return sessionStorage.getItem(SLUG_KEY);
    } catch {
      return null;
    }
  }
  return null;
}

function clearPersistedSlug() {
  if (Platform.OS === "web" && typeof sessionStorage !== "undefined") {
    try {
      sessionStorage.removeItem(SLUG_KEY);
    } catch {
      // ignore
    }
  }
}

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

interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string | null;
  fileSize?: number | null;
}

export function CreateCollegeWizard() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const params = useLocalSearchParams<{ connect?: string; slug?: string }>();

  const generateUploadUrl = useMutation(api.societies.generateUploadUrl);
  const createCollege = useMutation(api.societies.createCollege);
  const finalizeCollege = useMutation(api.societies.finalizeCollege);
  const acceptDocuments = useMutation(api.legal.acceptDocuments);
  const updateProfile = useMutation(api.users.updateProfile);
  const lookupCollegePrefill = useAction(api.collegeWikipedia.lookupCollegePrefill);
  const createConnectOnboardingLink = useAction(
    api.stripeConnect.createConnectOnboardingLink,
  );
  const refreshConnectAccountStatus = useAction(
    api.stripeConnect.refreshConnectAccountStatus,
  );

  const myProfile = useQuery(
    api.users.me,
    isAuthenticated && !isLoading ? {} : "skip",
  );

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [donationLink, setDonationLink] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [coverPreviewUri, setCoverPreviewUri] = useState<string | null>(null);
  const [coverStorageId, setCoverStorageId] =
    useState<Id<"_storage"> | null>(null);
  const [pickedCover, setPickedCover] = useState<PickedFile | null>(null);
  const [pickingCover, setPickingCover] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [wikiNote, setWikiNote] = useState<string | null>(null);
  const [collegeSlug, setCollegeSlug] = useState<string | null>(null);
  const [connectLoading, setConnectLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [done, setDone] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [dobInput, setDobInput] = useState("");
  const [dobError, setDobError] = useState<string | null>(null);
  const [dobSaving, setDobSaving] = useState(false);
  const prefillForName = useRef<string | null>(null);
  const finalizeStarted = useRef(false);

  const collegeRecord = useQuery(
    api.societies.getMine,
    collegeSlug && isAuthenticated && !isLoading
      ? { slug: collegeSlug }
      : "skip",
  );
  const connectStatus = useQuery(
    api.stripeConnectInternal.getMyConnectStatus,
    collegeSlug && isAuthenticated && !isLoading
      ? { communitySlug: collegeSlug }
      : "skip",
  );

  const resumeHandled = useRef(false);
  useEffect(() => {
    if (resumeHandled.current) return;
    if (isLoading || !isAuthenticated) return;
    const connectParam =
      typeof params.connect === "string" ? params.connect : null;
    if (connectParam !== "return" && connectParam !== "refresh") return;

    const paramSlug =
      typeof params.slug === "string" && params.slug.trim()
        ? params.slug.trim()
        : null;
    const restoredSlug = paramSlug ?? readPersistedSlug();
    if (!restoredSlug) return;

    resumeHandled.current = true;
    setCollegeSlug(restoredSlug);
    persistSlug(restoredSlug);
    setStep(4);
    void refreshConnectAccountStatus({ communitySlug: restoredSlug }).catch(
      () => {},
    );
  }, [
    params.connect,
    params.slug,
    refreshConnectAccountStatus,
    isAuthenticated,
    isLoading,
  ]);

  const connectReady =
    connectStatus?.exists === true &&
    (connectStatus.cardPaymentsActive || connectStatus.chargesEnabled);
  const connectStarted = connectStatus?.exists === true;

  useEffect(() => {
    if (!collegeSlug || step !== 4 || connectReady || !connectStarted) return;
    const interval = setInterval(() => {
      void refreshConnectAccountStatus({ communitySlug: collegeSlug }).catch(
        () => {},
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [
    collegeSlug,
    step,
    connectReady,
    connectStarted,
    refreshConnectAccountStatus,
  ]);

  // Auto-publish once Connect is ready.
  useEffect(() => {
    if (!collegeSlug || !connectReady || done || finalizeStarted.current) return;
    if (collegeRecord?.status === "active") {
      setDone(true);
      clearPersistedSlug();
      return;
    }
    finalizeStarted.current = true;
    setFinalizing(true);
    void finalizeCollege({ slug: collegeSlug })
      .then(() => {
        setDone(true);
        clearPersistedSlug();
      })
      .catch((err) => {
        finalizeStarted.current = false;
        setError(getFriendlyAuthError(err));
      })
      .finally(() => setFinalizing(false));
  }, [collegeSlug, connectReady, done, collegeRecord?.status, finalizeCollege]);

  const dobLoading = isAuthenticated && myProfile === undefined;
  const hasDateOfBirth = Boolean(myProfile?.dateOfBirth);

  const uploadPickedFile = async (file: PickedFile): Promise<Id<"_storage">> => {
    const uploadUrl = await generateUploadUrl({});
    return await uploadImageToConvexStorage(uploadUrl, file.uri, file.mimeType);
  };

  const runWikipediaPrefill = async (collegeName: string) => {
    if (prefillForName.current === collegeName.trim()) return;
    setLookingUp(true);
    setWikiNote(null);
    setError(null);
    try {
      const result = await lookupCollegePrefill({
        name: collegeName,
        storeCover: true,
      });
      prefillForName.current = collegeName.trim();
      if (!result.found) {
        setWikiNote(
          "No Wikipedia match found — you can add a logo and description yourself.",
        );
        return;
      }
      if (result.extract) {
        setDescription(result.extract);
      }
      if (result.coverImageStorageId && result.coverImageUrl) {
        setCoverStorageId(result.coverImageStorageId);
        setCoverPreviewUri(result.coverImageUrl);
        setPickedCover(null);
      } else if (result.imageUrl) {
        setCoverPreviewUri(result.imageUrl);
        setCoverStorageId(null);
      }
      setWikiNote(
        result.title
          ? `Prefill from Wikipedia: ${result.title}`
          : "Prefill from Wikipedia",
      );
    } catch (err) {
      setWikiNote("Could not look up Wikipedia — continue with your own details.");
      setError(getFriendlyAuthError(err));
    } finally {
      setLookingUp(false);
    }
  };

  const pickCoverImage = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to add a logo.");
      return;
    }
    setPickingCover(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
        setError("The logo must be 5MB or smaller.");
        return;
      }
      const file: PickedFile = {
        uri: asset.uri,
        name: asset.fileName ?? asset.uri.split("/").pop() ?? "logo.jpg",
        mimeType: asset.mimeType,
        fileSize: asset.fileSize,
      };
      setPickedCover(file);
      setCoverPreviewUri(file.uri);
      setCoverStorageId(null);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setPickingCover(false);
    }
  };

  const clearCover = () => {
    setPickedCover(null);
    setCoverPreviewUri(null);
    setCoverStorageId(null);
  };

  const handleSaveDateOfBirth = async () => {
    setDobError(null);
    const trimmed = dobInput.trim();
    if (!parseIsoDateOnly(trimmed)) {
      setDobError("Enter your date of birth as YYYY-MM-DD.");
      return;
    }
    if (!isAtLeastAge(trimmed)) {
      setDobError("You must be at least 18 years old to create a college.");
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

  const connectReturnUrls = (slug: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const origin = window.location.origin;
      return {
        returnUrl: `${origin}${CREATE_PATH}?connect=return&slug=${encodeURIComponent(slug)}`,
        refreshUrl: `${origin}${CREATE_PATH}?connect=refresh&slug=${encodeURIComponent(slug)}`,
      };
    }
    return {
      returnUrl: ExpoLinking.createURL(CREATE_PATH, {
        queryParams: { connect: "return", slug },
      }),
      refreshUrl: ExpoLinking.createURL(CREATE_PATH, {
        queryParams: { connect: "refresh", slug },
      }),
    };
  };

  const ensureCollegeCreated = async (): Promise<string> => {
    if (collegeSlug) return collegeSlug;
    if (!legalAccepted) {
      throw new Error("Please accept the terms to continue.");
    }
    if (!hasDateOfBirth) {
      throw new Error("Please confirm your date of birth before continuing.");
    }

    await acceptDocuments({ context: "create_society" });

    let coverImageStorageId = coverStorageId ?? undefined;
    if (pickedCover) {
      coverImageStorageId = await uploadPickedFile(pickedCover);
    } else if (
      !coverImageStorageId &&
      coverPreviewUri &&
      /^https?:\/\//i.test(coverPreviewUri)
    ) {
      // Wikimedia URL was shown but not stored yet — import via upload URL.
      const uploadUrl = await generateUploadUrl({});
      coverImageStorageId = await uploadImageToConvexStorage(
        uploadUrl,
        coverPreviewUri,
        "image/jpeg",
      );
    }

    const result = await createCollege({
      name: name.trim(),
      description: description.trim(),
      websiteUrl: website.trim() || undefined,
      secondaryLink: donationLink.trim() || undefined,
      socialUrl: socialUrl.trim() || undefined,
      coverImageStorageId,
    });
    setCollegeSlug(result.slug);
    persistSlug(result.slug);
    return result.slug;
  };

  const handleConnectOnboarding = async () => {
    setError(null);
    setConnectLoading(true);
    try {
      const slug = await ensureCollegeCreated();
      persistSlug(slug);
      const urls = connectReturnUrls(slug);
      const { url } = await createConnectOnboardingLink({
        communitySlug: slug,
        returnUrl: urls.returnUrl,
        refreshUrl: urls.refreshUrl,
      });
      await Linking.openURL(url);
      void refreshConnectAccountStatus({ communitySlug: slug }).catch(() => {});
    } catch (err) {
      setError(getFriendlyAuthError(err) || "Could not start payout setup.");
    } finally {
      setConnectLoading(false);
    }
  };

  const websiteInvalid = !isValidOptionalUrl(website);
  const donationInvalid = !isValidOptionalUrl(donationLink);
  const socialInvalid = !isValidOptionalUrl(socialUrl);

  const canProceed = () => {
    switch (step) {
      case 0:
        return name.trim().length > 0;
      case 1:
        return true; // logo optional
      case 2:
        return (
          description.trim().length > 0 &&
          description.trim().length <= MAX_DESCRIPTION
        );
      case 3:
        return !websiteInvalid && !donationInvalid && !socialInvalid;
      case 4:
        return connectReady || done;
      default:
        return true;
    }
  };

  const handleContinue = async () => {
    setError(null);
    if (step === 0) {
      setStep(1);
      void runWikipediaPrefill(name);
      return;
    }
    if (step === 3) {
      // Move to payouts — record is created when Connect starts (or immediately if already have slug).
      if (!hasDateOfBirth) {
        setError("Please confirm your date of birth before setting up payouts.");
        return;
      }
      if (!legalAccepted) {
        setError("Please accept the terms before setting up payouts.");
        return;
      }
      setCreating(true);
      try {
        await ensureCollegeCreated();
        setStep(4);
      } catch (err) {
        setError(getFriendlyAuthError(err));
      } finally {
        setCreating(false);
      }
      return;
    }
    setStep(step + 1);
  };

  const inputClass =
    "w-full rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 font-retro-mono text-sm text-retro-ink outline-none";

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
        <LoginGate message="Sign in with your Oxford email to create a college." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-2xl gap-6 px-4 py-8">
        <View className="items-center gap-2">
          <Text className="font-retro-display text-2xl text-retro-ink">
            Create a College
          </Text>
          <Text className="text-center font-retro-mono text-sm text-retro-ink/70">
            Five quick steps — Wikipedia prefill, links, then Stripe payouts.
            Your college publishes automatically when Connect is ready.
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
                  {i < step || (i === step && done) ? (
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
          <View className="gap-3">
            <Text className="font-retro-display text-lg text-retro-ink">
              College name
            </Text>
            <Text className="font-retro-mono text-xs text-retro-ink/60">
              Use the full Oxford name if you can (e.g. Balliol College).
            </Text>
            <TextInput
              className={inputClass}
              value={name}
              onChangeText={(v) => {
                setName(v);
                prefillForName.current = null;
              }}
              placeholder="e.g. Balliol College"
              autoCapitalize="words"
            />
          </View>
        )}

        {step === 1 && (
          <View className="gap-3">
            <Text className="font-retro-display text-lg text-retro-ink">Logo</Text>
            {lookingUp ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#17211B" />
                <Text className="font-retro-mono text-xs text-retro-ink/70">
                  Looking up Wikipedia / Wikimedia…
                </Text>
              </View>
            ) : wikiNote ? (
              <Text className="font-retro-mono text-xs text-retro-ink/60">
                {wikiNote}
              </Text>
            ) : null}
            <CampaignImage
              image={coverPreviewUri ?? "default"}
              className="h-48"
            />
            <View className="flex-row flex-wrap gap-2">
              <Pressable
                onPress={() => void pickCoverImage()}
                disabled={pickingCover}
                className="flex-row items-center gap-2 rounded-lg border-2 border-retro-ink bg-white px-3 py-2"
              >
                {pickingCover ? (
                  <ActivityIndicator color="#17211B" />
                ) : (
                  <ImagePlus size={16} color="#17211B" />
                )}
                <Text className="font-retro-mono text-xs text-retro-ink">
                  {coverPreviewUri ? "Replace logo" : "Upload logo"}
                </Text>
              </Pressable>
              {coverPreviewUri ? (
                <Pressable
                  onPress={clearCover}
                  className="rounded-lg border-2 border-retro-ink/30 px-3 py-2"
                >
                  <Text className="font-retro-mono text-xs text-retro-ink/70">
                    Remove
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="gap-3">
            <Text className="font-retro-display text-lg text-retro-ink">
              Short description
            </Text>
            <Text className="font-retro-mono text-xs text-retro-ink/60">
              Prefill from Wikipedia when available — edit freely (max{" "}
              {MAX_DESCRIPTION} characters).
            </Text>
            <TextInput
              className={`${inputClass} min-h-[120px]`}
              value={description}
              onChangeText={setDescription}
              placeholder="A short summary of your college…"
              multiline
              textAlignVertical="top"
              maxLength={MAX_DESCRIPTION}
            />
            <Text className="self-end font-retro-mono text-[10px] text-retro-ink/50">
              {description.trim().length}/{MAX_DESCRIPTION}
            </Text>
          </View>
        )}

        {step === 3 && (
          <View className="gap-4">
            <Text className="font-retro-display text-lg text-retro-ink">Links</Text>

            <View className="gap-1.5">
              <View className="flex-row items-center gap-2">
                <Globe size={14} color="#17211B" />
                <Text className="font-retro-mono text-xs text-retro-ink">
                  Website
                </Text>
              </View>
              <TextInput
                className={inputClass}
                value={website}
                onChangeText={setWebsite}
                placeholder="e.g. https://www.balliol.ox.ac.uk"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {websiteInvalid ? (
                <Text className="font-retro-mono text-[10px] text-red-700">
                  Enter a valid URL
                </Text>
              ) : null}
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center gap-2">
                <Link2 size={14} color="#17211B" />
                <Text className="font-retro-mono text-xs text-retro-ink">
                  Donation link
                </Text>
              </View>
              <TextInput
                className={inputClass}
                value={donationLink}
                onChangeText={setDonationLink}
                placeholder="Optional fundraising or giving page"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {donationInvalid ? (
                <Text className="font-retro-mono text-[10px] text-red-700">
                  Enter a valid URL
                </Text>
              ) : null}
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center gap-2">
                <Share2 size={14} color="#17211B" />
                <Text className="font-retro-mono text-xs text-retro-ink">
                  Social media
                </Text>
              </View>
              <TextInput
                className={inputClass}
                value={socialUrl}
                onChangeText={setSocialUrl}
                placeholder="Optional Instagram / X / LinkedIn URL"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {socialInvalid ? (
                <Text className="font-retro-mono text-[10px] text-red-700">
                  Enter a valid URL
                </Text>
              ) : null}
            </View>

            {!dobLoading && !hasDateOfBirth ? (
              <View className="gap-2 rounded-lg border-2 border-retro-ink/20 bg-white p-3">
                <Text className="font-retro-mono text-xs text-retro-ink">
                  Confirm you are 18+ (YYYY-MM-DD)
                </Text>
                <TextInput
                  className={inputClass}
                  value={dobInput}
                  onChangeText={setDobInput}
                  placeholder="1998-05-21"
                  autoCapitalize="none"
                />
                {dobError ? (
                  <Text className="font-retro-mono text-[10px] text-red-700">
                    {dobError}
                  </Text>
                ) : null}
                <Pressable
                  onPress={() => void handleSaveDateOfBirth()}
                  disabled={dobSaving}
                  className="self-start rounded-lg bg-retro-ink px-3 py-2"
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

            <LegalAcceptanceCheckbox
              context="create_society"
              accepted={legalAccepted}
              onAcceptedChange={setLegalAccepted}
            />
          </View>
        )}

        {step === 4 && (
          <View className="gap-4">
            <Text className="font-retro-display text-lg text-retro-ink">
              Stripe payouts
            </Text>
            <Text className="font-retro-mono text-xs text-retro-ink/70">
              Connect a Stripe account to receive donations. When setup is
              complete, your college is published automatically — no admin
              review.
            </Text>

            {done || collegeRecord?.status === "active" ? (
              <View className="gap-3 rounded-lg border-2 border-retro-ink bg-retro-mint/30 p-4">
                <View className="flex-row items-center gap-2">
                  <CheckCircle2 size={20} color="#17211B" />
                  <Text className="font-retro-display text-base text-retro-ink">
                    College published
                  </Text>
                </View>
                <Text className="font-retro-mono text-xs text-retro-ink/70">
                  Your college is live on Communities.
                </Text>
                {collegeSlug ? (
                  <Link href={`/societies/${collegeSlug}`} asChild>
                    <Pressable className="self-start rounded-lg bg-retro-ink px-4 py-2.5">
                      <Text className="font-retro-mono text-sm text-white">
                        View college page
                      </Text>
                    </Pressable>
                  </Link>
                ) : null}
              </View>
            ) : (
              <>
                {connectReady ? (
                  <View className="flex-row items-center gap-2 rounded-xl bg-green-50 px-3 py-2">
                    <CheckCircle2 size={14} color="#15803d" />
                    <Text className="text-xs text-green-800">
                      {finalizing
                        ? "Publishing your college…"
                        : "Stripe ready — finishing setup…"}
                    </Text>
                  </View>
                ) : connectStarted ? (
                  <View className="rounded-xl bg-amber-50 px-3 py-2">
                    <Text className="text-xs text-amber-800">
                      Stripe onboarding in progress. Return here after finishing
                      in Stripe — we&apos;ll refresh automatically.
                    </Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={() => void handleConnectOnboarding()}
                  disabled={connectLoading || connectReady || creating}
                  className={`flex-row items-center justify-center gap-2 rounded-lg border-2 border-retro-ink bg-white px-4 py-3 ${
                    connectLoading || connectReady || creating ? "opacity-50" : ""
                  }`}
                >
                  {connectLoading || creating ? (
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
              </>
            )}
          </View>
        )}

        <View className="flex-row items-center justify-between gap-3 pt-2">
          {step > 0 && step < 4 && !done ? (
            <Pressable
              onPress={() => setStep(step - 1)}
              className="rounded-lg border-2 border-retro-ink/30 px-4 py-2.5"
            >
              <Text className="font-retro-mono text-sm text-retro-ink">Back</Text>
            </Pressable>
          ) : (
            <View />
          )}

          {step < 4 ? (
            <Pressable
              onPress={() => void handleContinue()}
              disabled={!canProceed() || lookingUp || creating}
              className={`flex-row items-center gap-2 rounded-lg bg-retro-ink px-4 py-2.5 ${
                !canProceed() || lookingUp || creating ? "opacity-50" : ""
              }`}
            >
              {creating || lookingUp ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="font-retro-mono text-sm text-white">
                    Continue
                  </Text>
                  <ArrowRight size={16} color="#fff" />
                </>
              )}
            </Pressable>
          ) : null}
        </View>
      </View>
    </AppShell>
  );
}
