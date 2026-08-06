import { Link } from "expo-router";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { ArrowRight, Eye, HandCoins, ListChecks } from "lucide-react-native";
import { RetroPanel } from "./retro-panel";
import { ReceiptDivider, ReceiptLedger, ReceiptLineRow } from "@/components/ui/receipt-lines";
import { formatCurrency } from "@/lib/constants";
import { canCreate } from "@/lib/auth/user-type";
import { retroKeyClass, retroKeyMintClass } from "@/lib/retro-key";

type ProfileLike = { userType?: string | null } | null | undefined;

/** Primary + secondary hero CTAs. Donor path leads; create is secondary. */
export function LandingHeroActions({
  profile,
}: {
  profile: ProfileLike;
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  return (
    <View className="mb-16 items-center">
      <Text className="mb-1 text-center font-retro-mono text-xs uppercase tracking-wide text-dono-muted">
        For Oxford students, societies & alumni
      </Text>
      <Text className="mb-2 max-w-xl text-center font-retro-bold text-2xl leading-8 text-retro-ink md:text-3xl md:leading-9">
        Fund a student project you can point to
      </Text>
      <Text className="mb-5 max-w-md text-center text-[15px] leading-6 text-dono-muted">
        Browse verified campaigns from societies and students, then follow the
        outcome.
      </Text>
      <View className={isWide ? "flex-row gap-3" : "w-full gap-3"}>
        <Link href="/campaigns" asChild>
          <Pressable
            className={`${retroKeyClass} ${retroKeyMintClass} flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-mint px-6 py-3 ${
              isWide ? "" : "w-full"
            }`}
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
              className={`${retroKeyClass} flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper px-6 py-3 ${
                isWide ? "" : "w-full"
              }`}
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
              className={`${retroKeyClass} flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper px-6 py-3 ${
                isWide ? "" : "w-full"
              }`}
              accessibilityRole="button"
              accessibilityLabel="Sign up to start a campaign"
            >
              <Text className="font-retro-bold text-sm text-retro-ink">
                Sign up to create
              </Text>
            </Pressable>
          </Link>
        )}
      </View>
    </View>
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
    title: "Pick a real project",
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

export function LandingHowItWorks() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  return (
    <View className="mb-16">
      <View className="mb-6 items-center">
        <Text className="font-retro-bold text-2xl text-retro-ink">
          How Dono works
        </Text>
        <Text className="mt-1 max-w-lg text-center text-dono-muted">
          Built for the question donors actually ask: where did my money go?
        </Text>
      </View>
      <View className={isWide ? "flex-row gap-4" : "gap-4"}>
        {HOW_STEPS.map((step) => (
          <View
            key={step.n}
            className={`rounded-[14px] border-[3px] border-retro-ink bg-retro-paper px-5 py-5 ${
              isWide ? "flex-1" : ""
            }`}
          >
            <Text className="mb-2 font-retro-mono-bold text-sm text-retro-mint">
              {step.n}
            </Text>
            <Text className="mb-2 font-retro-bold text-lg text-retro-ink">
              {step.title}
            </Text>
            <Text className="text-[15px] leading-6 text-dono-muted">
              {step.body}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function LandingAudienceSplit({
  profile,
}: {
  profile: ProfileLike;
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  return (
    <View className={`mb-16 ${isWide ? "flex-row gap-5" : "gap-5"}`}>
      <View
        className={`rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-6 ${
          isWide ? "flex-1" : ""
        }`}
      >
        <Text className="mb-1 font-retro-mono text-xs uppercase text-dono-muted">
          For alumni & donors
        </Text>
        <Text className="mb-3 font-retro-bold text-xl text-retro-ink">
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

      <View
        className={`rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-6 ${
          isWide ? "flex-1" : ""
        }`}
      >
        <Text className="mb-1 font-retro-mono text-xs uppercase text-dono-muted">
          For students & societies
        </Text>
        <Text className="mb-3 font-retro-bold text-xl text-retro-ink">
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

export function LandingWhyDono() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  return (
    <View className="mb-16">
      <View className="mb-6 items-center">
        <Text className="font-retro-bold text-2xl text-retro-ink">
          Why Dono
        </Text>
        <Text className="mt-1 max-w-lg text-center text-dono-muted">
          People don’t dislike giving. They dislike giving without knowing what
          difference they made.
        </Text>
      </View>
      <View className={isWide ? "flex-row gap-4" : "gap-4"}>
        {WHY_ITEMS.map((item) => {
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
              <Text className="mb-2 font-retro-bold text-base text-retro-ink">
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
    <RetroPanel title="READY.dat" accent="coral" className="mb-0">
      <Text className="text-center font-retro-bold text-2xl text-retro-ink">
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
