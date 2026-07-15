import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useConvexAuth, useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { CheckCircle2, ArrowRight, ImagePlus } from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignPreview } from "@/components/campaign-preview";
import { LoginGate } from "@/components/login-gate";
import { CampaignImage } from "@/components/ui/campaign-image";
import { CategoryBadge } from "@/components/ui/category-badge";
import { categoryLabels } from "@/lib/constants";
import { MAX_CAMPAIGN_IMAGES } from "@/lib/campaign-images";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { uploadCampaignImages } from "@/lib/upload-campaign-images";
import { api } from "@convex/_generated/api";

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
  const generateImageUploadUrl = useMutation(api.campaignCreator.generateImageUploadUrl);
  const setCampaignImage = useMutation(api.campaignCreator.setImage);
  const setCampaignImages = useMutation(api.campaignCreator.setImages);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [pickedImages, setPickedImages] = useState<PickedImage[]>([]);

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

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.title && form.category && form.creatorType;
      case 1:
        return form.description && form.story;
      case 2:
        return form.goal && Number(form.goal) > 0;
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
                    <CheckCircle2 size={16} color="#fff" />
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
                <Text className="mt-1.5 text-xs text-dono-muted">
                  Dono is optimised for small-to-medium funding needs (£500–£10,000)
                </Text>
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
              />
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
                className="rounded-full bg-dono-accent px-6 py-2.5"
              >
                <Text className="font-sans-medium text-sm text-white">Verify Campaign</Text>
              </Pressable>
            ) : (
              <Pressable
                disabled={submitting}
                onPress={() => {
                  setError(null);
                  setSubmitting(true);
                  void createCampaign({
                    title: form.title,
                    category: form.category,
                    creatorType: form.creatorType,
                    university: DEFAULT_UNIVERSITY,
                    description: form.description,
                    story: form.story,
                    goal: Number(form.goal),
                  })
                    .then(async (result) => {
                      let imageUploadFailed = false;
                      if (pickedImages.length > 0) {
                        try {
                          const allUploaded = await uploadCampaignImages({
                            slug: result.slug,
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
                      });
                      setForm(initialForm);
                      setPickedImages([]);
                      setStep(0);
                      setError(null);
                      router.push(`/campaigns/${result.slug}`);
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
                  submitting ? "opacity-50" : ""
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
