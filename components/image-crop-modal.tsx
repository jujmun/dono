import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  PanResponder,
  ActivityIndicator,
  useWindowDimensions,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { Minus, Plus } from "lucide-react-native";
import { retroKeyClass } from "@/lib/retro-key";
import { CAMPAIGN_IMAGE_ASPECT } from "@/lib/campaign-images";

export { CAMPAIGN_IMAGE_ASPECT };

export type CropSourceImage = {
  uri: string;
  mimeType?: string | null;
  fileSize?: number | null;
  width?: number | null;
  height?: number | null;
};

export type CroppedImage = {
  uri: string;
  mimeType: string;
  fileSize?: number | null;
  width: number;
  height: number;
};

type ImageCropModalProps = {
  visible: boolean;
  image: CropSourceImage | null;
  /** 1-based index label when cropping a queue, e.g. "2 of 4". */
  progressLabel?: string;
  onCancel: () => void;
  onConfirm: (image: CroppedImage) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ImageCropModal({
  visible,
  image,
  progressLabel,
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const { width: windowWidth } = useWindowDimensions();
  const frameWidth = Math.min(windowWidth - 48, 560);
  const frameHeight = frameWidth / CAMPAIGN_IMAGE_ASPECT;

  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offsetRef = useRef(offset);
  const zoomRef = useRef(zoom);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (!visible || !image) {
      setNaturalSize(null);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setError(null);
      setSaving(false);
      return;
    }

    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setError(null);

    if (image.width && image.height) {
      const size = { width: image.width, height: image.height };
      setNaturalSize(size);
      const coverScale = Math.max(
        frameWidth / size.width,
        frameHeight / size.height,
      );
      const displayW = size.width * coverScale;
      const displayH = size.height * coverScale;
      setOffset({
        x: (frameWidth - displayW) / 2,
        y: (frameHeight - displayH) / 2,
      });
      return;
    }

    Image.getSize(
      image.uri,
      (width, height) => {
        setNaturalSize({ width, height });
        const coverScale = Math.max(frameWidth / width, frameHeight / height);
        const displayW = width * coverScale;
        const displayH = height * coverScale;
        setOffset({
          x: (frameWidth - displayW) / 2,
          y: (frameHeight - displayH) / 2,
        });
      },
      () => setError("Could not read this image. Try another photo."),
    );
  }, [visible, image, frameWidth, frameHeight]);

  const layout = useMemo(() => {
    if (!naturalSize) return null;
    const { width: imgW, height: imgH } = naturalSize;
    const coverScale = Math.max(frameWidth / imgW, frameHeight / imgH);
    const scale = coverScale * zoom;
    const displayW = imgW * scale;
    const displayH = imgH * scale;
    const minX = frameWidth - displayW;
    const minY = frameHeight - displayH;
    return { imgW, imgH, scale, displayW, displayH, minX, minY, coverScale };
  }, [naturalSize, frameWidth, frameHeight, zoom]);

  const clampOffset = useCallback(
    (x: number, y: number, nextZoom = zoom) => {
      if (!naturalSize) return { x: 0, y: 0 };
      const coverScale = Math.max(
        frameWidth / naturalSize.width,
        frameHeight / naturalSize.height,
      );
      const scale = coverScale * nextZoom;
      const displayW = naturalSize.width * scale;
      const displayH = naturalSize.height * scale;
      return {
        x: clamp(x, frameWidth - displayW, 0),
        y: clamp(y, frameHeight - displayH, 0),
      };
    },
    [naturalSize, frameWidth, frameHeight, zoom],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          dragStartRef.current = offsetRef.current;
        },
        onPanResponderMove: (
          _evt: GestureResponderEvent,
          gesture: PanResponderGestureState,
        ) => {
          const next = clampOffset(
            dragStartRef.current.x + gesture.dx,
            dragStartRef.current.y + gesture.dy,
            zoomRef.current,
          );
          setOffset(next);
        },
      }),
    [clampOffset],
  );

  const adjustZoom = (delta: number) => {
    const nextZoom = clamp(zoom + delta, 1, 3);
    setZoom(nextZoom);
    setOffset((current) => clampOffset(current.x, current.y, nextZoom));
  };

  const handleConfirm = async () => {
    if (!image || !layout || !naturalSize) return;
    setSaving(true);
    setError(null);
    try {
      const { scale, imgW, imgH } = layout;
      const originX = clamp(-offset.x / scale, 0, imgW);
      const originY = clamp(-offset.y / scale, 0, imgH);
      let cropWidth = frameWidth / scale;
      let cropHeight = frameHeight / scale;
      // Keep crop inside image bounds (floating-point safety).
      if (originX + cropWidth > imgW) cropWidth = imgW - originX;
      if (originY + cropHeight > imgH) cropHeight = imgH - originY;

      const result = await ImageManipulator.manipulateAsync(
        image.uri,
        [
          {
            crop: {
              originX: Math.round(originX),
              originY: Math.round(originY),
              width: Math.max(1, Math.round(cropWidth)),
              height: Math.max(1, Math.round(cropHeight)),
            },
          },
          // Cap upload size while keeping the campaign framing sharp.
          { resize: { width: 1600 } },
        ],
        {
          compress: 0.85,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      onConfirm({
        uri: result.uri,
        mimeType: "image/jpeg",
        width: result.width,
        height: result.height,
        fileSize: null,
      });
    } catch {
      setError("Could not crop this photo. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible && image != null}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-4">
        <View className="w-full max-w-xl rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-5">
          <Text className="font-retro-bold text-xl text-retro-ink">
            Frame your photo
          </Text>
          <Text className="mt-1 text-sm text-[#5c574f]">
            Drag to reposition, zoom to choose what shows on the campaign
            page (16:9, same as the hero photo).
            {progressLabel ? ` (${progressLabel})` : ""}
          </Text>

          <View className="mt-4 items-center">
            <View
              className="overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-ink"
              style={{ width: frameWidth, height: frameHeight }}
              {...panResponder.panHandlers}
            >
              {layout && image ? (
                <Image
                  source={{ uri: image.uri }}
                  style={{
                    position: "absolute",
                    width: layout.displayW,
                    height: layout.displayH,
                    transform: [
                      { translateX: offset.x },
                      { translateY: offset.y },
                    ],
                  }}
                  resizeMode="stretch"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <ActivityIndicator color="#FFF9EF" />
                </View>
              )}
            </View>
          </View>

          <View className="mt-4 flex-row items-center justify-center gap-3">
            <Pressable
              onPress={() => adjustZoom(-0.25)}
              disabled={!layout || zoom <= 1}
              className={`${retroKeyClass} h-10 w-10 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-cream ${
                !layout || zoom <= 1 ? "opacity-40" : ""
              }`}
              accessibilityLabel="Zoom out"
            >
              <Minus size={18} color="#211E1A" />
            </Pressable>
            <Text className="min-w-[64px] text-center font-retro-mono text-sm text-retro-ink">
              {Math.round(zoom * 100)}%
            </Text>
            <Pressable
              onPress={() => adjustZoom(0.25)}
              disabled={!layout || zoom >= 3}
              className={`${retroKeyClass} h-10 w-10 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-cream ${
                !layout || zoom >= 3 ? "opacity-40" : ""
              }`}
              accessibilityLabel="Zoom in"
            >
              <Plus size={18} color="#211E1A" />
            </Pressable>
          </View>

          {error ? (
            <Text className="mt-3 text-sm text-rose-700">{error}</Text>
          ) : null}

          <View className="mt-5 flex-row flex-wrap justify-end gap-2">
            <Pressable
              onPress={onCancel}
              disabled={saving}
              className={`${retroKeyClass} rounded-full border-2 border-retro-ink bg-retro-paper px-5 py-2.5`}
            >
              <Text className="font-retro-bold text-sm text-retro-ink">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={() => void handleConfirm()}
              disabled={saving || !layout}
              className={`${retroKeyClass} rounded-full border-2 border-retro-ink bg-retro-mint px-5 py-2.5 ${
                saving || !layout ? "opacity-50" : ""
              }`}
            >
              {saving ? (
                <ActivityIndicator color="#FFF9EF" />
              ) : (
                <Text className="font-retro-bold text-sm text-retro-paper">
                  Use photo
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
