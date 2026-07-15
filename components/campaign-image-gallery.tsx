import { useState } from "react";
import { View, Pressable, Image, ScrollView } from "react-native";
import { CampaignImage } from "@/components/ui/campaign-image";
import { cn } from "@/lib/utils";
import { getCampaignImages, isCampaignPhotoSource } from "@/lib/campaign-images";

interface CampaignImageGalleryProps {
  image?: string;
  images?: string[];
  category: string;
  className?: string;
  heroClassName?: string;
  children?: React.ReactNode;
}

function GalleryThumbnail({
  uri,
  selected,
  onPress,
  label,
}: {
  uri: string;
  selected: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "overflow-hidden rounded-lg border-2",
        selected ? "border-dono-primary" : "border-dono-border",
      )}
    >
      {isCampaignPhotoSource(uri) ? (
        <Image
          source={{ uri }}
          style={{ width: 72, height: 48 }}
          resizeMode="cover"
          accessibilityLabel={label}
        />
      ) : (
        <CampaignImage image={uri} className="h-12 w-[72px]" />
      )}
    </Pressable>
  );
}

export function CampaignImageGallery({
  image,
  images: imagesProp,
  category,
  className,
  heroClassName = "h-56 rounded-2xl",
  children,
}: CampaignImageGalleryProps) {
  const galleryImages = (() => {
    if (imagesProp?.length) {
      return imagesProp;
    }
    const fromCampaign = getCampaignImages({
      image: image ?? "default",
      images: imagesProp,
      category,
    });
    if (fromCampaign.length > 0) {
      return fromCampaign;
    }
    return [category || "default"];
  })();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeIndex = Math.min(selectedIndex, galleryImages.length - 1);
  const activeImage = galleryImages[activeIndex];

  return (
    <View className={className}>
      <CampaignImage image={activeImage} className={heroClassName}>
        {children}
      </CampaignImage>

      {galleryImages.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerClassName="gap-2"
        >
          {galleryImages.map((uri, index) => (
            <GalleryThumbnail
              key={`${uri}-${index}`}
              uri={uri}
              selected={index === activeIndex}
              onPress={() => setSelectedIndex(index)}
              label={`Campaign image ${index + 1}`}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}
