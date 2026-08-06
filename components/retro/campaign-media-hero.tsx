import { useEffect, useState } from "react";
import { View, Pressable, Text, Platform, Linking } from "react-native";
import { ChevronLeft, ChevronRight, Play } from "lucide-react-native";
import { CampaignImage } from "@/components/ui/campaign-image";
import {
  getCampaignImages,
  getPrimaryCampaignImage,
  CAMPAIGN_IMAGE_ASPECT,
} from "@/lib/campaign-images";
import { parseCampaignVideoUrl } from "@/lib/video-url";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { RetroPanelAccent } from "./retro-panel";

const accentFrameClasses: Record<RetroPanelAccent, string> = {
  coral: "bg-retro-coral",
  marigold: "bg-retro-marigold",
  sky: "bg-retro-sky",
  mint: "bg-retro-mint",
  pink: "bg-retro-pink",
  indigo: "bg-retro-indigo",
};

const AUTO_ADVANCE_MS = 5000;

/** Landscape hero — same ratio as create-flow crop (`CAMPAIGN_IMAGE_ASPECT`). */
const HERO_FRAME_STYLE = { aspectRatio: CAMPAIGN_IMAGE_ASPECT } as const;

interface CampaignMediaHeroProps {
  campaign: Campaign;
  className?: string;
  /** Campaign template accent — defaults to indigo (the original hardcoded look). */
  accent?: RetroPanelAccent;
  /** Pin main frame to this height (legacy fill mode — prefer fixed aspect). */
  matchHeight?: number;
  /** When true, omits outer chrome so a parent card can wrap media + chat as one unit. */
  embedded?: boolean;
  /** When true, fills a flex parent instead of using the default 16:9 aspect ratio. */
  compact?: boolean;
  /** Smaller hero for campaign detail pages with updates below. */
  size?: "default" | "detail";
  /** Where overlay thumbnails sit — `start` keeps them clear of a right-side donate float. */
  thumbnailsAlign?: "start" | "end";
}

export function CampaignMediaHero({
  campaign,
  className,
  accent = "indigo",
  matchHeight,
  embedded = false,
  compact = false,
  size = "default",
  thumbnailsAlign,
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
  const imageCount = galleryImages.length;
  const canBrowseImages = !parsedVideo && imageCount > 1;

  useEffect(() => {
    if (!canBrowseImages) return;
    const timer = setInterval(() => {
      setSelectedIndex((current) => (current + 1) % imageCount);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [canBrowseImages, imageCount, activeIndex]);

  const goToPrev = () => {
    setSelectedIndex((current) => (current - 1 + imageCount) % imageCount);
  };

  const goToNext = () => {
    setSelectedIndex((current) => (current + 1) % imageCount);
  };

  const openExternalVideo = () => {
    if (!parsedVideo) return;
    void Linking.openURL(parsedVideo.watchUrl);
  };

  const fillParent = matchHeight != null || compact;
  const frameStyle = fillParent ? undefined : HERO_FRAME_STYLE;
  const frameClassName = fillParent ? "h-full w-full" : "w-full";
  // Overlay thumbs whenever the frame height is locked (parent fill OR aspect).
  const overlayThumbnails = fillParent || embedded;
  // Embedded heroes default to start so thumbs clear a floating donate card.
  const thumbsAlign = thumbnailsAlign ?? (embedded ? "start" : "end");

  const navArrows = canBrowseImages ? (
    <>
      <Pressable
        onPress={goToPrev}
        accessibilityLabel="Previous photo"
        accessibilityRole="button"
        className="absolute bottom-0 left-2 top-0 z-10 w-10 items-center justify-center"
      >
        <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-white/70 bg-black/40">
          <ChevronLeft size={22} color="#FFF9EF" strokeWidth={2.5} />
        </View>
      </Pressable>
      <Pressable
        onPress={goToNext}
        accessibilityLabel="Next photo"
        accessibilityRole="button"
        className="absolute bottom-0 right-2 top-0 z-10 w-10 items-center justify-center"
      >
        <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-white/70 bg-black/40">
          <ChevronRight size={22} color="#FFF9EF" strokeWidth={2.5} />
        </View>
      </Pressable>
    </>
  ) : null;

  const thumbnailStrip = canBrowseImages ? (
    <View
      className={cn(
        "flex-row flex-wrap gap-2",
        overlayThumbnails
          ? cn(
              "absolute left-3",
              // Start = clear of floating donate (top-right) and bottom ombre updates.
              thumbsAlign === "start"
                ? "top-3 justify-start"
                : "bottom-3 right-3 justify-end",
            )
          : "mt-3",
      )}
    >
      {galleryImages.map((uri, index) => (
        <Pressable
          key={`${uri}-${index}`}
          onPress={() => setSelectedIndex(index)}
          className={cn(
            "h-14 w-20 overflow-hidden rounded-lg border-2",
            index === activeIndex
              ? "border-retro-ink"
              : "border-retro-ink/40",
            overlayThumbnails && "border-retro-paper",
          )}
        >
          <CampaignImage image={uri} className="h-full w-full" />
        </Pressable>
      ))}
    </View>
  ) : null;

  return (
    <View
      className={cn(
        compact && "h-full",
        size === "detail" && "w-full max-w-sm",
        className,
      )}
    >
      <View
        className={cn(
          "relative overflow-hidden",
          compact && "h-full",
          embedded
            ? accentFrameClasses[accent]
            : "rounded-[14px] border-[3px] border-retro-ink",
          !embedded && accentFrameClasses[accent],
        )}
        style={matchHeight ? { height: matchHeight, width: "100%" } : undefined}
      >
        {parsedVideo && Platform.OS === "web" ? (
          <View className={cn("relative", frameClassName)} style={frameStyle}>
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
          <CampaignImage
            image={activeImage}
            className={frameClassName}
            style={frameStyle}
          >
            {parsedVideo ? (
              <Pressable
                onPress={openExternalVideo}
                className="absolute inset-0 items-center justify-center bg-black/15"
              >
                <View className="h-16 w-16 items-center justify-center rounded-full border-[3px] border-retro-ink bg-retro-paper/95">
                  <Play size={28} color="#211E1A" fill="#211E1A" />
                </View>
              </Pressable>
            ) : null}
            {campaign.status === "funded" ? (
              <View className="absolute right-3.5 top-3.5 rounded-full border-2 border-retro-ink bg-retro-mint px-3 py-1">
                <Text className="font-retro-bold text-[12px] text-retro-paper">
                  Fully Funded
                </Text>
              </View>
            ) : null}
          </CampaignImage>
        )}
        {navArrows}
        {overlayThumbnails ? thumbnailStrip : null}
      </View>

      {!overlayThumbnails ? thumbnailStrip : null}
    </View>
  );
}

interface CampaignPhotoGridProps {
  campaign: Campaign;
  /** Campaign template accent — defaults to indigo (the original hardcoded look). */
  accent?: RetroPanelAccent;
}

/** Responsive wrap-grid of every uploaded photo (1 to MAX_CAMPAIGN_IMAGES — no fixed cell count). */
export function CampaignPhotoGrid({ campaign, accent = "indigo" }: CampaignPhotoGridProps) {
  const images = getCampaignImages(campaign);
  if (images.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-4">
      {images.map((uri, index) => (
        <View
          key={`${uri}-${index}`}
          className={cn(
            "overflow-hidden rounded-[14px] border-[3px] border-retro-ink",
            accentFrameClasses[accent],
          )}
          style={{
            flexGrow: 1,
            flexBasis: "45%",
            maxWidth: "48.5%",
            minHeight: 160,
          }}
        >
          <CampaignImage image={uri} className="h-40 w-full md:h-52" />
        </View>
      ))}
    </View>
  );
}
