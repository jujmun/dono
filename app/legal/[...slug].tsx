import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { AppShell } from "@/components/app-shell";
import { RetroPanel } from "@/components/retro";
import { LegalMarkdownBody } from "@/components/legal-markdown-body";
import {
  LEGAL_SUITE_VERSION,
  getLiveDocumentBody,
  resolveLiveDocument,
  type LegalDocumentId,
} from "@/lib/legal/documents";

function parseSlug(slug: string | string[] | undefined): {
  docId: string;
  version: string;
  /** True when the URL pins an explicit version (durable / archive link). */
  versionPinned: boolean;
} | null {
  const parts = Array.isArray(slug)
    ? slug
    : typeof slug === "string"
      ? slug.split("/").filter(Boolean)
      : [];
  if (parts.length === 1) {
    return {
      docId: parts[0],
      version: LEGAL_SUITE_VERSION,
      versionPinned: false,
    };
  }
  if (parts.length === 2) {
    return { docId: parts[0], version: parts[1], versionPinned: true };
  }
  return null;
}

function statusLabel(version: string, versionPinned: boolean): string {
  if (!versionPinned) {
    return `Current live terms · Version ${version}`;
  }
  if (version === LEGAL_SUITE_VERSION) {
    return `Version ${version} · pinned copy of the current live terms`;
  }
  return `Version ${version} · archived copy`;
}

export default function LegalDocumentPage() {
  const params = useLocalSearchParams<{ slug?: string | string[]; doc?: string }>();
  const parsed =
    parseSlug(params.slug) ??
    (typeof params.doc === "string"
      ? {
          docId: params.doc,
          version: LEGAL_SUITE_VERSION,
          versionPinned: false,
        }
      : null);

  const doc = parsed
    ? resolveLiveDocument(parsed.docId, parsed.version)
    : null;
  const body = parsed
    ? getLiveDocumentBody(parsed.docId, parsed.version)
    : null;

  if (!doc || body == null || !parsed) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-3xl px-4 py-10">
          <RetroPanel title="Document not available">
            <Text className="mt-2 text-sm text-[#5c574f]">
              This legal document is not available at the requested version.
              Acceptance and related flows are blocked until the release-authorised
              artifact is present in the live document registry.
            </Text>
          </RetroPanel>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Stack.Screen options={{ title: doc.title }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-8">
        <View className="mx-auto w-full max-w-3xl">
          <RetroPanel title={doc.title} bodyClassName="px-5 py-5">
            <Text className="text-xs text-[#5c574f]">
              {statusLabel(doc.version, parsed.versionPinned)}
            </Text>
            <LegalMarkdownBody
              source={body}
              documentTitle={doc.title}
              className="mt-5"
            />
          </RetroPanel>
        </View>
      </ScrollView>
    </AppShell>
  );
}

export type { LegalDocumentId };
