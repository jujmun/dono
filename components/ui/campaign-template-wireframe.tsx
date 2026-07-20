import { View } from "react-native";
import type { CampaignHeroLayout } from "@/lib/campaign-templates";

type WireframeRow =
  | { kind: "full"; height: number }
  | { kind: "ledger"; height: number }
  | { kind: "mediaSidebar"; height: number }
  | { kind: "split"; height: number }
  | { kind: "gallery"; height: number };

/** One row layout per CampaignHeroLayout — this is what makes each template's
 * wireframe structurally distinct, matching the section order it actually
 * renders (lib/campaign-templates.ts, CampaignPreview, app/campaigns/[id].tsx). */
const ROWS: Record<CampaignHeroLayout, WireframeRow[]> = {
  "media-first": [
    { kind: "mediaSidebar", height: 34 },
    { kind: "split", height: 22 },
    { kind: "gallery", height: 12 },
  ],
  "text-first": [
    { kind: "full", height: 16 },
    { kind: "mediaSidebar", height: 30 },
    { kind: "full", height: 14 },
    { kind: "gallery", height: 10 },
  ],
  "gallery-grid": [
    { kind: "mediaSidebar", height: 26 },
    { kind: "gallery", height: 26 },
    { kind: "split", height: 16 },
  ],
  "ledger-first": [
    { kind: "ledger", height: 24 },
    { kind: "mediaSidebar", height: 26 },
    { kind: "full", height: 14 },
    { kind: "gallery", height: 10 },
  ],
};

function NeutralBox({ height }: { height: number }) {
  return (
    <View
      className="rounded-[3px] border border-retro-ink/25"
      style={{ height, flexGrow: 1, flexBasis: 0, backgroundColor: "#211E1A1A" }}
    />
  );
}

function MediaSidebarRow({ height, accentHex }: { height: number; accentHex: string }) {
  return (
    <View className="flex-row gap-1.5" style={{ height }}>
      <View
        className="rounded-[3px]"
        style={{ flexGrow: 62, flexBasis: 0, backgroundColor: accentHex, opacity: 0.5 }}
      />
      <View className="justify-center gap-1" style={{ flexGrow: 34, flexBasis: 0 }}>
        <View className="h-1.5 w-3/4 rounded-full bg-retro-ink/20" />
        <View
          className="h-2.5 w-full rounded-full"
          style={{ backgroundColor: accentHex }}
        />
      </View>
    </View>
  );
}

function SplitRow({ height }: { height: number }) {
  return (
    <View className="flex-row gap-1.5" style={{ height }}>
      <NeutralBox height={height} />
      <NeutralBox height={height} />
    </View>
  );
}

function GalleryRow({ height, accentHex }: { height: number; accentHex: string }) {
  return (
    <View className="flex-row gap-1" style={{ height }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View
          key={i}
          className="rounded-[3px]"
          style={{ flexGrow: 1, flexBasis: 0, backgroundColor: accentHex, opacity: 0.3 + (i % 2) * 0.15 }}
        />
      ))}
    </View>
  );
}

function LedgerRow({ height, accentHex }: { height: number; accentHex: string }) {
  return (
    <View
      className="justify-center gap-1 rounded-[3px] border border-retro-ink/25 px-1.5"
      style={{ height, backgroundColor: "#211E1A0D" }}
    >
      <View className="h-[3px] w-full rounded-full bg-retro-ink/20" />
      <View className="h-[3px] w-5/6 rounded-full bg-retro-ink/20" />
      <View className="h-[3px] w-full rounded-full" style={{ backgroundColor: accentHex, opacity: 0.7 }} />
    </View>
  );
}

interface CampaignTemplateWireframeProps {
  heroLayout: CampaignHeroLayout;
  accentHex: string;
  className?: string;
}

/** Low-fidelity structural preview of a template's section order — no photos,
 * just boxes standing in for header / media / text / CTA / gallery. */
export function CampaignTemplateWireframe({
  heroLayout,
  accentHex,
  className,
}: CampaignTemplateWireframeProps) {
  const rows = ROWS[heroLayout];
  return (
    <View className={className}>
      <View className="mb-1.5 h-[6px] w-1/2 rounded-full bg-retro-ink/25" />
      <View className="gap-1.5">
        {rows.map((row, index) => {
          switch (row.kind) {
            case "mediaSidebar":
              return <MediaSidebarRow key={index} height={row.height} accentHex={accentHex} />;
            case "split":
              return <SplitRow key={index} height={row.height} />;
            case "gallery":
              return <GalleryRow key={index} height={row.height} accentHex={accentHex} />;
            case "ledger":
              return <LedgerRow key={index} height={row.height} accentHex={accentHex} />;
            case "full":
              return (
                <View
                  key={index}
                  className="rounded-[3px] bg-retro-ink/10"
                  style={{ height: row.height }}
                />
              );
            default:
              return null;
          }
        })}
      </View>
    </View>
  );
}
