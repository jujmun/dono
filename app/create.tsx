import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowRight,
  ImagePlus,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignPreview } from "@/components/campaign-preview";
import { LoginGate } from "@/components/login-gate";
import { CampaignImage } from "@/components/ui/campaign-image";
import { CategoryBadge } from "@/components/ui/category-badge";
import { VerifyingIndicator } from "@/components/ui/verifying-indicator";
import {
  ReceiptDivider,
  ReceiptLedger,
  ReceiptLineRow,
  ReceiptTotalRow,
} from "@/components/ui/receipt-lines";
import { categoryLabels, formatCurrency } from "@/lib/constants";
import { MAX_CAMPAIGN_IMAGES } from "@/lib/campaign-images";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { uploadCampaignImages } from "@/lib/upload-campaign-images";
import { encodeImpactItems } from "@/lib/fund-breakdown";
import { launchIdentityVerification } from "@/lib/stripe/launch-identity-verification";
import { api } from "@convex/_generated/api";

const dinoLogo = require("../assets/dino-hero.png");

const steps = ["Details", "Story", "Goal", "Review", "Submit"];

const DEFAULT_UNIVERSITY = "University of Oxford";

const creatorTypes = [
  "Individual Student",
  "Student Society",
  "College",
  "Department",
  "University",
];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MIN_FUND_LINES = 2;
const MAX_FUND_LINES = 5;

interface FundLine {
  label: string;
  amount: string;
}

const emptyFundLine = (): FundLine => ({ label: "", amount: "" });

const initialFundLines = (): FundLine[] => [
  emptyFundLine(),
  emptyFundLine(),
  emptyFundLine(),
];

interface PickedImage {
  uri: string;
  mimeType?: string | null;
  fileSize?: number | null;
}

const initialForm = {
  title: "",
  category: "",
  creatorType: "",
  description: "",
  story: "",
  goal: "",
};

export default function CreateCampaignPage() {
  const router = useRouter();
  const posthog = usePostHog();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const createCampaign = useMutation(api.campaigns.create);
  const updateCampaign = useMutation(api.campaignCreator.update);
  const generateImageUploadUrl = useMutation(api.campaignCreator.generateImageUploadUrl);
  const setCampaignImage = useMutation(api.campaignCreator.setImage);
  const setCampaignImages = useMutation(api.campaignCreator.setImages);
  const setImpactItems = useMutation(api.campaignCreator.setImpactItems);
  const createVerificationSession = useAction(
    api.campaignIdentity.createVerificationSession,
  );
  const refreshVerificationStatus = useAction(
    api.campaignIdentity.refreshVerificationStatus,
  );
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [pickedImages, setPickedImages] = useState<PickedImage[]>([]);
  const [fundLines, setFundLines] = useState<FundLine[]>(initialFundLines);
  const [campaignSlug, setCampaignSlug] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Once a slug exists, this reflects the webhook-driven status in real time.
  const verification = useQuery(
    api.campaignCreator.getMyVerificationStatus,
    campaignSlug ? { slug: campaignSlug } : "skip",
  );

  // Fallback to the webhook: directly poll Stripe every few seconds while
  // unverified, in case the webhook is delayed, misconfigured, or hasn't
  // reached this deployment. Stops as soon as the query reflects "verified".
  useEffect(() => {
    if (!campaignSlug || verification?.stripeVerificationStatus === "verified") {
      return;
    }
    const interval = setInterval(() => {
      void refreshVerificationStatus({ slug: campaignSlug }).catch(() => {
        // Best-effort background poll — surfaced errors would be noisy here;
        // the webhook or the next tick may still succeed.
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [campaignSlug, verification?.stripeVerificationStatus, refreshVerificationStatus]);

  const updateFundLine = (index: number, field: keyof FundLine, value: string) => {
    setFundLines((current) =>
      current.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    );
  };

  const addFundLine = () => {
    setFundLines((current) =>
      current.length >= MAX_FUND_LINES ? current : [...current, emptyFundLine()],
    );
  };

  const removeFundLine = (index: number) => {
    setFundLines((current) =>
      current.length <= MIN_FUND_LINES
        ? current
        : current.filter((_, i) => i !== index),
    );
  };

  const filledFundLines = fundLines.filter((line) => line.label.trim());
  const fundLineTotal = fundLines.reduce(
    (sum, line) => sum + (Number(line.amount) || 0),
    0,
  );
  const goalAmount = Number(form.goal) || 0;
  const goalInvalid = form.goal.trim().length > 0 && goalAmount <= 0;
  // Compare in pence — decimal amounts summed as floats can drift by a
  // hair (e.g. 1166.67 × 3) and a strict === would reject a correct ledger.
  const totalsMatch = Math.round(fundLineTotal * 100) === Math.round(goalAmount * 100);
  const missingLineItems = filledFundLines.length < MIN_FUND_LINES;
  const lineAmountMissing = filledFundLines.some(
    (line) => !(Number(line.amount) > 0),
  );
  const fundLinesComplete = !missingLineItems && !lineAmountMissing && totalsMatch;

  const previewImpactLines = filledFundLines.map((line) => ({
    label: line.label.trim(),
    amount: Number(line.amount) || 0,
  }));

  const impactItemLabels = filledFundLines.map((line) => line.label.trim());
  const encodedImpactItems = encodeImpactItems(previewImpactLines);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const pickCampaignImages = async () => {
    if (pickedImages.length >= MAX_CAMPAIGN_IMAGES) {
      setError(`You can add up to ${MAX_CAMPAIGN_IMAGES} photos.`);
      return;
    }

    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to add campaign photos.");
      return;
    }

    setPickingImage(true);
    try {
      const remaining = MAX_CAMPAIGN_IMAGES - pickedImages.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        quality: 0.85,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const nextImages: PickedImage[] = [];
      for (const asset of result.assets) {
        if (asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES) {
          setError("Each campaign photo must be 5MB or smaller.");
          return;
        }
        nextImages.push({
          uri: asset.uri,
          mimeType: asset.mimeType,
          fileSize: asset.fileSize,
        });
      }

      setPickedImages((current) => [...current, ...nextImages].slice(0, MAX_CAMPAIGN_IMAGES));
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setPickingImage(false);
    }
  };

  const removeCampaignImage = (index: number) => {
    setPickedImages((current) => current.filter((_, i) => i !== index));
  };

  const campaignImageSource =
    pickedImages[0]?.uri ?? (form.category || "default");
  const pickedImageUris = pickedImages.map((image) => image.uri);

  /**
   * Creates the campaign (once) so Stripe Identity has a record to attach to —
   * mirrors the society wizard. Field edits made after this are synced via
   * campaignCreator.update when the user presses Complete.
   */
  const ensureCampaignCreated = async (): Promise<string> => {
    if (campaignSlug) return campaignSlug;
    const result = await createCampaign({
      title: form.title,
      category: form.category,
      creatorType: form.creatorType,
      university: DEFAULT_UNIVERSITY,
      description: form.description,
      story: form.story,
      goal: Number(form.goal),
    });
    setCampaignSlug(result.slug);
    return result.slug;
  };

  const handleVerifyIdentity = async () => {
    setError(null);
    setVerifying(true);
    try {
      const slug = await ensureCampaignCreated();
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

  const renderVerificationStatus = () => {
    if (!stripeStatus) return null;
    if (stripeVerified) {
      return (
        <View className="flex-row items-center gap-2 self-start rounded-xl bg-green-50 px-3 py-2">
          <ShieldCheck size={14} color="#15803d" />
          <Text className="text-xs text-green-800">Verified</Text>
        </View>
      );
    }
    return (
      <View className="flex-row items-center gap-2 self-start rounded-xl bg-amber-50 px-3 py-2">
        <VerifyingIndicator size={14} color="#b45309" />
        <Text className="text-xs text-amber-800">
          Verifying your identity... you can keep going
        </Text>
      </View>
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.title && form.category && form.creatorType;
      case 1:
        return form.description && form.story;
      case 2:
        return form.goal && Number(form.goal) > 0 && fundLinesComplete;
      case 3:
        // The identity check must at least be started (which also creates the
        // campaign record). Verification itself can finish in the background.
        return campaignSlug !== null;
      default:
        return true;
    }
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
        <LoginGate message="If you're a student, sign in with your Oxford email to create a campaign." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View
        className={`mx-auto w-full px-4 py-8 ${step === 3 ? "max-w-7xl" : "max-w-2xl"}`}
      >
        <View className="mb-8 items-center">
          <Text className="font-display-medium text-2xl text-dono-text">Start a Campaign</Text>
          <Text className="mt-1 text-center text-dono-muted">
            Free for students. Reach alumni who care about your community.
          </Text>
        </View>

        <View className="mb-8 w-full items-center">
          <View className="w-full max-w-lg flex-row items-start">
            {steps.map((label, i) => (
              <View key={label} className="flex-1 items-center">
                <View className="w-full flex-row items-center">
                  {i > 0 ? (
                    <View
                      className={`h-0.5 flex-1 ${
                        i <= step ? "bg-dono-primary" : "bg-dono-border"
                      }`}
                    />
                  ) : (
                    <View className="flex-1" />
                  )}
                  <View
                    className={`h-8 w-8 shrink-0 items-center justify-center rounded-full ${
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
                  {i < steps.length - 1 ? (
                    <View
                      className={`h-0.5 flex-1 ${
                        i < step ? "bg-dono-primary" : "bg-dono-border"
                      }`}
                    />
                  ) : (
                    <View className="flex-1" />
                  )}
                </View>
                <Text
                  className={`mt-2 text-center text-xs ${
                    i === step
                      ? "font-sans-medium text-dono-text"
                      : i < step
                        ? "text-dono-muted"
                        : "text-dono-muted"
                  }`}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          {step === 0 && (
            <View className="gap-5">
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Campaign Title
                </Text>
                <TextInput
                  value={form.title}
                  onChangeText={(v) => update("title", v)}
                  placeholder="e.g. Anatomy Models for Medical Students"
                  placeholderTextColor="#56615A"
                  className={inputClass}
                />
              </View>

              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Campaign Photos
                </Text>
                <View className="overflow-hidden rounded-2xl border border-dono-border">
                  <CampaignImage image={campaignImageSource} className="h-48">
                    {form.category ? (
                      <View className="absolute left-4 top-4">
                        <CategoryBadge category={form.category} />
                      </View>
                    ) : null}
                  </CampaignImage>
                </View>
                {pickedImages.length > 1 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-3"
                    contentContainerClassName="gap-2"
                  >
                    {pickedImages.map((image, index) => (
                      <View key={`${image.uri}-${index}`} className="relative">
                        <CampaignImage image={image.uri} className="h-16 w-24 rounded-lg" />
                        <Pressable
                          onPress={() => removeCampaignImage(index)}
                          className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-dono-text"
                        >
                          <Text className="text-xs font-bold text-white">×</Text>
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>
                ) : null}
                <View className="mt-3 flex-row flex-wrap gap-2">
                  <Pressable
                    onPress={() => void pickCampaignImages()}
                    disabled={pickingImage || pickedImages.length >= MAX_CAMPAIGN_IMAGES}
                    className={`flex-row items-center gap-2 rounded-full border border-dono-border px-4 py-2 ${
                      pickingImage || pickedImages.length >= MAX_CAMPAIGN_IMAGES
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <ImagePlus size={16} color="#17211B" />
                    <Text className="font-sans-medium text-sm text-dono-text">
                      {pickingImage
                        ? "Opening library..."
                        : pickedImages.length > 0
                          ? "Add more photos"
                          : "Add photos"}
                    </Text>
                  </Pressable>
                  {pickedImages.length > 0 ? (
                    <Pressable
                      onPress={() => setPickedImages([])}
                      className="rounded-full border border-dono-border px-4 py-2"
                    >
                      <Text className="font-sans-medium text-sm text-dono-muted">
                        Remove all
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
                <Text className="mt-1.5 text-xs text-dono-muted">
                  Optional. Add up to {MAX_CAMPAIGN_IMAGES} photos (JPG or PNG, 5MB each).
                </Text>
              </View>

              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <Pressable
                        key={key}
                        onPress={() => update("category", key)}
                        className={`rounded-xl border px-3 py-2.5 ${
                          form.category === key
                            ? "border-dono-primary bg-dono-primary/5"
                            : "border-dono-border"
                        }`}
                      >
                        <Text
                          className={`font-sans-medium text-xs ${
                            form.category === key
                              ? "text-dono-primary"
                              : "text-dono-muted"
                          }`}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  I am creating this as a...
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {creatorTypes.map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => update("creatorType", type)}
                      className={`rounded-xl border px-3 py-2.5 ${
                        form.creatorType === type
                          ? "border-dono-primary bg-dono-primary/5"
                          : "border-dono-border"
                      }`}
                    >
                      <Text
                        className={`font-sans-medium text-xs ${
                          form.creatorType === type
                            ? "text-dono-primary"
                            : "text-dono-muted"
                        }`}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  ))}
                </View>
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
                  placeholder="One-line summary of your campaign"
                  placeholderTextColor="#56615A"
                  className={inputClass}
                />
              </View>
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Your Story
                </Text>
                <TextInput
                  value={form.story}
                  onChangeText={(v) => update("story", v)}
                  placeholder="Tell donors why this matters..."
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
            <View className="gap-5">
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Funding Goal (£)
                </Text>
                <TextInput
                  value={form.goal}
                  onChangeText={(v) => update("goal", v)}
                  placeholder="e.g. 3500"
                  placeholderTextColor="#56615A"
                  keyboardType="numeric"
                  className={inputClass}
                />
                {goalInvalid ? (
                  <Text className="mt-1 text-xs text-rose-700">
                    Enter your goal as a plain number, e.g. 3500 — no commas or symbols.
                  </Text>
                ) : null}
              </View>

              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  What your donation funds
                </Text>
                <Text className="mb-3 text-xs text-dono-muted">
                  Itemise how you&apos;ll spend the money (amounts in £). Line items must
                  add up to your funding goal — donors see this as a transparent ledger.
                </Text>
                <ReceiptLedger>
                  {fundLines.map((line, index) => (
                    <View key={index} className="mb-3 flex-row items-center gap-2">
                      <TextInput
                        value={line.label}
                        onChangeText={(v) => updateFundLine(index, "label", v)}
                        placeholder="e.g. Core textbook"
                        placeholderTextColor="#56615A"
                        className="min-w-0 flex-1 rounded-lg border border-dono-border/80 bg-white px-3 py-2.5 text-sm text-dono-text"
                      />
                      <View className="w-[5.5rem] flex-row items-center rounded-lg border border-dono-border/80 bg-white">
                        <Text className="pl-3 font-mono text-sm text-dono-muted">£</Text>
                        <TextInput
                          value={line.amount}
                          onChangeText={(v) => updateFundLine(index, "amount", v)}
                          placeholder="0"
                          placeholderTextColor="#56615A"
                          keyboardType="numeric"
                          className="min-w-0 flex-1 py-2.5 pr-3 text-right font-mono text-sm text-dono-text"
                        />
                      </View>
                      {fundLines.length > MIN_FUND_LINES ? (
                        <Pressable
                          onPress={() => removeFundLine(index)}
                          className="h-10 w-10 items-center justify-center rounded-lg border border-dono-border/80 bg-white"
                          accessibilityLabel="Remove line item"
                        >
                          <Trash2 size={14} color="#56615A" />
                        </Pressable>
                      ) : (
                        <View className="w-10" />
                      )}
                    </View>
                  ))}
                  {fundLines.length < MAX_FUND_LINES ? (
                    <Pressable
                      onPress={addFundLine}
                      className="mb-1 flex-row items-center justify-center gap-1.5 rounded-lg border border-dashed border-dono-border bg-white/80 py-2.5"
                    >
                      <Plus size={14} color="#56615A" />
                      <Text className="font-sans-medium text-xs text-dono-muted">
                        Add line item
                      </Text>
                    </Pressable>
                  ) : null}
                  <ReceiptDivider />
                  <ReceiptTotalRow
                    label="Total goal"
                    amount={goalAmount > 0 ? goalAmount : "—"}
                  />
                  {goalAmount > 0 && missingLineItems ? (
                    <Text className="mt-2 text-xs text-rose-700">
                      Add at least {MIN_FUND_LINES} line items, each with a label and
                      an amount.
                    </Text>
                  ) : goalAmount > 0 && lineAmountMissing ? (
                    <Text className="mt-2 text-xs text-rose-700">
                      Every line item needs an amount greater than £0.
                    </Text>
                  ) : goalAmount > 0 && !totalsMatch ? (
                    <Text className="mt-2 text-xs text-rose-700">
                      Line items total {formatCurrency(fundLineTotal)} — must equal{" "}
                      {formatCurrency(goalAmount)}
                    </Text>
                  ) : null}
                </ReceiptLedger>
              </View>

              <View className="rounded-xl border border-green-200 bg-green-50 p-4">
                <Text className="text-sm text-green-800">
                  Students never pay to create campaigns. Dono takes a small transaction
                  fee on donations to keep the platform running.
                </Text>
              </View>
            </View>
          )}

          {step === 3 && (
            <View className="gap-4">
              <View>
                <Text className="text-lg font-sans-medium text-dono-text">
                  Review your campaign
                </Text>
                <Text className="mt-1 text-sm text-dono-muted">
                  This is how donors will see your campaign once it&apos;s live.
                </Text>
              </View>
              <CampaignPreview
                title={form.title}
                category={form.category}
                university={DEFAULT_UNIVERSITY}
                story={form.story}
                goal={Number(form.goal)}
                imageUris={pickedImageUris}
                impactLines={previewImpactLines}
              />

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
                  disabled={verifying || stripeVerified}
                  className={`mt-3 flex-row items-center justify-center gap-2 self-start rounded-full bg-dono-primary px-4 py-2.5 ${
                    verifying || stripeVerified ? "opacity-50" : ""
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
                {stripeFailed ? (
                  <Text className="mt-2 text-xs text-rose-700">
                    That didn't go through — please try again.
                  </Text>
                ) : !campaignSlug ? (
                  <Text className="mt-2 text-xs text-dono-muted">
                    You'll be able to continue once you've started this check.
                  </Text>
                ) : null}
              </View>
            </View>
          )}

          {step === 4 && (
            <View className="gap-5">
              <Text className="text-lg font-sans-medium text-dono-text">
                Before your campaign goes live
              </Text>
              <Text className="text-sm leading-relaxed text-dono-muted">
                We take moderation seriously. Every campaign is reviewed by our team to
                make sure it meets Dono's guidelines and has the best possible chance of
                reaching alumni and getting funded. We'll reach out directly if anything
                needs adjusting.
              </Text>
              {renderVerificationStatus()}
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

            {step < 3 ? (
              <Pressable
                onPress={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`flex-row items-center gap-2 rounded-full bg-dono-primary px-5 py-2.5 ${
                  !canProceed() ? "opacity-50" : ""
                }`}
              >
                <Text className="font-sans-medium text-sm text-white">Continue</Text>
                <ArrowRight size={16} color="#fff" />
              </Pressable>
            ) : step === 3 ? (
              <Pressable
                onPress={() => setStep(4)}
                disabled={!canProceed()}
                className={`rounded-full bg-dono-accent px-6 py-2.5 ${
                  !canProceed() ? "opacity-50" : ""
                }`}
              >
                <Text className="font-sans-medium text-sm text-white">Continue</Text>
              </Pressable>
            ) : (
              <Pressable
                disabled={submitting || !campaignSlug}
                onPress={() => {
                  const slug = campaignSlug;
                  if (!slug) return;
                  setError(null);
                  setSubmitting(true);
                  // The campaign was created when the identity check started —
                  // push any fields edited since, then attach the extras.
                  void updateCampaign({
                    slug,
                    title: form.title,
                    category: form.category,
                    description: form.description,
                    story: form.story,
                    goal: Number(form.goal),
                  })
                    .then(async () => {
                      let imageUploadFailed = false;
                      try {
                        await setImpactItems({
                          slug,
                          impactItems: encodedImpactItems,
                        });
                      } catch {
                        setError(
                          "Campaign created but fund breakdown could not be saved. Edit from your dashboard.",
                        );
                      }
                      if (pickedImages.length > 0) {
                        try {
                          const allUploaded = await uploadCampaignImages({
                            slug,
                            images: pickedImages,
                            generateUploadUrl: generateImageUploadUrl,
                            setImage: setCampaignImage,
                            setImages: setCampaignImages,
                          });
                          imageUploadFailed = !allUploaded;
                        } catch {
                          imageUploadFailed = true;
                        }
                      }

                      posthog?.capture("campaign_created", {
                        campaign_title: form.title,
                        campaign_category: form.category,
                        campaign_creator_type: form.creatorType,
                        campaign_university: DEFAULT_UNIVERSITY,
                        campaign_goal: Number(form.goal),
                        campaign_has_image:
                          pickedImages.length > 0 && !imageUploadFailed,
                        campaign_image_count: pickedImages.length,
                        campaign_impact_items: impactItemLabels.length,
                      });
                      setForm(initialForm);
                      setPickedImages([]);
                      setFundLines(initialFundLines());
                      setCampaignSlug(null);
                      setStep(0);
                      setError(null);
                      router.push(`/campaigns/${slug}`);
                    })
                    .catch((err: Error) => {
                      setError(
                        getFriendlyAuthError(err) || "Failed to create campaign.",
                      );
                    })
                    .finally(() => {
                      setSubmitting(false);
                    });
                }}
                className={`rounded-full bg-dono-accent px-6 py-2.5 ${
                  submitting || !campaignSlug ? "opacity-50" : ""
                }`}
              >
                <Text className="font-sans-medium text-sm text-white">
                  {submitting
                    ? pickedImages.length > 0
                      ? "Creating & uploading..."
                      : "Completing..."
                    : "Complete"}
                </Text>
              </Pressable>
            )}
          </View>

          {error && (
            <View className="mt-4 rounded-xl bg-rose-50 px-4 py-3">
              <Text className="text-sm text-rose-700">{error}</Text>
            </View>
          )}
        </View>
      </View>
    </AppShell>
  );
}
