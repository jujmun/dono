import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import {
  Home,
  PiggyBank,
  Users,
  Sparkles,
  User,
  Plus,
  ArrowRight,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react-native";

type WelcomeTourSlide = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  navLabel: string;
};

const slides: WelcomeTourSlide[] = [
  {
    title: "Welcome to Dono",
    description:
      "Dono connects Oxford students and alumni through transparent crowdfunding. Here's how to find your way around.",
    icon: Home,
    href: "/",
    navLabel: "Overview",
  },
  {
    title: "Home",
    description:
      "Start on the homepage to see featured campaigns and learn how Dono works. It's the best place to get a feel for what's happening on campus.",
    icon: Home,
    href: "/",
    navLabel: "Home",
  },
  {
    title: "Campaigns",
    description:
      "Browse student causes, read updates, donate, like posts, and leave comments. Each campaign shows exactly what your money will fund.",
    icon: PiggyBank,
    href: "/campaigns",
    navLabel: "Campaigns",
  },
  {
    title: "Societies",
    description:
      "Explore colleges, departments, and student societies. Follow the communities you care about to stay close to their latest projects.",
    icon: Users,
    href: "/societies",
    navLabel: "Societies",
  },
  {
    title: "Impact",
    description:
      "Your dashboard tracks donations you've made, campaigns and communities you follow, and the difference your giving has made.",
    icon: Sparkles,
    href: "/dashboard",
    navLabel: "Impact",
  },
  {
    title: "Your account",
    description:
      "Update your profile, manage recurring donations, and review feedback on campaigns you run — all from Account settings.",
    icon: User,
    href: "/account",
    navLabel: "You",
  },
  {
    title: "Start a campaign",
    description:
      "Have a project that needs funding? Tap Start a Campaign to submit your idea and rally support from the Dono community.",
    icon: Plus,
    href: "/create",
    navLabel: "Create",
  },
];

type WelcomeTourProps = {
  onComplete: () => void;
  loading?: boolean;
};

export function WelcomeTour({ onComplete, loading = false }: WelcomeTourProps) {
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;

  return (
    <View className="rounded-2xl border border-dono-border bg-white p-8">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="font-mono text-xs uppercase tracking-wide text-dono-muted">
          Getting started {step + 1}/{slides.length}
        </Text>
        <Pressable onPress={onComplete} disabled={loading}>
          <Text className="text-sm text-dono-primary">Skip tour</Text>
        </Pressable>
      </View>

      <View className="items-center">
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-dono-primary/10">
          <Icon size={28} color="#17211B" strokeWidth={2} />
        </View>
        <Text className="text-center font-display-medium text-2xl text-dono-text">
          {slide.title}
        </Text>
        <View className="mt-2 rounded-full bg-dono-surface-muted px-3 py-1">
          <Text className="font-mono text-xs uppercase tracking-wide text-dono-muted">
            {slide.navLabel}
          </Text>
        </View>
        <Text className="mt-4 text-center text-sm leading-relaxed text-dono-muted">
          {slide.description}
        </Text>
      </View>

      <View className="mt-8 flex-row justify-center gap-1.5">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full ${
              index === step ? "w-6 bg-dono-primary" : "w-1.5 bg-dono-border"
            }`}
          />
        ))}
      </View>

      <View className="mt-8 flex-row gap-3">
        {step > 0 ? (
          <Pressable
            onPress={() => setStep((current) => current - 1)}
            disabled={loading}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-full border border-dono-border py-3"
          >
            <ArrowLeft size={16} color="#56615A" />
            <Text className="font-sans-medium text-sm text-dono-muted">Back</Text>
          </Pressable>
        ) : (
          <View className="flex-1" />
        )}

        <Pressable
          onPress={() => {
            if (isLast) {
              onComplete();
              return;
            }
            setStep((current) => current + 1);
          }}
          disabled={loading}
          className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full bg-dono-primary py-3 ${
            loading ? "opacity-50" : ""
          }`}
        >
          <Text className="font-sans-medium text-sm text-white">
            {loading ? "Please wait..." : isLast ? "Enter Dono" : "Next"}
          </Text>
          {!loading && !isLast ? <ArrowRight size={16} color="#ffffff" /> : null}
        </Pressable>
      </View>
    </View>
  );
}
