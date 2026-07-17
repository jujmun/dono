import { useState } from "react";
import { View, Pressable, Text, Platform, Linking } from "react-native";
import { Play } from "lucide-react-native";
import { CampaignImage } from "@/components/ui/campaign-image";
import {
  getCampaignImages,
  getPrimaryCampaignImage,
} from "@/lib/campaign-images";
import { parseCampaignVideoUrl } from "@/lib/video-url";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CampaignMediaHeroProps {
  campaign: Campaign;
  className?: string;
}

export function CampaignMediaHero({
  campaign,
  className,
}: CampaignMediaHeroProps) {
  const parsedVideo = parseCampaignVideoUrl(campaign.videoUrl);

  const galleryImages = (() => {
    const images = getCampaignImages(campaign);
    if (images.length > 0) return images;
    return [getPrimaryCampaignImage(campaign)];
  })();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeIndex = Math.min(selectedIndex, galleryImages.length - 1);
  const activeImage = galleryImages[activeIndex];

  const openExternalVideo = () => {
    if (!parsedVideo) return;
    void Linking.openURL(parsedVideo.watchUrl);
  };

  return (
    <View className={className}>
      <View className="relative overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-indigo shadow-[5px_5px_0_#211E1A]">
        {parsedVideo && Platform.OS === "web" ? (
          <View className="relative min-h-[280px] w-full md:min-h-[340px]">
            <iframe
              src={parsedVideo.embedUrl}
              title={`${campaign.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderWidth: 0,
              }}
            />
            {campaign.status === "funded" ? (
              <View className="absolute right-3.5 top-3.5 rounded-full border-2 border-retro-ink bg-retro-mint px-3 py-1">
                <Text className="font-retro-bold text-[12px] text-retro-paper">
                  Fully Funded
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <CampaignImage image={activeImage} className="min-h-[280px] md:min-h-[340px]">
            <Pressable
              onPress={parsedVideo ? openExternalVideo : undefined}
              disabled={!parsedVideo}
              className="absolute inset-0 items-center justify-center bg-black/15"
            >
              <View className="h-16 w-16 items-center justify-center rounded-full border-[3px] border-retro-ink bg-retro-paper/95 shadow-[3px_3px_0_#211E1A]">
                <Play size={28} color="#211E1A" fill="#211E1A" />
              </View>
            </Pressable>
            {campaign.status === "funded" ? (
              <View className="absolute right-3.5 top-3.5 rounded-full border-2 border-retro-ink bg-retro-mint px-3 py-1">
                <Text className="font-retro-bold text-[12px] text-retro-paper">
                  Fully Funded
                </Text>
              </View>
            ) : null}
          </CampaignImage>
        )}
      </View>

      {!parsedVideo && galleryImages.length > 1 ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {galleryImages.map((uri, index) => (
            <Pressable
              key={`${uri}-${index}`}
              onPress={() => setSelectedIndex(index)}
              className={cn(
                "h-14 w-20 overflow-hidden rounded-lg border-2",
                index === activeIndex
                  ? "border-retro-ink"
                  : "border-retro-ink/40",
              )}
            >
              <CampaignImage image={uri} className="h-full w-full" />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

interface CampaignPhotoGridProps {
  campaign: Campaign;
}

/** Always 2×2 — real images first, indigo placeholder boxes for the rest. */
export function CampaignPhotoGrid({ campaign }: CampaignPhotoGridProps) {
  const images = getCampaignImages(campaign);
  const filled = images.slice(0, 4);

  const cells: (string | null)[] = Array.from({ length: 4 }, (_, i) =>
    filled[i] ?? null,
  );

  return (
    <View className="flex-row flex-wrap gap-4">
      {cells.map((uri, index) => (
        <View
          key={uri ? `${uri}-${index}` : `placeholder-${index}`}
          className="overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-indigo shadow-[5px_5px_0_#211E1A]"
          style={{
            flexGrow: 1,
            flexBasis: "45%",
            maxWidth: "48.5%",
            minHeight: 160,
          }}
        >
          {uri ? (
            <CampaignImage image={uri} className="h-40 w-full md:h-52" />
          ) : (
            <View className="h-40 w-full items-center justify-center md:h-52">
              <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-paper">
                <Text className="font-retro-bold text-xl text-retro-ink">+</Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
