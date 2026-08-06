import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ImagePlus,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignPreview } from "@/components/campaign-preview";
import { ImageCropModal, type CropSourceImage } from "@/components/image-crop-modal";
import { LoginGate } from "@/components/login-gate";
import { DonorCreateGate } from "@/components/donor-create-gate";
import { isAlumni } from "@/lib/auth/user-type";
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
import { ALLOWED_CAMPAIGN_CATEGORIES } from "@/lib/campaign-categories";
import {
  getCampaignImages,
  MAX_CAMPAIGN_IMAGES,
} from "@/lib/campaign-images";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { uploadCampaignImages } from "@/lib/upload-campaign-images";
import { encodeImpactItems, parseImpactItem } from "@/lib/fund-breakdown";
import { launchIdentityVerification } from "@/lib/stripe/launch-identity-verification";
import { isStripeIdentityEnabled } from "@/lib/stripe/identity-enabled";
import { parseCampaignVideoUrl } from "@/lib/video-url";
import { CAMPAIGN_TEMPLATES, DEFAULT_CAMPAIGN_TEMPLATE_ID } from "@/lib/campaign-templates";
import { CampaignTemplateWireframe } from "@/components/ui/campaign-template-wireframe";
import { LegalAcceptanceCheckbox } from "@/components/legal-acceptance-checkbox";
import { DateInput } from "@/components/date-input";
import {
  DobSelect,
  RETRO_SELECT_TEXT_CLASS,
  RETRO_SELECT_TRIGGER_CLASS,
} from "@/components/dob-select";
import { ENABLE_CAMPAIGN_TEMPLATES } from "@/lib/featureFlags";
import { isAtLeastAge, parseIsoDateOnly } from "@/lib/age";
import { api } from "@convex/_generated/api";

const steps = ["Details", "Story", "Goal", "Review", "Submit"];

const DEFAULT_UNIVERSITY = "University of Oxford";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_ADDITIONAL_NOTES_LENGTH = 2000;
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
  communitySlug: "",
  description: "",
  story: "",
  goal: "",
};

/** Thumbnail strip + add/remove controls — shared by the Details step and
 * the Review step's "Add more" panel, both operating on the same picked-images state. */
function PhotoThumbnailPicker({
  pickedImages,
  pickingImage,
  onPick,
  onRemove,
  onRemoveAll,
  onRecrop,
}: {
  pickedImages: PickedImage[];
  pickingImage: boolean;
  onPick: () => void;
  onRemove: (index: number) => void;
  onRemoveAll: () => void;
  onRecrop?: (index: number) => void;
}) {
  return (
    <View>
      {pickedImages.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {pickedImages.map((image, index) => (
            <View key={`${image.uri}-${index}`} className="relative">
              <Pressable
                onPress={() => onRecrop?.(index)}
                disabled={!onRecrop}
                accessibilityLabel="Adjust crop"
              >
                <CampaignImage image={image.uri} className="h-16 w-28 rounded-lg" />
              </Pressable>
              <Pressable
                onPress={() => onRemove(index)}
                className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-retro-ink"
              >
                <Text className="text-xs font-bold text-white">×</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : null}
      <View className={`flex-row flex-wrap gap-2 ${pickedImages.length > 0 ? "mt-3" : ""}`}>
        <Pressable
          onPress={onPick}
          disabled={pickingImage || pickedImages.length >= MAX_CAMPAIGN_IMAGES}
          className={`retro-key flex-row items-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper px-4 py-2 ${
            pickingImage || pickedImages.length >= MAX_CAMPAIGN_IMAGES ? "opacity-50" : ""
          }`}
        >
          <ImagePlus size={16} color="#17211B" />
          <Text className="font-retro-bold text-sm text-retro-ink">
            {pickingImage
              ? "Opening library..."
              : pickedImages.length > 0
                ? "Add more photos"
                : "Add photos"}
          </Text>
        </Pressable>
        {pickedImages.length > 0 ? (
          <Pressable
            onPress={onRemoveAll}
            className="retro-key rounded-full border-2 border-retro-ink bg-retro-paper px-4 py-2"
          >
            <Text className="font-retro-bold text-sm text-[#5c574f]">Remove all</Text>
          </Pressable>
        ) : null}
      </View>
      <Text className="mt-1.5 text-xs text-[#5c574f]">
        Optional. Up to {MAX_CAMPAIGN_IMAGES} photos (JPG or PNG, 5MB each). Tap a
        photo to adjust the crop.
      </Text>
    </View>
  );
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const posthog = usePostHog();
  const { editSlug, photosOnly: photosOnlyParam } = useLocalSearchParams<{
    editSlug?: string;
    photosOnly?: string;
  }>();
  const photosOnly = photosOnlyParam === "1" || photosOnlyParam === "true";
  const isEditMode = Boolean(editSlug);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const createCampaign = useMutation(api.campaigns.create);
  const updateProfileDateOfBirth = useMutation(api.users.updateProfile);
  const updateCampaign = useMutation(api.campaignCreator.update);
  const proposeCampaignEdit = useMutation(api.campaignEditRequests.propose);
  const acceptDocuments = useMutation(api.legal.acceptDocuments);
  const resubmitCampaign = useMutation(api.campaignCreator.resubmit);
  const submitForReview = useMutation(api.campaignCreator.submitForReview);
  const generateImageUploadUrl = useMutation(api.campaignCreator.generateImageUploadUrl);
  const setCampaignImage = useMutation(api.campaignCreator.setImage);
  const setCampaignImages = useMutation(api.campaignCreator.setImages);
  const setCampaignVideoUrl = useMutation(api.campaignCreator.setVideoUrl);
  const setImpactItems = useMutation(api.campaignCreator.setImpactItems);
  const setPromotionalUseOptIn = useMutation(
    api.campaignCreator.setPromotionalUseOptIn,
  );
  const createVerificationSession = useAction(
    api.campaignIdentity.createVerificationSession,
  );
  const refreshVerificationStatus = useAction(
    api.campaignIdentity.refreshVerificationStatus,
  );
  const mySocieties = useQuery(
    api.societyMembers.listMyApprovedSocieties,
    isAuthenticated && !isEditMode ? {} : "skip",
  );
  const myProfile = useQuery(api.users.me, isAuthenticated ? {} : "skip");
  const editCampaign = useQuery(
    api.campaignCreator.getMineForEdit,
    isAuthenticated && editSlug ? { slug: editSlug } : "skip",
  );
  const requiresApproval = Boolean(editCampaign?.requiresApproval);
  const pendingCampaignEdit = useQuery(
    api.campaignEditRequests.getPendingForEntity,
    isAuthenticated && editSlug && requiresApproval ? { slug: editSlug } : "skip",
  );
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);
  const [cropQueue, setCropQueue] = useState<CropSourceImage[]>([]);
  const [cropReplaceIndex, setCropReplaceIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [template, setTemplate] = useState<string>(DEFAULT_CAMPAIGN_TEMPLATE_ID);
  const [pickedImages, setPickedImages] = useState<PickedImage[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [expectedExpenditureDate, setExpectedExpenditureDate] = useState("");
  const [plannedUpdateSchedule, setPlannedUpdateSchedule] = useState("");
  const [ownershipStatement, setOwnershipStatement] = useState("");
  const [promotionalUseOptIn, setPromotionalUseOptInLocal] = useState(false);
  const [promotionalUseSaving, setPromotionalUseSaving] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [dobInput, setDobInput] = useState("");
  const [dobError, setDobError] = useState<string | null>(null);
  const [dobSaving, setDobSaving] = useState(false);
  const [fundLines, setFundLines] = useState<FundLine[]>(initialFundLines);
  const [campaignSlug, setCampaignSlug] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [loadedEditSlug, setLoadedEditSlug] = useState<string | null>(null);

  // Edit mode operates on the existing campaign doc — adopt its slug
  // immediately so ensureCampaignCreated never creates a new one.
  useEffect(() => {
    if (editSlug && campaignSlug === null) {
      setCampaignSlug(editSlug);
    }
  }, [editSlug, campaignSlug]);

  // Populate the form once, when the campaign first loads — not on every
  // refetch, so it doesn't clobber in-progress edits.
  useEffect(() => {
    if (editCampaign && loadedEditSlug !== editCampaign.id) {
      setForm({
        title: editCampaign.title,
        category: editCampaign.category,
        communitySlug: editCampaign.creator.communityId,
        description: editCampaign.description,
        story: editCampaign.story,
        goal: String(editCampaign.goal),
      });
      setTemplate(editCampaign.template ?? DEFAULT_CAMPAIGN_TEMPLATE_ID);
      setVideoUrl(editCampaign.videoUrl ?? "");
      setAdditionalNotes(editCampaign.additionalNotes ?? "");
      setExpectedExpenditureDate(editCampaign.expectedExpenditureDate ?? "");
      setPlannedUpdateSchedule(editCampaign.plannedUpdateSchedule ?? "");
      setOwnershipStatement(editCampaign.ownershipStatement ?? "");
      setPromotionalUseOptInLocal(editCampaign.promotionalUseOptIn ?? false);
      const decodedLines = (editCampaign.impactItems ?? []).map((item) => {
        const parsed = parseImpactItem(item);
        return {
          label: parsed.label,
          amount: parsed.amount !== undefined ? String(parsed.amount) : "",
        };
      });
      setFundLines(decodedLines.length > 0 ? decodedLines : initialFundLines());
      setLoadedEditSlug(editCampaign.id);
    }
  }, [editCampaign, loadedEditSlug]);

  // Once a slug exists, this reflects the webhook-driven status in real time.
  const verification = useQuery(
    api.campaignCreator.getMyVerificationStatus,
    campaignSlug ? { slug: campaignSlug } : "skip",
  );

  // Fallback to the webhook: directly poll Stripe every few seconds while
  // unverified, in case the webhook is delayed, misconfigured, or hasn't
  // reached this deployment. Stops as soon as the query reflects "verified".
  // Wait until a session has actually been created — otherwise the poll
  // spam-fails with INVALID_STATE between campaign create and Verify click.
  useEffect(() => {
    const status = verification?.stripeVerificationStatus;
    if (
      !isStripeIdentityEnabled() ||
      !campaignSlug ||
      !status ||
      status === "verified"
    ) {
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
  const fundLinesStarted = filledFundLines.length > 0;
  const fundLinesComplete =
    fundLinesStarted &&
    !missingLineItems &&
    !lineAmountMissing &&
    totalsMatch;

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
        quality: 1,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const nextImages: CropSourceImage[] = [];
      for (const asset of result.assets) {
        if (asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES) {
          setError("Each campaign photo must be 5MB or smaller.");
          return;
        }
        nextImages.push({
          uri: asset.uri,
          mimeType: asset.mimeType,
          fileSize: asset.fileSize,
          width: asset.width,
          height: asset.height,
        });
      }

      setCropReplaceIndex(null);
      setCropQueue(nextImages.slice(0, remaining));
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setPickingImage(false);
    }
  };

  const removeCampaignImage = (index: number) => {
    setPickedImages((current) => current.filter((_, i) => i !== index));
  };

  const recropCampaignImage = (index: number) => {
    const image = pickedImages[index];
    if (!image) return;
    setCropReplaceIndex(index);
    setCropQueue([
      {
        uri: image.uri,
        mimeType: image.mimeType,
        fileSize: image.fileSize,
      },
    ]);
  };

  const handleCropCancel = () => {
    setCropQueue([]);
    setCropReplaceIndex(null);
  };

  const handleCropConfirm = (cropped: PickedImage) => {
    if (cropReplaceIndex != null) {
      setPickedImages((current) =>
        current.map((image, index) =>
          index === cropReplaceIndex ? cropped : image,
        ),
      );
      setCropReplaceIndex(null);
      setCropQueue([]);
      return;
    }

    setPickedImages((current) =>
      [...current, cropped].slice(0, MAX_CAMPAIGN_IMAGES),
    );
    setCropQueue((current) => current.slice(1));
  };

  const campaignImageSource =
    pickedImages[0]?.uri ?? editCampaign?.image ?? (form.category || "default");
  const pickedImageUris = pickedImages.map((image) => image.uri);

  /**
   * Creates the campaign (once) so Stripe Identity has a record to attach to —
   * mirrors the society wizard. Field edits made after this are synced via
   * campaignCreator.update when the user presses Complete.
   */
  const handleSaveDateOfBirth = async () => {
    setDobError(null);
    const trimmed = dobInput.trim();
    if (!parseIsoDateOnly(trimmed)) {
      setDobError("Select your day, month and year of birth.");
      return;
    }
    if (!isAtLeastAge(trimmed)) {
      setDobError("You must be at least 18 years old to create a campaign.");
      return;
    }
    setDobSaving(true);
    try {
      await updateProfileDateOfBirth({
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

  const ensureCampaignCreated = async (): Promise<string> => {
    if (!legalAccepted) {
      throw new Error("Please accept the campaign terms to continue.");
    }
    await acceptDocuments({ context: "create_campaign" });
    if (campaignSlug) return campaignSlug;

    const result = await createCampaign({
      title: form.title,
      category: form.category,
      communitySlug: form.communitySlug,
      description: form.description,
      story: form.story,
      goal: Number(form.goal),
      template,
      expectedExpenditureDate: expectedExpenditureDate.trim(),
      plannedUpdateSchedule: plannedUpdateSchedule.trim(),
      ownershipStatement: ownershipStatement.trim(),
    });
    setCampaignSlug(result.slug);
    return result.slug;
  };

  const handleVerifyIdentity = async () => {
    setError(null);
    if (!hasDateOfBirth) {
      setError("Please confirm your date of birth before verifying your identity.");
      return;
    }
    if (!legalAccepted) {
      setError("Please accept the campaign terms before verifying your identity.");
      return;
    }
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

  const dobLoading = isAuthenticated && myProfile === undefined;
  const hasDateOfBirth = Boolean(myProfile?.dateOfBirth);

  const stripeStatus = verification?.stripeVerificationStatus ?? null;
  const stripeVerified = stripeStatus === "verified";
  const stripeProcessing = stripeStatus === "processing";
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
          Verifying your identity... please wait until this completes
        </Text>
      </View>
    );
  };

  const parsedVideoUrl = parseCampaignVideoUrl(videoUrl);
  const videoUrlInvalid = videoUrl.trim().length > 0 && !parsedVideoUrl;

  const transparencyFieldsComplete =
    expectedExpenditureDate.trim().length > 0 &&
    plannedUpdateSchedule.trim().length > 0 &&
    ownershipStatement.trim().length > 0;

  const canProceed = () => {
    switch (step) {
      case 0:
        return (
          Boolean(form.title && form.category && form.communitySlug) &&
          !videoUrlInvalid
        );
      case 1:
        return form.description && form.story;
      case 2:
        return (
          Boolean(form.goal) &&
          Number(form.goal) > 0 &&
          transparencyFieldsComplete
        );
      case 3:
        // Live post-approval edits skip Identity — already verified at launch.
        if (requiresApproval) return true;
        // DOB + legal + Stripe Identity verified.
        return stripeVerified && legalAccepted && hasDateOfBirth;
      default:
        return true;
    }
  };

  const inputClass =
    "w-full rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 font-retro-mono text-sm text-retro-ink outline-none";
  const primaryBtnClass =
    "retro-key items-center rounded-full border-2 border-retro-ink bg-retro-mint px-5 py-2.5";
  const accentBtnClass =
    "retro-key items-center rounded-full border-2 border-retro-ink bg-retro-marigold px-6 py-2.5";
  const secondaryBtnClass =
    "retro-key items-center rounded-full border-2 border-retro-ink bg-retro-paper px-5 py-2.5";

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

  if (isAlumni(myProfile)) {
    return (
      <AppShell>
        <DonorCreateGate message="Donor accounts can't create campaigns. Browse campaigns to find one to support instead." />
      </AppShell>
    );
  }

  if (isEditMode && editCampaign === undefined) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (isEditMode && editCampaign === null) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-2xl px-4 py-16">
          <Text className="text-center text-[#5c574f]">
            Campaign not found, or you don&apos;t own this campaign.
          </Text>
        </View>
      </AppShell>
    );
  }

  if (isEditMode && photosOnly && editCampaign && editCampaign.canUploadPhotos) {
    const existingImages = getCampaignImages(editCampaign);
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-2xl px-4 py-8">
          <Text className="font-retro-bold text-2xl text-retro-ink">
            Add campaign photos
          </Text>
          <Text className="mt-1 text-sm text-[#5c574f]">
            {editCampaign.title} — photos appear on the campaign card and detail page.
          </Text>

          {existingImages.length > 0 ? (
            <View className="mt-6">
              <Text className="font-retro-bold text-sm text-retro-ink">
                Current photos
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="mt-2 gap-2"
              >
                {existingImages.map((uri) => (
                  <CampaignImage
                    key={uri}
                    image={uri}
                    className="h-20 w-28 rounded-lg"
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View className="mt-6">
            <Text className="font-retro-bold text-sm text-retro-ink">
              {existingImages.length > 0 ? "Replace photos" : "Upload photos"}
            </Text>
            <PhotoThumbnailPicker
              pickedImages={pickedImages}
              pickingImage={pickingImage}
              onPick={() => void pickCampaignImages()}
              onRemove={(index) =>
                setPickedImages((current) => current.filter((_, i) => i !== index))
              }
              onRemoveAll={() => setPickedImages([])}
              onRecrop={recropCampaignImage}
            />
          </View>

          <View className="mt-8 flex-row gap-3">
            <Pressable
              onPress={() => router.push(`/campaigns/${editCampaign.id}`)}
              className="retro-key rounded-full border-2 border-retro-ink bg-retro-paper px-5 py-3"
            >
              <Text className="font-retro-bold text-sm text-retro-ink">Cancel</Text>
            </Pressable>
            <Pressable
              disabled={submitting || pickedImages.length === 0}
              onPress={() => {
                const slug = editSlug;
                if (!slug) return;
                setError(null);
                setSubmitting(true);
                void uploadCampaignImages({
                  slug,
                  images: pickedImages,
                  generateUploadUrl: generateImageUploadUrl,
                  setImage: setCampaignImage,
                  setImages: setCampaignImages,
                })
                  .then((saved) => {
                    if (!saved) {
                      setError("Photos could not be saved. Try again.");
                      return;
                    }
                    router.push(`/campaigns/${editCampaign.id}`);
                  })
                  .catch((err: Error) => setError(getFriendlyAuthError(err)))
                  .finally(() => setSubmitting(false));
              }}
              className={`retro-key rounded-full border-2 border-retro-ink bg-retro-indigo px-5 py-3 ${
                submitting || pickedImages.length === 0 ? "opacity-50" : ""
              }`}
            >
              <Text className="font-retro-bold text-sm text-retro-paper">
                {submitting ? "Uploading..." : "Save photos"}
              </Text>
            </Pressable>
          </View>

          {error ? (
            <View className="mt-4 rounded-xl bg-rose-50 px-4 py-3">
              <Text className="text-sm text-rose-700">{error}</Text>
            </View>
          ) : null}
        </View>
        <ImageCropModal
          visible={cropQueue.length > 0}
          image={cropQueue[0] ?? null}
          progressLabel={
            cropReplaceIndex == null && cropQueue.length > 0
              ? `${pickedImages.length + 1} of ${pickedImages.length + cropQueue.length}`
              : undefined
          }
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      </AppShell>
    );
  }

  if (isEditMode && editCampaign && !editCampaign.editable && !photosOnly) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-2xl px-4 py-16">
          <Text className="font-retro-bold text-xl text-retro-ink">
            This campaign can&apos;t be edited right now
          </Text>
          <Text className="mt-2 text-sm text-[#5c574f]">
            Only campaigns that are pending, rejected, or have changes
            requested can be edited.
          </Text>
          <Pressable
            onPress={() => router.push(`/campaigns/${editCampaign.id}`)}
            className={`mt-6 self-start ${primaryBtnClass}`}
          >
            <Text className="font-retro-bold text-sm text-retro-paper">
              View campaign
            </Text>
          </Pressable>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View
        className={`mx-auto w-full px-4 py-8 ${step === 3 ? "max-w-7xl" : "max-w-2xl"}`}
      >
        <View className="mb-8 items-center">
          <Text className="font-retro-bold text-2xl text-retro-ink">
            {isEditMode ? "Edit Campaign" : "Start a Campaign"}
          </Text>
          <Text className="mt-1 text-center text-[#5c574f]">
            {requiresApproval
              ? "Propose changes for admin review. Your live campaign stays public until approved."
              : isEditMode
                ? "Update your campaign and resubmit it for review."
                : "Free for students. Reach alumni who care about your community."}
          </Text>
        </View>

        {pendingCampaignEdit ? (
          <View className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Text className="text-center text-sm text-amber-900">
              You already have edits pending review. Submitting again will
              replace them.
            </Text>
          </View>
        ) : null}

        <View className="mb-8 w-full items-center">
          <View className="w-full max-w-lg flex-row items-start">
            {steps.map((label, i) => (
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
                    className={`h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      i <= step ? "bg-retro-mint" : "bg-retro-cream"
                    }`}
                  >
                    {i < step ? (
                      <Check
                        size={16}
                        color="#fff"
                        accessibilityLabel="Step complete"
                      />
                    ) : (
                      <Text
                        className={`text-xs font-bold ${
                          i === step ? "text-white" : "text-[#5c574f]"
                        }`}
                      >
                        {i + 1}
                      </Text>
                    )}
                  </View>
                  {i < steps.length - 1 ? (
                    <View
                      className={`h-0.5 flex-1 ${
                        i < step ? "bg-retro-mint" : "bg-retro-ink/20"
                      }`}
                    />
                  ) : (
                    <View className="flex-1" />
                  )}
                </View>
                <Text
                  className={`mt-2 text-center text-xs ${
                    i === step
                      ? "font-retro-bold text-retro-ink"
                      : i < step
                        ? "text-[#5c574f]"
                        : "text-[#5c574f]"
                  }`}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-6">
          {step === 0 && (
            <View className="gap-5">
              <View>
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
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
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                  Campaign Video
                </Text>
                <TextInput
                  value={videoUrl}
                  onChangeText={setVideoUrl}
                  placeholder="https://youtube.com/watch?v=… or vimeo.com/…"
                  placeholderTextColor="#56615A"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className={inputClass}
                />
                <Text className="mt-1.5 text-xs text-[#5c574f]">
                  Optional. Paste a YouTube or Vimeo link for the main media box.
                </Text>
                {videoUrlInvalid ? (
                  <Text className="mt-1 text-xs text-red-600">
                    Enter a valid YouTube or Vimeo URL.
                  </Text>
                ) : null}
              </View>

              <View>
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                  Campaign Photos
                </Text>
                <View className="overflow-hidden rounded-2xl border border-retro-ink">
                  <CampaignImage image={campaignImageSource} className="h-48">
                    {form.category ? (
                      <View className="absolute left-4 top-4">
                        <CategoryBadge category={form.category} />
                      </View>
                    ) : null}
                  </CampaignImage>
                </View>
                <View className="mt-3">
                  <PhotoThumbnailPicker
                    pickedImages={pickedImages}
                    pickingImage={pickingImage}
                    onPick={() => void pickCampaignImages()}
                    onRemove={removeCampaignImage}
                    onRemoveAll={() => setPickedImages([])}
                    onRecrop={recropCampaignImage}
                  />
                </View>
              </View>

              <View>
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {ALLOWED_CAMPAIGN_CATEGORIES.map((key) => {
                      const label = categoryLabels[key] ?? key;
                      return (
                        <Pressable
                          key={key}
                          onPress={() => update("category", key)}
                          className={`rounded-lg border-2 px-3 py-2.5 ${
                            form.category === key
                              ? "border-retro-ink bg-retro-mint/10"
                              : "border-retro-ink"
                          }`}
                        >
                          <Text
                            className={`font-retro-bold text-xs ${
                              form.category === key
                                ? "text-retro-mint"
                                : "text-[#5c574f]"
                            }`}
                          >
                            {label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              <View>
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                  Posting on behalf of
                </Text>
                {isEditMode ? (
                  <View className="gap-1 rounded-xl border-2 border-retro-ink bg-retro-cream p-4">
                    <Text className="font-retro-bold text-xs text-retro-ink">
                      {editCampaign?.creator.name ?? "Loading..."}
                    </Text>
                    <Text className="text-xs text-[#5c574f]">
                      The society a campaign posts under can&apos;t be changed.
                    </Text>
                  </View>
                ) : mySocieties === undefined ? (
                  <ActivityIndicator color="#17211B" />
                ) : mySocieties.length === 0 ? (
                  <View className="gap-3 rounded-xl border-2 border-retro-ink bg-retro-cream p-4">
                    <Text className="text-sm text-[#5c574f]">
                      Campaigns can only be created by society members. Join a
                      society or create one first.
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      <Link href="/societies" asChild>
                        <Pressable className="retro-key rounded-full border-2 border-retro-ink bg-retro-paper px-4 py-2">
                          <Text className="font-retro-bold text-xs text-retro-ink">
                            Browse societies
                          </Text>
                        </Pressable>
                      </Link>
                      <Link href="/create-society" asChild>
                        <Pressable className="retro-key rounded-full border-2 border-retro-ink bg-retro-mint px-4 py-2">
                          <Text className="font-retro-bold text-xs text-retro-paper">
                            Create a society
                          </Text>
                        </Pressable>
                      </Link>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row flex-wrap gap-2">
                    {mySocieties.map((society) => (
                      <Pressable
                        key={society.slug}
                        onPress={() => update("communitySlug", society.slug)}
                        className={`rounded-lg border-2 px-3 py-2.5 ${
                          form.communitySlug === society.slug
                            ? "border-retro-ink bg-retro-mint/10"
                            : "border-retro-ink"
                        }`}
                      >
                        <Text
                          className={`font-retro-bold text-xs ${
                            form.communitySlug === society.slug
                              ? "text-retro-mint"
                              : "text-[#5c574f]"
                          }`}
                        >
                          {society.name}
                          {society.role === "leader" ? " · Leader" : ""}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {step === 1 && (
            <View className="gap-5">
              <View>
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
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
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
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
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
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
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                  What your donation funds
                </Text>
                <Text className="mb-3 text-xs text-[#5c574f]">
                  Optional — itemise how you&apos;ll spend the money (amounts in £). If
                  you add lines, they must add up to your funding goal. Donors see this
                  as a transparent ledger.
                </Text>
                <ReceiptLedger>
                  {fundLines.map((line, index) => (
                    <View key={index} className="mb-3 flex-row items-center gap-2">
                      <TextInput
                        value={line.label}
                        onChangeText={(v) => updateFundLine(index, "label", v)}
                        placeholder="e.g. Core textbook"
                        placeholderTextColor="#56615A"
                        className="min-w-0 flex-1 rounded-lg border border-retro-ink/80 bg-white px-3 py-2.5 text-sm text-retro-ink"
                      />
                      <View className="w-[5.5rem] flex-row items-center rounded-lg border border-retro-ink/80 bg-white">
                        <Text className="pl-3 font-retro-mono text-sm text-[#5c574f]">£</Text>
                        <TextInput
                          value={line.amount}
                          onChangeText={(v) => updateFundLine(index, "amount", v)}
                          placeholder="0"
                          placeholderTextColor="#56615A"
                          keyboardType="numeric"
                          className="min-w-0 flex-1 py-2.5 pr-3 text-right font-retro-mono text-sm text-retro-ink"
                        />
                      </View>
                      {fundLines.length > MIN_FUND_LINES ? (
                        <Pressable
                          onPress={() => removeFundLine(index)}
                          className="h-10 w-10 items-center justify-center rounded-lg border border-retro-ink/80 bg-white"
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
                      className="mb-1 flex-row items-center justify-center gap-1.5 rounded-lg border border-dashed border-retro-ink bg-white/80 py-2.5"
                    >
                      <Plus size={14} color="#56615A" />
                      <Text className="font-retro-bold text-xs text-[#5c574f]">
                        Add line item
                      </Text>
                    </Pressable>
                  ) : null}
                  <ReceiptDivider />
                  <ReceiptTotalRow
                    label="Total goal"
                    amount={goalAmount > 0 ? goalAmount : "—"}
                  />
                  {fundLinesStarted && goalAmount > 0 && missingLineItems ? (
                    <Text className="mt-2 text-xs text-rose-700">
                      Add at least {MIN_FUND_LINES} line items, each with a label and
                      an amount.
                    </Text>
                  ) : fundLinesStarted && goalAmount > 0 && lineAmountMissing ? (
                    <Text className="mt-2 text-xs text-rose-700">
                      Every line item needs an amount greater than £0.
                    </Text>
                  ) : fundLinesStarted && goalAmount > 0 && !totalsMatch ? (
                    <Text className="mt-2 text-xs text-rose-700">
                      Line items total {formatCurrency(fundLineTotal)} — must equal{" "}
                      {formatCurrency(goalAmount)}
                    </Text>
                  ) : null}
                </ReceiptLedger>
              </View>

              <View>
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                  Expected expenditure date
                </Text>
                <DateInput
                  value={expectedExpenditureDate}
                  onChange={setExpectedExpenditureDate}
                  placeholder="Pick a date"
                />
                <Text className="mt-1.5 text-xs text-[#5c574f]">
                  When you expect purchases or spending to happen.
                </Text>
              </View>

              <View>
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                  Planned update schedule
                </Text>
                <TextInput
                  value={plannedUpdateSchedule}
                  onChangeText={setPlannedUpdateSchedule}
                  placeholder="e.g. Monthly progress posts until funds are spent"
                  placeholderTextColor="#56615A"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className={`${inputClass} min-h-[80px]`}
                />
              </View>

              <View>
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                  Ownership statement
                </Text>
                <TextInput
                  value={ownershipStatement}
                  onChangeText={setOwnershipStatement}
                  placeholder="Who will own funded property or outputs?"
                  placeholderTextColor="#56615A"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className={`${inputClass} min-h-[80px]`}
                />
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
                <Text className="text-lg font-retro-bold text-retro-ink">
                  Review your campaign
                </Text>
                <Text className="mt-1 text-sm text-[#5c574f]">
                  This is how donors will see your campaign once it&apos;s live.
                </Text>
              </View>

              {ENABLE_CAMPAIGN_TEMPLATES ? (
                <View>
                  <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                    Choose a template
                  </Text>
                  <Text className="mb-3 text-xs text-[#5c574f]">
                    Sets your campaign page's layout and accent color. The preview below
                    updates as you pick.
                  </Text>
                  <View className="flex-row flex-wrap gap-3">
                    {CAMPAIGN_TEMPLATES.map((tpl) => {
                      const selected = template === tpl.id;
                      return (
                        <Pressable
                          key={tpl.id}
                          onPress={() => setTemplate(tpl.id)}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          className={`w-full overflow-hidden rounded-2xl border-2 sm:w-[calc(50%-0.5rem)] ${
                            selected ? "border-retro-ink" : "border-retro-ink/30"
                          }`}
                        >
                          <View
                            className={`p-3 ${selected ? "bg-retro-mint/10" : "bg-white"}`}
                          >
                            <View className="flex-row items-center justify-between">
                              <Text className="font-retro-bold text-sm text-retro-ink">
                                {tpl.name}
                              </Text>
                              {selected ? (
                                <View className="h-5 w-5 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-mint">
                                  <Check size={12} color="#fff" />
                                </View>
                              ) : null}
                            </View>
                            <Text className="mb-3 mt-0.5 text-xs text-[#5c574f]">
                              {tpl.description}
                            </Text>
                            <CampaignTemplateWireframe
                              heroLayout={tpl.unlocks.heroLayout}
                              accentHex={tpl.unlocks.accentHex}
                            />
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              <CampaignPreview
                title={form.title}
                category={form.category}
                university={DEFAULT_UNIVERSITY}
                story={form.story}
                goal={Number(form.goal)}
                imageUris={pickedImageUris}
                imageUri={pickedImageUris.length === 0 ? editCampaign?.image : undefined}
                impactLines={previewImpactLines}
                template={ENABLE_CAMPAIGN_TEMPLATES ? template : undefined}
                additionalNotes={additionalNotes}
              />

              <View className="rounded-xl border border-retro-ink bg-white p-4">
                <View className="mb-3 flex-row items-center gap-2">
                  <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-mint">
                    <Plus size={14} color="#fff" />
                  </View>
                  <Text className="font-retro-bold text-sm text-retro-ink">Add more</Text>
                </View>
                <Text className="mb-3 text-xs text-[#5c574f]">
                  Add more photos, a video, or any extra details donors should know —
                  the preview above updates as you go.
                </Text>

                <View className="gap-4">
                  <View>
                    <Text className="mb-1.5 font-retro-bold text-xs text-retro-ink">
                      Photos
                    </Text>
                    <PhotoThumbnailPicker
                      pickedImages={pickedImages}
                      pickingImage={pickingImage}
                      onPick={() => void pickCampaignImages()}
                      onRemove={removeCampaignImage}
                      onRemoveAll={() => setPickedImages([])}
                      onRecrop={recropCampaignImage}
                    />
                  </View>

                  <View>
                    <Text className="mb-1.5 font-retro-bold text-xs text-retro-ink">
                      Video
                    </Text>
                    <TextInput
                      value={videoUrl}
                      onChangeText={setVideoUrl}
                      placeholder="https://youtube.com/watch?v=… or vimeo.com/…"
                      placeholderTextColor="#56615A"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className={inputClass}
                    />
                    {videoUrlInvalid ? (
                      <Text className="mt-1 text-xs text-red-600">
                        Enter a valid YouTube or Vimeo URL.
                      </Text>
                    ) : null}
                  </View>

                  <View>
                    <Text className="mb-1.5 font-retro-bold text-xs text-retro-ink">
                      Additional notes
                    </Text>
                    <TextInput
                      value={additionalNotes}
                      onChangeText={(v) =>
                        setAdditionalNotes(v.slice(0, MAX_ADDITIONAL_NOTES_LENGTH))
                      }
                      placeholder="Anything else donors should know — timelines, acknowledgements, links…"
                      placeholderTextColor="#56615A"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      className={`${inputClass} min-h-[100px]`}
                    />
                    <Text className="mt-1.5 text-xs text-[#5c574f]">
                      Optional. {additionalNotes.length}/{MAX_ADDITIONAL_NOTES_LENGTH}
                    </Text>
                  </View>

                  {campaignSlug ? (
                    <View>
                      <Pressable
                        onPress={() => {
                          const next = !promotionalUseOptIn;
                          setPromotionalUseOptInLocal(next);
                          setPromotionalUseSaving(true);
                          void setPromotionalUseOptIn({
                            slug: campaignSlug,
                            optIn: next,
                          }).finally(() => setPromotionalUseSaving(false));
                        }}
                        className="flex-row items-center gap-2 py-1"
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: promotionalUseOptIn }}
                      >
                        <View
                          className={`h-4 w-4 items-center justify-center rounded border ${
                            promotionalUseOptIn
                              ? "border-dono-primary bg-dono-primary"
                              : "border-dono-border bg-white"
                          }`}
                        >
                          {promotionalUseOptIn ? (
                            <Text className="text-[9px] font-bold leading-none text-white">
                              ✓
                            </Text>
                          ) : null}
                        </View>
                        <Text className="min-w-0 flex-1 text-sm text-retro-ink">
                          Dono may use this campaign&apos;s photos and updates in its
                          own marketing
                        </Text>
                      </Pressable>
                      <Text className="mt-1.5 text-xs text-[#5c574f]">
                        Optional. You can withdraw this at any time.
                        {promotionalUseSaving ? " Saving…" : ""}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {isEditMode && stripeVerified ? (
                <View className="rounded-xl border border-retro-ink bg-white p-4">
                  <LegalAcceptanceCheckbox
                    context="create_campaign"
                    accepted={legalAccepted}
                    onAcceptedChange={setLegalAccepted}
                  />
                </View>
              ) : (
                <View className="rounded-xl border border-retro-ink bg-white p-4">
                  <View className="mb-1.5 flex-row items-center gap-2">
                    <ShieldCheck size={16} color="#17211B" />
                    <Text className="font-retro-bold text-sm text-retro-ink">
                      Identity Check
                    </Text>
                  </View>
                  <Text className="mb-3 text-xs text-[#5c574f]">
                    You'll be asked for a quick photo of your ID and a selfie so we
                    can confirm it's really you — it only takes a minute.
                  </Text>

                  {!dobLoading && !hasDateOfBirth ? (
                    <View className="mb-3 rounded-lg border border-dono-border bg-dono-surface-muted p-3">
                      <Text className="mb-1.5 font-retro-bold text-xs text-retro-ink">
                        Confirm your date of birth
                      </Text>
                      <Text className="mb-2 text-xs text-[#5c574f]">
                        You must be at least 18 to create a campaign — we need this on
                        file before you can verify your identity.
                      </Text>
                      <DobSelect
                        value={dobInput}
                        onChange={setDobInput}
                        triggerClassName={RETRO_SELECT_TRIGGER_CLASS}
                        textClassName={RETRO_SELECT_TEXT_CLASS}
                      />
                      {dobError ? (
                        <Text className="mt-1.5 text-xs text-rose-700">{dobError}</Text>
                      ) : null}
                      <Pressable
                        onPress={() => void handleSaveDateOfBirth()}
                        disabled={dobSaving || !dobInput.trim()}
                        className={`mt-2 flex-row ${primaryBtnClass} gap-2 self-start px-4 ${
                          dobSaving || !dobInput.trim() ? "opacity-50" : ""
                        }`}
                      >
                        {dobSaving ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text className="font-retro-bold text-sm text-retro-paper">
                            Save date of birth
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  ) : null}

                  <LegalAcceptanceCheckbox
                    context="create_campaign"
                    accepted={legalAccepted}
                    onAcceptedChange={setLegalAccepted}
                    className="mb-3"
                  />

                  {renderVerificationStatus()}

                  <Pressable
                    onPress={() => void handleVerifyIdentity()}
                    disabled={
                      verifying ||
                      stripeVerified ||
                      stripeProcessing ||
                      !legalAccepted ||
                      !hasDateOfBirth
                    }
                    className={`mt-3 flex-row ${primaryBtnClass} gap-2 self-start px-4 ${
                      verifying ||
                      stripeVerified ||
                      stripeProcessing ||
                      !legalAccepted ||
                      !hasDateOfBirth
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    {verifying ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-retro-bold text-sm text-retro-paper">
                        {stripeProcessing
                          ? "Verification in progress..."
                          : "Verify your identity"}
                      </Text>
                    )}
                  </Pressable>
                  {!hasDateOfBirth ? (
                    <Text className="mt-2 text-xs text-[#5c574f]">
                      Confirm your date of birth above before starting identity
                      verification.
                    </Text>
                  ) : !legalAccepted ? (
                    <Text className="mt-2 text-xs text-[#5c574f]">
                      Accept the terms above before starting identity verification.
                    </Text>
                  ) : stripeFailed ? (
                    <Text className="mt-2 text-xs text-rose-700">
                      That didn't go through — please try again.
                    </Text>
                  ) : !stripeVerified ? (
                    <Text className="mt-2 text-xs text-[#5c574f]">
                      You'll be able to continue once your identity is verified.
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          )}

          {step === 4 && (
            <View className="gap-5">
              <Text className="text-lg font-retro-bold text-retro-ink">
                {requiresApproval
                  ? "Submit edits for review"
                  : isEditMode
                    ? "Before your changes go live"
                    : "Before your campaign goes live"}
              </Text>
              <Text className="text-sm leading-relaxed text-[#5c574f]">
                {requiresApproval
                  ? "Your proposed edits go to our team. The public campaign page stays as-is until they approve."
                  : isEditMode
                    ? "Resubmitting sends your campaign back to our team for review, the same as a new submission. We'll reach out directly if anything still needs adjusting."
                    : "We take moderation seriously. Every campaign is reviewed by our team to make sure it meets Dono's guidelines and has the best possible chance of reaching alumni and getting funded. We'll reach out directly if anything needs adjusting."}
              </Text>
              {requiresApproval ? null : renderVerificationStatus()}
            </View>
          )}

          {step === 5 && (
            <View className="items-center gap-3 py-4">
              <CheckCircle2 size={32} color="#17211B" />
              <Text className="text-center text-lg font-retro-bold text-retro-ink">
                Confirmed!
              </Text>
              <Text className="text-center text-sm leading-relaxed text-[#5c574f]">
                {requiresApproval
                  ? "Submitted for admin review — your live page is unchanged until approved."
                  : "Check back to see if your campaign\u2019s been approved."}
              </Text>
              <Link href="/campaigns" asChild>
                <Pressable
                  className={`mt-2 ${primaryBtnClass}`}
                >
                  <Text className="font-retro-bold text-sm text-retro-paper">
                    Back to Campaigns
                  </Text>
                </Pressable>
              </Link>
            </View>
          )}

          <View className="mt-8 flex-row justify-between">
            {step > 0 && step < 5 ? (
              <Pressable
                onPress={() => setStep(step - 1)}
                className={secondaryBtnClass}
              >
                <Text className="font-retro-bold text-sm text-[#5c574f]">Back</Text>
              </Pressable>
            ) : (
              <View />
            )}

            {step < 3 ? (
              <Pressable
                onPress={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`flex-row ${primaryBtnClass} gap-2 ${
                  !canProceed() ? "opacity-50" : ""
                }`}
              >
                <Text className="font-retro-bold text-sm text-retro-paper">Continue</Text>
                <ArrowRight size={16} color="#fff" />
              </Pressable>
            ) : step === 3 ? (
              <Pressable
                onPress={() => {
                  if (requiresApproval) {
                    setError(null);
                    setStep(4);
                    return;
                  }
                  if (!legalAccepted) {
                    setError("Please accept the campaign terms to continue.");
                    return;
                  }
                  setError(null);
                  setSubmitting(true);
                  void acceptDocuments({ context: "create_campaign" })
                    .then(() => setStep(4))
                    .catch((err: Error) => {
                      setError(
                        getFriendlyAuthError(err) ||
                          "Could not record legal acceptance.",
                      );
                    })
                    .finally(() => setSubmitting(false));
                }}
                disabled={!canProceed() || submitting}
                className={`${requiresApproval || stripeVerified ? primaryBtnClass : accentBtnClass} ${
                  !canProceed() || submitting ? "opacity-50" : ""
                }`}
              >
                <Text className="font-retro-bold text-sm text-retro-paper">Continue</Text>
              </Pressable>
            ) : step === 4 ? (
              <Pressable
                disabled={submitting}
                onPress={() => {
                  setError(null);
                  setSubmitting(true);
                  // The campaign was created when the identity check started
                  // (or already existed, in edit mode) — push any fields
                  // edited since, then attach the extras.
                  void (async () => {
                    const slug = campaignSlug ?? (await ensureCampaignCreated());
                    if (requiresApproval) {
                      await proposeCampaignEdit({
                        slug,
                        proposed: {
                          title: form.title,
                          category: form.category,
                          description: form.description,
                          story: form.story,
                          goal: Number(form.goal),
                          template,
                          additionalNotes,
                          expectedExpenditureDate: expectedExpenditureDate.trim(),
                          plannedUpdateSchedule: plannedUpdateSchedule.trim(),
                          ownershipStatement: ownershipStatement.trim(),
                          videoUrl: parsedVideoUrl?.watchUrl ?? "",
                          impactItems:
                            fundLinesComplete || filledFundLines.length === 0
                              ? fundLinesComplete
                                ? encodedImpactItems
                                : []
                              : undefined,
                        },
                      });
                      return slug;
                    }
                    await updateCampaign({
                      slug,
                      title: form.title,
                      category: form.category,
                      description: form.description,
                      story: form.story,
                      goal: Number(form.goal),
                      template,
                      additionalNotes,
                      expectedExpenditureDate: expectedExpenditureDate.trim(),
                      plannedUpdateSchedule: plannedUpdateSchedule.trim(),
                      ownershipStatement: ownershipStatement.trim(),
                      ...(isEditMode ? { logEdit: true } : {}),
                    });
                    return slug;
                  })()
                    .then(async (slug) => {
                      let imageUploadFailed = false;
                      let videoSaveFailed = false;
                      if (!requiresApproval) {
                        try {
                          // Fund breakdown is optional — only persist when complete,
                          // or clear it when the creator left the section empty.
                          if (fundLinesComplete || filledFundLines.length === 0) {
                            await setImpactItems({
                              slug,
                              impactItems: fundLinesComplete
                                ? encodedImpactItems
                                : [],
                            });
                          }
                        } catch {
                          setError(
                            "Campaign saved but fund breakdown could not be saved. Try again from this page.",
                          );
                        }
                        // Edit mode always pushes the video field, including
                        // clearing it — create mode only sets it when non-empty
                        // since a brand-new campaign starts with none anyway.
                        if (parsedVideoUrl || isEditMode) {
                          try {
                            await setCampaignVideoUrl({
                              slug,
                              videoUrl: parsedVideoUrl?.watchUrl ?? "",
                            });
                          } catch {
                            videoSaveFailed = true;
                          }
                        }
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

                      if (imageUploadFailed && pickedImages.length > 0) {
                        setError(
                          "Campaign saved but photos could not be uploaded. Open the campaign from My Campaigns to add photos.",
                        );
                        return;
                      }

                      if (isEditMode && !requiresApproval) {
                        await resubmitCampaign({ slug });
                      } else if (!isEditMode && !requiresApproval) {
                        await submitForReview({ slug });
                      }

                      posthog?.capture(
                        requiresApproval
                          ? "campaign_edit_proposed"
                          : isEditMode
                            ? "campaign_resubmitted"
                            : "campaign_created",
                        {
                          campaign_title: form.title,
                          campaign_category: form.category,
                          campaign_community_slug: form.communitySlug,
                          campaign_university: DEFAULT_UNIVERSITY,
                          campaign_goal: Number(form.goal),
                          campaign_has_image:
                            pickedImages.length > 0 && !imageUploadFailed,
                          campaign_image_count: pickedImages.length,
                          campaign_has_video:
                            Boolean(parsedVideoUrl) && !videoSaveFailed,
                          campaign_impact_items: impactItemLabels.length,
                          campaign_template: template,
                        },
                      );
                      setForm(initialForm);
                      setTemplate(DEFAULT_CAMPAIGN_TEMPLATE_ID);
                      setPickedImages([]);
                      setVideoUrl("");
                      setAdditionalNotes("");
                      setExpectedExpenditureDate("");
                      setPlannedUpdateSchedule("");
                      setOwnershipStatement("");
                      setLegalAccepted(false);
                      setFundLines(initialFundLines());
                      setCampaignSlug(null);
                      setError(null);
                      setStep(5);
                    })
                    .catch((err: Error) => {
                      setError(
                        getFriendlyAuthError(err) ||
                          (requiresApproval
                            ? "Failed to submit edits for review."
                            : isEditMode
                              ? "Failed to resubmit campaign."
                              : "Failed to create campaign."),
                      );
                    })
                    .finally(() => {
                      setSubmitting(false);
                    });
                }}
                className={`${accentBtnClass} ${
                  submitting ? "opacity-50" : ""
                }`}
              >
                <Text className="font-retro-bold text-sm text-retro-paper">
                  {submitting
                    ? requiresApproval
                      ? "Submitting..."
                      : isEditMode
                        ? "Resubmitting..."
                        : pickedImages.length > 0
                          ? "Creating & uploading..."
                          : "Completing..."
                    : requiresApproval
                      ? "Submit for review"
                      : isEditMode
                        ? "Resubmit for review"
                        : "Complete"}
                </Text>
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
      <ImageCropModal
        visible={cropQueue.length > 0}
        image={cropQueue[0] ?? null}
        progressLabel={
          cropReplaceIndex == null && cropQueue.length > 0
            ? `${pickedImages.length + 1} of ${pickedImages.length + cropQueue.length}`
            : undefined
        }
        onCancel={handleCropCancel}
        onConfirm={handleCropConfirm}
      />
    </AppShell>
  );
}
