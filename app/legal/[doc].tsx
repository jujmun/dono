import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { AppShell } from "@/components/app-shell";
import { RetroPanel } from "@/components/retro";
import {
  LEGAL_DOCUMENT_IDS,
  LEGAL_DOCUMENT_TITLES,
  LEGAL_DOCUMENT_VERSIONS,
  type LegalDocumentId,
} from "@/lib/legal/documents";
import { getLegalDocumentBody } from "@/lib/legal/content";

function isLegalDocumentId(value: string): value is LegalDocumentId {
  return (LEGAL_DOCUMENT_IDS as readonly string[]).includes(value);
}

export default function LegalDocumentPage() {
  const params = useLocalSearchParams<{ doc?: string }>();
  const docParam = typeof params.doc === "string" ? params.doc : "";
  const docId = isLegalDocumentId(docParam) ? docParam : null;

  if (!docId) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-3xl px-4 py-10">
          <RetroPanel title="Document not found">
            <Text className="mt-2 text-sm text-[#5c574f]">
              Choose a legal document from the footer links.
            </Text>
          </RetroPanel>
        </View>
      </AppShell>
    );
  }

  const title = LEGAL_DOCUMENT_TITLES[docId];
  const version = LEGAL_DOCUMENT_VERSIONS[docId];
  const body = getLegalDocumentBody(docId);

  return (
    <AppShell>
      <Stack.Screen options={{ title }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-8">
        <View className="mx-auto w-full max-w-3xl">
          <RetroPanel title={title}>
            <Text className="mt-1 text-xs text-[#5c574f]">Version {version}</Text>
            <Text className="mt-6 text-sm leading-6 text-retro-ink whitespace-pre-wrap">
              {body}
            </Text>
          </RetroPanel>
        </View>
      </ScrollView>
    </AppShell>
  );
}
