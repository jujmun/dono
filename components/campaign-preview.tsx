import { View, Text } from "react-native";
import { Clock, MapPin } from "lucide-react-native";
import { CampaignImageGallery } from "@/components/campaign-image-gallery";
import { CategoryBadge } from "@/components/ui/category-badge";
import { VerificationList } from "@/components/ui/verification-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EngagementStats } from "@/components/activity-feed";
import {
  FundBreakdownSection,
  ReceiptDivider,
  ReceiptLedger,
  ReceiptLineRow,
  ReceiptTotalRow,
} from "@/components/ui/receipt-lines";
import { formatCurrency } from "@/lib/constants";

function previewDeadline(): string {
  const deadline = new Date();
  deadline.setMonth(deadline.getMonth() + 2);
  return deadline.toISOString().slice(0, 10);
}

export interface CampaignPreviewProps {
  title: string;
  category: string;
  university: string;
  story: string;
  goal: number;
  imageUri?: string | null;
  imageUris?: string[];
  impactLines?: { label: string; amount: number }[];
}

export function CampaignPreview({
  title,
  category,
  university,
  story,
  goal,
  imageUri,
  imageUris,
  impactLines,
}: CampaignPreviewProps) {
  const deadline = previewDeadline();
  const previewImages =
    imageUris?.length ? imageUris : imageUri ? [imageUri] : undefined;

  return (
    <View className="flex-col lg:flex-row lg:items-start lg:gap-8">
      <View className="min-w-0 flex-1">
        <CampaignImageGallery
          images={previewImages}
          category={category}
          className="mb-6"
          heroClassName="h-56 rounded-2xl"
        >
          <View className="absolute left-4 top-4">
            <CategoryBadge category={category} />
          </View>
        </CampaignImageGallery>

        <View className="mb-4">
          <VerificationList
            verifications={[{ type: "student", label: "New Campaign" }]}
            size="md"
          />
        </View>

        <Text className="mb-3 font-display-medium text-2xl text-dono-text">{title}</Text>

        <View className="mb-4 gap-2">
          <View className="flex-row items-center gap-1">
            <MapPin size={16} color="#56615A" />
            <Text className="text-sm text-dono-muted">{university}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock size={16} color="#56615A" />
            <Text className="font-mono text-sm text-dono-muted">
              Deadline:{" "}
              {new Date(deadline).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <EngagementStats
          likes={0}
          donors={0}
          followers={0}
          comments={0}
          className="mb-6"
        />

        <View className="mb-8 rounded-2xl border border-dono-border bg-white p-6">
          <Text className="mb-3 text-lg font-sans-medium text-dono-text">The story</Text>
          <Text className="leading-relaxed text-dono-muted">{story}</Text>
        </View>

        {impactLines && impactLines.length > 0 ? (
          <FundBreakdownSection className="mb-8">
            <ReceiptLedger>
              {impactLines.map((line) => (
                <ReceiptLineRow key={line.label} label={line.label} amount={line.amount} />
              ))}
              <ReceiptDivider />
              <ReceiptTotalRow label="Total goal" amount={goal} />
            </ReceiptLedger>
          </FundBreakdownSection>
        ) : null}
      </View>

      <View className="mt-8 w-full shrink-0 lg:mt-0 lg:w-80">
        <View className="rounded-2xl border border-dono-border bg-white p-6">
          <View className="mb-4 flex-row items-baseline justify-between">
            <Text className="font-mono-medium text-3xl text-dono-primary">
              {formatCurrency(0)}
            </Text>
            <Text className="text-sm text-dono-muted">of {formatCurrency(goal)}</Text>
          </View>
          <ProgressBar value={0} className="mt-3" showLabel />
          <Text className="mt-2 text-sm text-dono-muted">0 donors · 0 followers</Text>

          <View className="mt-4 rounded-full bg-dono-accent py-3">
            <Text className="text-center font-sans-medium text-sm text-white">Donate Now</Text>
          </View>

          <View className="mt-3 flex-row gap-2">
            <View className="flex-1 items-center rounded-xl border border-dono-border py-2.5">
              <Text className="font-sans-medium text-sm text-dono-muted">Like</Text>
            </View>
            <View className="flex-1 items-center rounded-xl border border-dono-border py-2.5">
              <Text className="font-sans-medium text-sm text-dono-muted">Follow</Text>
            </View>
            <View className="items-center justify-center rounded-xl border border-dono-border px-3 py-2.5">
              <Text className="font-sans-medium text-sm text-dono-muted">↗</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
