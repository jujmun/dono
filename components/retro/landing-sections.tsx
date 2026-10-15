import { Link } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Platform,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { ArrowRight, Eye, HandCoins, ListChecks } from "lucide-react-native";
import { RetroPanel } from "./retro-panel";
import { RetroDinoHero } from "./retro-dino-hero";
import { SampleCampaignZoom } from "./sample-campaign-zoom";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import { ReceiptDivider, ReceiptLedger, ReceiptLineRow } from "@/components/ui/receipt-lines";
import { formatCurrency } from "@/lib/constants";
import { canCreate } from "@/lib/auth/user-type";
import { retroKeyClass, retroKeyMintClass } from "@/lib/retro-key";
import type { Campaign } from "@/lib/types";

type ProfileLike = { userType?: string | null; college?: string | null } | null | undefined;

export type LandingStoryBadges = {
  matched?: boolean;
  matchMultiplier?: number;
  collegeMatch?: boolean;
};

function HeroCampaignButtons({ profile }: { profile: ProfileLike }) {
  return (
    <>
      <Link href="/campaigns" asChild>
        <Pressable
          className={`${retroKeyClass} ${retroKeyMintClass} flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-mint px-6 py-3`}
          accessibilityRole="button"
          accessibilityLabel="Find a campaign to support"
        >
          <Text className="font-retro-bold text-sm text-retro-paper">
            Find a Campaign
          </Text>
          <ArrowRight size={16} color="#F7F3E8" />
        </Pressable>
      </Link>
      {canCreate(profile) ? (
        <Link href="/create" asChild>
          <Pressable
            className={`${retroKeyClass} flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper px-6 py-3`}
            accessibilityRole="button"
            accessibilityLabel="Start a campaign"
          >
            <Text className="font-retro-bold text-sm text-retro-ink">
              Start a Campaign
            </Text>
          </Pressable>
        </Link>
      ) : (
        <Link href="/signup" asChild>
          <Pressable
            className={`${retroKeyClass} flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper px-6 py-3`}
            accessibilityRole="button"
            accessibilityLabel="Sign up to start a campaign"
          >
            <Text className="font-retro-bold text-sm text-retro-ink">
              Sign up to create
            </Text>
          </Pressable>
        </Link>
      )}
    </>
  );
}

export function LandingTrustStrip({
  totalRaised,
  campaignCount,
}: {
  totalRaised: number;
  campaignCount: number;
}) {
  return (
    <View className="mb-16">
      <ReceiptLedger className="mx-auto max-w-lg">
        <ReceiptLineRow label="Given on Dono" amount={totalRaised} />
        <ReceiptDivider />
        <ReceiptLineRow
          label="Campaigns live"
          amount={campaignCount.toString()}
        />
        <ReceiptDivider />
        <ReceiptLineRow label="Fees" amount="Shown at checkout" muted />
      </ReceiptLedger>
      <Text className="mt-2 text-center font-retro-mono text-xs text-dono-muted">
        {formatCurrency(totalRaised)} raised across {campaignCount} campaigns ·
        Oxford-first
      </Text>
    </View>
  );
}

const HOW_STEPS = [
  {
    n: "01",
    title: "Find a campaign to support",
    body: "Browse campaigns from students and societies, each with an itemised budget so you know what you’re funding.",
  },
  {
    n: "02",
    title: "Give what you can",
    body: "Small gifts add up. Suggested amounts keep it easy; you choose how public your name and amount are.",
  },
  {
    n: "03",
    title: "See where it went",
    body: "Follow updates and closure statements. Every donation deserves a visible outcome.",
  },
] as const;

function HowStepCopy({ step }: { step: (typeof HOW_STEPS)[number] }) {
  return (
    <View className="flex-row items-start">
      <Text className="font-retro-display text-3xl leading-none text-retro-ink">
        {String(Number(step.n))}
      </Text>
      <View className="ml-3 flex-1">
        <Text className="font-retro-display text-xl leading-tight text-retro-ink">
          {step.title}
        </Text>
        <Text className="mt-1 text-[15px] leading-6 text-dono-muted">{step.body}</Text>
      </View>
    </View>
  );
}

export function LandingHowItWorks() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  return (
    <View className="mb-16">
      <View className={isWide ? "flex-row items-start gap-6" : "gap-6"}>
        {HOW_STEPS.map((step) => (
          <View key={step.n} className={isWide ? "flex-1" : ""}>
            <HowStepCopy step={step} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function LandingAudienceSplit({
  profile,
  embedded = false,
  focus,
}: {
  profile: ProfileLike;
  embedded?: boolean;
  focus?: "alumni" | "students";
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768 && !focus;
  const showAlumni = focus !== "students";
  const showStudents = focus !== "alumni";

  return (
    <View
      className={`${embedded ? "" : "mb-16"} ${isWide ? "flex-row gap-5" : "gap-5"} ${
        focus ? "mx-auto w-full max-w-lg" : ""
      }`}
    >
      {showAlumni ? (
        <View
          className={`rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-6 ${
            isWide ? "flex-1" : ""
          }`}
        >
          <Text className="mb-1 font-retro-mono text-xs uppercase text-dono-muted">
            For alumni & donors
          </Text>
          <Text className="mb-3 font-retro-display text-xl text-retro-ink">
            Support something you can point to
          </Text>
          <Text className="mb-5 text-[15px] leading-6 text-dono-muted">
            Skip opaque institutional funds. Back a specific boat, trip, kit list
            or event, and follow the outcome.
          </Text>
          <Link href="/campaigns" asChild>
            <Pressable
              className={`${retroKeyClass} ${retroKeyMintClass} self-start rounded-full border-2 border-retro-ink bg-retro-mint px-5 py-2.5`}
            >
              <Text className="font-retro-bold text-sm text-retro-paper">
                Browse campaigns
              </Text>
            </Pressable>
          </Link>
        </View>
      ) : null}

      {showStudents ? (
        <View
          className={`rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-6 ${
            isWide ? "flex-1" : ""
          }`}
        >
          <Text className="mb-1 font-retro-mono text-xs uppercase text-dono-muted">
            For students & societies
          </Text>
          <Text className="mb-3 font-retro-display text-xl text-retro-ink">
            Fund the gap traditional grants miss
          </Text>
          <Text className="mb-5 text-[15px] leading-6 text-dono-muted">
            Conference travel, kit, events, welfare: campaigns with clear
            budgets, verified Oxford identities, and alumni who want to help.
          </Text>
          <Link href={canCreate(profile) ? "/create" : "/signup"} asChild>
            <Pressable
              className={`${retroKeyClass} self-start rounded-full border-2 border-retro-ink bg-retro-paper px-5 py-2.5`}
            >
              <Text className="font-retro-bold text-sm text-retro-ink">
                {canCreate(profile) ? "Start a campaign" : "Create an account"}
              </Text>
            </Pressable>
          </Link>
        </View>
      ) : null}
    </View>
  );
}

const WHY_ITEMS = [
  {
    icon: Eye,
    title: "Visible, specific giving",
    body: "Itemised budgets and updates replace the black box of traditional alumni appeals.",
  },
  {
    icon: ListChecks,
    title: "Built for communities",
    body: "Colleges, societies and departments, not a global popularity contest.",
  },
  {
    icon: HandCoins,
    title: "Optimised for £10-£50 gifts",
    body: "Young alumni give smaller and more often. Dono is designed for that, not major-donor telethons.",
  },
] as const;

export function LandingWhyDono({
  embedded = false,
  itemIndex,
}: {
  embedded?: boolean;
  itemIndex?: number;
} = {}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900 && itemIndex === undefined;
  const items =
    itemIndex === undefined
      ? WHY_ITEMS
      : WHY_ITEMS[itemIndex]
        ? [WHY_ITEMS[itemIndex]]
        : [];

  return (
    <View className={embedded ? "" : "mb-16"}>
      {itemIndex === undefined || itemIndex === 0 ? (
        <View className="mb-6 items-center">
          <Text className="font-retro-display text-2xl text-retro-ink">
            Why Dono
          </Text>
          <Text className="mt-1 max-w-lg text-center text-dono-muted">
            People don’t dislike giving. They dislike giving without knowing what
            difference they made.
          </Text>
        </View>
      ) : (
        <Text className="mb-6 text-center font-retro-mono text-xs uppercase tracking-wide text-dono-muted">
          Why Dono
        </Text>
      )}
      <View className={isWide ? "flex-row gap-4" : "mx-auto w-full max-w-lg gap-4"}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <View
              key={item.title}
              className={`rounded-[14px] border-[3px] border-retro-ink bg-retro-cream px-5 py-5 ${
                isWide ? "flex-1" : ""
              }`}
            >
              <View className="mb-3 h-10 w-10 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-paper">
                <Icon size={18} color="#211E1A" />
              </View>
              <Text className="mb-2 font-retro-display text-base text-retro-ink">
                {item.title}
              </Text>
              <Text className="text-[14px] leading-6 text-dono-muted">
                {item.body}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function LandingFinalCta({ profile }: { profile: ProfileLike }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  return (
    <RetroPanel title="Ready" accent="coral" className="mb-0">
      <Text className="text-center font-retro-display text-2xl text-retro-ink">
        Ready to make a difference?
      </Text>
      <Text className="mx-auto mt-3 max-w-lg text-center text-dono-muted">
        Join students and alumni funding tangible improvements to university
        life, and see exactly what your gift did.
      </Text>

      <View
        className={
          isWide
            ? "mx-auto mt-8 flex-row justify-center gap-3"
            : "mt-8 gap-3"
        }
      >
        <Link href="/campaigns" asChild>
          <Pressable
            className={`${retroKeyClass} ${retroKeyMintClass} flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-mint px-6 py-3 ${
              isWide ? "" : "w-full"
            }`}
          >
            <Text className="font-retro-bold text-sm text-retro-paper">
              Find a Campaign
            </Text>
            <ArrowRight size={16} color="#F7F3E8" />
          </Pressable>
        </Link>
        {canCreate(profile) ? (
          <Link href="/create" asChild>
            <Pressable
              className={`${retroKeyClass} flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper px-6 py-3 ${
                isWide ? "" : "w-full"
              }`}
            >
              <Text className="font-retro-bold text-sm text-retro-ink">
                Start a Campaign
              </Text>
            </Pressable>
          </Link>
        ) : null}
      </View>
    </RetroPanel>
  );
}

function findScrollParent(node: HTMLElement): HTMLElement | null {
  let el = node.parentElement;
  while (el) {
    const overflow = getComputedStyle(el).overflowY;
    if (overflow === "auto" || overflow === "scroll") return el;
    el = el.parentElement;
  }
  return null;
}

/**
 * The current beat stays put for the first half of the step. The fade runs
 * only across the second half, so the second scroll is the one that changes it.
 */
function beatOpacity(pos: number, index: number) {
  const t = pos - index;
  if (t >= 0 && t <= 0.5) return 1;
  if (t > 0.5 && t < 1) return 1 - (t - 0.5) / 0.5;
  if (t >= -0.5 && t < 0) return (t + 0.5) / 0.5;
  return 0;
}

function frameOpacity(progress: number, index: number, count: number) {
  if (count <= 1) return index === 0 ? 1 : 0;
  return beatOpacity(progress * (count - 1), index);
}

/** How-steps stay fully visible across their beats, and only fade at the edges of the sequence. */
function sequenceOpacity(progress: number, count: number, indices: number[]) {
  if (indices.length === 0) return 0;
  if (count <= 1) return 1;
  const pos = progress * (count - 1);
  const first = indices[0] ?? 0;
  const last = indices[indices.length - 1] ?? first;
  if (pos >= first && pos <= last + 0.5) return 1;
  if (pos > last + 0.5 && pos < last + 1) return 1 - (pos - last - 0.5) / 0.5;
  if (pos < first && pos > first - 0.5) return (pos - (first - 0.5)) / 0.5;
  return 0;
}

/** Each later step fades in on the second half of the scroll into that step. */
function howStepOpacity(progress: number, count: number, indices: number[], stepIndex: number) {
  if (indices.length === 0) return 0;
  if (stepIndex <= 0) return 1;
  const pos = progress * Math.max(count - 1, 1);
  const first = indices[0] ?? 0;
  const introEnd = first + stepIndex;
  const introStart = introEnd - 0.5;
  if (pos <= introStart) return 0;
  if (pos >= introEnd) return 1;
  return (pos - introStart) / 0.5;
}

type StoryFrame = { key: string; node: ReactNode; sequence?: string };

function CampaignBeat({
  title,
  subtitle,
  campaigns,
  getBadges,
  loading,
}: {
  title: string;
  subtitle?: string;
  campaigns: Campaign[];
  getBadges: (campaign: Campaign) => LandingStoryBadges;
  loading?: boolean;
}) {
  return (
    <View>
      <View className="mb-3 items-center">
        <Text className="text-center font-retro-display text-2xl text-retro-ink">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1 text-center text-dono-muted">{subtitle}</Text>
        ) : null}
      </View>
      {loading ? (
        <ActivityIndicator color="#211E1A" />
      ) : (
        <CampaignCardGrid
          campaigns={campaigns}
          featured
          compact
          columns={campaigns.length > 1 ? 3 : 1}
          getBadges={getBadges}
        />
      )}
    </View>
  );
}

function buildStoryFrames({
  profile,
  isWide,
  nearGoal,
  forYou,
  getBadges,
}: {
  profile: ProfileLike;
  isWide: boolean;
  nearGoal: Campaign[];
  forYou: Campaign[];
  getBadges: (campaign: Campaign) => LandingStoryBadges;
}): StoryFrame[] {
  const frames: StoryFrame[] = [
    {
      key: "hero",
      node: (
        <View>
          <RetroDinoHero
            embedded
            actions={<HeroCampaignButtons profile={profile} />}
          />
        </View>
      ),
    },
    { key: "how-01", sequence: "how", node: null },
    { key: "how-02", sequence: "how", node: null },
    { key: "how-03", sequence: "how", node: null },
  ];

  if (isWide) {
    frames.push({
      key: "audience",
      node: <LandingAudienceSplit profile={profile} embedded />,
    });
    frames.push({ key: "why", node: <LandingWhyDono embedded /> });
  } else {
    frames.push({
      key: "audience-alumni",
      node: <LandingAudienceSplit profile={profile} embedded focus="alumni" />,
    });
    frames.push({
      key: "audience-students",
      node: <LandingAudienceSplit profile={profile} embedded focus="students" />,
    });
    WHY_ITEMS.forEach((_, index) => {
      frames.push({
        key: `why-${index}`,
        node: <LandingWhyDono embedded itemIndex={index} />,
      });
    });
  }

  const pushCampaigns = (
    key: string,
    title: string,
    subtitle: string | undefined,
    campaigns: Campaign[],
    loading = false,
  ) => {
    if (!loading && campaigns.length === 0) return;
    if (isWide || loading) {
      frames.push({
        key,
        node: (
          <CampaignBeat
            title={title}
            subtitle={subtitle}
            campaigns={campaigns}
            getBadges={getBadges}
            loading={loading}
          />
        ),
      });
      return;
    }
    campaigns.forEach((campaign, index) => {
      frames.push({
        key: `${key}-${campaign.id}`,
        node: (
          <CampaignBeat
            title={title}
            subtitle={index === 0 ? subtitle : undefined}
            campaigns={[campaign]}
            getBadges={getBadges}
          />
        ),
      });
    });
  };

  pushCampaigns(
    "near",
    "Almost there",
    "Campaigns close to their goal. Your gift can tip them over.",
    nearGoal,
  );
  pushCampaigns(
    "college",
    "From your college",
    profile?.college ? `Campaigns connected to ${profile.college}` : undefined,
    forYou,
  );

  frames.push({
    key: "ready",
    node: <LandingFinalCta profile={profile} />,
  });

  return frames;
}

/**
 * Pins the whole homepage. Two scroll gestures move one beat; the fade runs
 * on the second. How Dono works keeps earlier steps and adds the next one.
 * The last beat is Ready; once it finishes, the pin releases into the site footer.
 */
export function LandingScrollStory({
  profile,
  trending,
  nearGoal,
  forYou,
  getBadges,
  trendingLoading,
}: {
  profile: ProfileLike;
  trending: Campaign[] | undefined;
  nearGoal: Campaign[];
  forYou: Campaign[];
  getBadges: (campaign: Campaign) => LandingStoryBadges;
  trendingLoading: boolean;
}) {
  const { height: windowHeight, width } = useWindowDimensions();
  const isWide = width >= 900;
  const [panelHeight, setPanelHeight] = useState(Math.max(420, windowHeight - 8));
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || reducedMotion) return;
    const node = document.getElementById("landing-scroll-story");
    if (!node) return;

    const scroller = findScrollParent(node);
    let scheduled = false;
    let raf = 0;
    let fallback = 0;

    const update = () => {
      const scrollerHeight = scroller?.clientHeight ?? window.innerHeight;
      const scrollerTop = scroller?.getBoundingClientRect().top ?? 0;
      const measured = Math.max(420, scrollerHeight);
      setPanelHeight((current) =>
        Math.abs(current - measured) < 2 ? current : measured,
      );

      const travelled = scrollerTop - node.getBoundingClientRect().top;
      const max = Math.max(1, node.offsetHeight - scrollerHeight);
      const next = Math.min(1, Math.max(0, travelled / max));
      setProgress((current) =>
        Math.abs(current - next) < 0.004 ? current : next,
      );
    };

    const run = () => {
      scheduled = false;
      if (raf) cancelAnimationFrame(raf);
      if (fallback) window.clearTimeout(fallback);
      raf = 0;
      fallback = 0;
      update();
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      raf = requestAnimationFrame(run);
      fallback = window.setTimeout(run, 32);
    };

    const target: HTMLElement | Window = scroller ?? window;
    target.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    const wheelTarget = scroller ?? document.documentElement;
    let coolUntil = 0;
    let animTimer = 0;
    let animTarget = wheelTarget.scrollTop;

    const liveStory = () => document.getElementById("landing-scroll-story") ?? node;
    const liveScroller = () => findScrollParent(liveStory()) ?? wheelTarget;

    const storyRange = () => {
      const storyNode = liveStory();
      const scrollerNode = liveScroller();
      const scrollerTop = scrollerNode.getBoundingClientRect().top;
      const start =
        scrollerNode.scrollTop + storyNode.getBoundingClientRect().top - scrollerTop;
      const end = start + storyNode.offsetHeight - scrollerNode.clientHeight;
      const beats = Math.max(
        1,
        Math.round(storyNode.offsetHeight / Math.max(1, scrollerNode.clientHeight)) - 1,
      );
      return { scrollerNode, start, end, half: (end - start) / beats / 2 };
    };

    const animateTo = (dest: number, scrollerNode: HTMLElement) => {
      animTarget = dest;
      const from = scrollerNode.scrollTop;
      const duration = 320;
      const t0 = performance.now();
      if (animTimer) window.clearInterval(animTimer);
      animTimer = window.setInterval(() => {
        const t = Math.min(1, (performance.now() - t0) / duration);
        const eased = 1 - (1 - t) ** 3;
        scrollerNode.scrollTop = from + (dest - from) * eased;
        update();
        if (t >= 1) {
          window.clearInterval(animTimer);
          animTimer = 0;
          scrollerNode.scrollTop = dest;
          update();
        }
      }, 16);
    };

    const onWheel = (event: WheelEvent) => {
      const { scrollerNode, start, end, half } = storyRange();
      if (end - start < 2 || half < 1) return;
      const y = animTimer ? animTarget : scrollerNode.scrollTop;
      const pixels = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      const goingDown = pixels > 0;
      const inside =
        (goingDown && y >= start - 1 && y < end - 1) ||
        (!goingDown && y > start + 1 && y <= end + 1);
      if (!inside || pixels === 0) return;

      event.preventDefault();
      const now = performance.now();
      if (now < coolUntil) return;
      if (Math.abs(pixels) < 8) return;

      coolUntil = now + 280;
      const direction = Math.sign(pixels);
      const snapped = start + Math.round((y + direction * half - start) / half) * half;
      animateTo(Math.min(end, Math.max(start, snapped)), scrollerNode);
    };

    wheelTarget.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (fallback) window.clearTimeout(fallback);
      if (animTimer) window.clearInterval(animTimer);
      target.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      wheelTarget.removeEventListener("wheel", onWheel);
    };
  }, [reducedMotion]);

  const frames = buildStoryFrames({
    profile,
    isWide,
    nearGoal,
    forYou,
    getBadges,
  });

  if (Platform.OS !== "web" || reducedMotion) {
    return (
      <View>
        <RetroDinoHero actions={<HeroCampaignButtons profile={profile} />} />
        <LandingHowItWorks />
        {trendingLoading || (trending && trending.length > 0) ? (
          <View className="mb-16">
            <CampaignCardGrid
              campaigns={trending ?? []}
              featured
              compact
              columns={isWide ? 3 : 1}
              getBadges={getBadges}
            />
          </View>
        ) : null}
        <LandingAudienceSplit profile={profile} />
        <LandingWhyDono />
        {nearGoal.length > 0 ? (
          <View className="mb-16">
            <CampaignBeat
              title="Almost there"
              subtitle="Campaigns close to their goal. Your gift can tip them over."
              campaigns={nearGoal}
              getBadges={getBadges}
            />
          </View>
        ) : null}
        {forYou.length > 0 ? (
          <View className="mb-16">
            <CampaignBeat
              title="From your college"
              subtitle={
                profile?.college
                  ? `Campaigns connected to ${profile.college}`
                  : undefined
              }
              campaigns={forYou}
              getBadges={getBadges}
            />
          </View>
        ) : null}
        <LandingFinalCta profile={profile} />
      </View>
    );
  }

  const count = frames.length;
  const howIndices = frames.flatMap((frame, index) =>
    frame.sequence === "how" ? [index] : [],
  );
  const howOpacity = sequenceOpacity(progress, count, howIndices);
  const howSteps = howIndices.map((_, stepIndex) =>
    howStepOpacity(progress, count, howIndices, stepIndex),
  );

  return (
    <View
      nativeID="landing-scroll-story"
      style={{ height: panelHeight * count }}
    >
      <View
        style={{
          position: "sticky",
          top: 0,
          height: panelHeight,
          overflow: "hidden",
        }}
      >
        {frames.map((frame, index) =>
          frame.sequence ? null : (
            <View
              key={frame.key}
              pointerEvents={frameOpacity(progress, index, count) > 0.5 ? "auto" : "none"}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 40,
                left: 0,
                zIndex: 1,
                opacity: frameOpacity(progress, index, count),
                justifyContent: "center",
              }}
            >
              {frame.node}
            </View>
          ),
        )}
        {howIndices.length > 0 ? (
          <View
            pointerEvents={howOpacity > 0.5 ? "auto" : "none"}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 40,
              left: 0,
              zIndex: 1,
              opacity: howOpacity,
              justifyContent: "center",
            }}
          >
            <HowSequence
              stepOpacity={howSteps}
              storyPos={progress * Math.max(count - 1, 1)}
              howIndex={howIndices[0] ?? 0}
              enter={reducedMotion ? 1 : howOpacity}
              reducedMotion={reducedMotion}
              campaigns={trending}
              getBadges={getBadges}
              loading={trendingLoading}
            />
          </View>
        ) : null}
        <View
          className="absolute bottom-0 left-0 right-0 h-14 flex-row items-center justify-center gap-1.5"
          style={{ zIndex: 2, backgroundColor: "#FFF9EF" }}
        >
          {frames.map((frame, index) => {
            const active = Math.round(progress * (count - 1)) === index;
            return (
              <View
                key={frame.key}
                className={`h-2 rounded-full ${
                  active ? "w-6 bg-retro-ink" : "w-2 bg-retro-ink/25"
                }`}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

function smoothstep(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

const HOW_ROW_GAP = 16;
const HOW_CAMPAIGN_GAP = 20;

function HowStepCopyAnimated({
  step,
  columnWidth,
  reveal,
  offsetX,
  offsetY,
}: {
  step: (typeof HOW_STEPS)[number];
  columnWidth?: number;
  reveal: number;
  offsetX: number;
  offsetY: number;
}) {
  const shown = Math.min(1, Math.max(0, reveal));
  const transform =
    offsetX !== 0 || offsetY !== 0
      ? [{ translateX: offsetX }, { translateY: offsetY }]
      : undefined;
  return (
    <View
      style={{
        width: columnWidth ?? "100%",
        alignSelf: columnWidth ? undefined : "stretch",
        opacity: shown,
        transform,
      }}
    >
      <HowStepCopy step={step} />
    </View>
  );
}

function HowSequence({
  stepOpacity,
  storyPos,
  howIndex,
  enter,
  reducedMotion = false,
  campaigns,
  getBadges,
  loading,
}: {
  stepOpacity: number[];
  /** Scroll position in beats. 0 is the hero. */
  storyPos: number;
  /** Beat index of the first how-step. */
  howIndex: number;
  /** 0 while this step is still off-screen, 1 once it has faded in. */
  enter: number;
  reducedMotion?: boolean;
  campaigns: Campaign[] | undefined;
  getBadges: (campaign: Campaign) => LandingStoryBadges;
  loading: boolean;
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const [campaignHeight, setCampaignHeight] = useState(0);
  const cardWidth = Math.min(Math.min(width - 32, 1024) * 0.3, 384);
  const hasCampaigns = loading || (campaigns?.length ?? 0) > 0;
  const reveals = HOW_STEPS.map((_, index) =>
    index === 0 ? 1 : smoothstep(stepOpacity[index] ?? 0),
  );
  const handoff = reveals[1] ?? 0;
  const campaignOpacity = hasCampaigns ? 1 - handoff : 0;
  const frameHeight = isWide ? 400 : 240;
  const showZoom = handoff > 0.001;
  const step2 = howIndex + 1;
  const step3 = howIndex + 2;
  const along = (from: number, to: number) =>
    reducedMotion ? 0 : smoothstep((storyPos - from) / (to - from));
  const donateZoom = along(step2, step2 + 0.5) * (1 - along(step2 + 0.5, step3));
  const updatesZoom = along(step3, step3 + 0.5);
  const spotlight = updatesZoom > donateZoom ? "updates" : donateZoom > 0.001 ? "donate" : null;
  const zoom = spotlight === "updates" ? updatesZoom : donateZoom;
  const slotHeight =
    campaignHeight > 0 ? campaignHeight + (frameHeight - campaignHeight) * handoff : undefined;
  const steps = HOW_STEPS.map((step, index) => ({
    step,
    index,
    reveal: reveals[index] ?? 0,
  })).filter((item) => item.index === 0 || (stepOpacity[item.index] ?? 0) > 0.001);

  const offsetXFor = (index: number) => {
    if (!isWide) return 0;
    let shift = 0;
    for (let later = index + 1; later < HOW_STEPS.length; later += 1) {
      if ((stepOpacity[later] ?? 0) <= 0.001) continue;
      shift += ((cardWidth + HOW_ROW_GAP) / 2) * (1 - (reveals[later] ?? 0));
    }
    const slide = index === 0 ? 0 : (1 - (reveals[index] ?? 0)) * 12;
    return shift + slide;
  };

  return (
    <View className="mx-auto w-full max-w-5xl px-4">
      <View
        className={isWide ? "flex-row items-start justify-center" : ""}
        style={{ gap: isWide ? HOW_ROW_GAP : 8 }}
      >
        {steps.map(({ step, reveal, index }) => (
          <HowStepCopyAnimated
            key={step.n}
            step={step}
            columnWidth={isWide && steps.length > 1 ? cardWidth : undefined}
            reveal={reveal}
            offsetX={offsetXFor(index)}
            offsetY={!isWide && index > 0 ? (1 - reveal) * 12 : 0}
          />
        ))}
      </View>
      {campaignOpacity > 0.001 || showZoom ? (
        <View
          style={{
            marginTop: HOW_CAMPAIGN_GAP,
            height: slotHeight,
            overflow: "hidden",
          }}
        >
          {campaignOpacity > 0.001 ? (
            <View
              pointerEvents={campaignOpacity > 0.5 ? "auto" : "none"}
              onLayout={(event) => {
                const next = event.nativeEvent.layout.height;
                setCampaignHeight((current) => (Math.abs(current - next) < 1 ? current : next));
              }}
              style={{
                opacity: campaignOpacity,
                ...(campaignHeight > 0 && showZoom
                  ? { position: "absolute" as const, top: 0, left: 0, right: 0 }
                  : {}),
                ...(isWide
                  ? {}
                  : { maxHeight: 440, overflow: "hidden" as const }),
              }}
            >
              {loading ? (
                <ActivityIndicator color="#211E1A" />
              ) : (
                <CampaignCardGrid
                  campaigns={campaigns ?? []}
                  featured
                  compact
                  columns={isWide ? 3 : 1}
                  enter={enter}
                  getBadges={getBadges}
                />
              )}
            </View>
          ) : null}
          {showZoom ? (
            <View
              pointerEvents="none"
              style={{
                opacity: handoff,
                ...(campaignHeight > 0
                  ? { position: "absolute" as const, top: 0, left: 0, right: 0 }
                  : {}),
              }}
            >
              <SampleCampaignZoom
                zoom={zoom}
                spotlight={spotlight}
                frameHeight={frameHeight}
              />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
