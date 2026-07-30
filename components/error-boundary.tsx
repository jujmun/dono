import { Component, type ReactNode } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Temporary diagnostic boundary for the "blank page in production" bug.
 * Without this, an uncaught render error unmounts the whole tree with no
 * on-screen trace — React's dev overlay only appears in `expo start`, not
 * in the exported web build Vercel serves. Remove once the root cause
 * (convex/schema.ts vs deployed function mismatch, etc.) is confirmed.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error("[ErrorBoundary] caught render error:", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <ScrollView className="w-full max-w-2xl" contentContainerClassName="gap-3">
          <Text className="font-retro-bold text-lg text-rose-700">
            Something crashed while rendering this page
          </Text>
          <Text className="font-retro-mono-bold text-sm text-dono-text">
            {error.name}: {error.message}
          </Text>
          {error.stack ? (
            <Text className="font-retro-mono text-xs text-dono-muted">{error.stack}</Text>
          ) : null}
          <Pressable
            onPress={() => this.setState({ error: null })}
            className="mt-2 self-start rounded-full bg-dono-primary px-4 py-2"
          >
            <Text className="font-retro-bold text-sm text-white">Try again</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }
}
