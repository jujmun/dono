import {
  createElement,
  useLayoutEffect,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { Bold } from "lucide-react-native";
import {
  htmlToStory,
  parseStoryBold,
  storyToEditorHtml,
  toggleStoryBold,
} from "@/lib/story-text";

type StoryTextProps = {
  text: string;
  className?: string;
};

/** Render story copy with **bold** spans as nested Text. */
export function StoryText({ text, className }: StoryTextProps) {
  const parts = parseStoryBold(text);
  return (
    <Text className={className}>
      {parts.map((part, index) =>
        part.bold ? (
          <Text
            key={index}
            className="font-retro-bold"
            style={{ fontFamily: "Fredoka_700Bold", fontWeight: "700" }}
          >
            {part.text}
          </Text>
        ) : (
          <Text key={index}>{part.text}</Text>
        ),
      )}
    </Text>
  );
}

const storyRegularFont = "Fredoka_500Medium, Fredoka, sans-serif";
const storyBoldFont = "Fredoka_700Bold, Fredoka, sans-serif";

const webBoldStyle = {
  fontFamily: storyBoldFont,
  fontWeight: 700,
} as const;

/** Inline **bold** children for web `<p>` story paragraphs. */
export function storyBoldWebChildren(text: string): ReactNode[] {
  return parseStoryBold(text).map((part, index) =>
    part.bold
      ? createElement("strong", { key: index, style: webBoldStyle }, part.text)
      : part.text,
  );
}

type StoryTextInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  className?: string;
};

type EditorEl = {
  innerHTML: string;
  focus: () => void;
};

function emitEditorStory(el: EditorEl | null, onChangeText: (value: string) => void) {
  if (!el) return;
  onChangeText(htmlToStory(el.innerHTML));
}

function WebStoryEditor({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  className,
  editorRef,
}: StoryTextInputProps & { editorRef: MutableRefObject<EditorEl | null> }) {
  useLayoutEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (htmlToStory(el.innerHTML) === value) return;
    el.innerHTML = storyToEditorHtml(value);
  }, [editorRef, value]);

  return (
    <View className={`relative ${className ?? ""}`}>
      {!value && placeholder ? (
        <Text
          pointerEvents="none"
          className="absolute left-0 top-0 font-retro text-sm"
          style={{ color: placeholderTextColor ?? "#56615A" }}
        >
          {placeholder}
        </Text>
      ) : null}
      {createElement("div", {
        ref: editorRef,
        className: "story-text-editor",
        contentEditable: true,
        suppressContentEditableWarning: true,
        role: "textbox",
        "aria-multiline": true,
        "aria-label": placeholder ?? "Story",
        style: {
          minHeight: 112,
          outline: "none",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: storyRegularFont,
          fontWeight: 500,
          fontSize: "inherit",
          lineHeight: "inherit",
          color: "inherit",
        },
        onInput: () => emitEditorStory(editorRef.current, onChangeText),
        onPaste: (event: {
          preventDefault: () => void;
          clipboardData?: { getData: (type: string) => string };
        }) => {
          event.preventDefault();
          const text = event.clipboardData?.getData("text/plain") ?? "";
          document.execCommand("insertText", false, text);
        },
        onKeyDown: (event: {
          key: string;
          metaKey: boolean;
          ctrlKey: boolean;
          preventDefault: () => void;
        }) => {
          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
            event.preventDefault();
            document.execCommand("bold");
            emitEditorStory(editorRef.current, onChangeText);
          }
        },
      })}
    </View>
  );
}

/** Multiline story field with a Bold control that bolds the current selection in place. */
export function StoryTextInput({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  className,
}: StoryTextInputProps) {
  const editorRef = useRef<EditorEl | null>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  const applyBold = () => {
    if (Platform.OS === "web") {
      editorRef.current?.focus();
      document.execCommand("bold");
      emitEditorStory(editorRef.current, onChangeText);
      return;
    }
    const { start, end } = selectionRef.current;
    onChangeText(toggleStoryBold(value, start, end));
  };

  return (
    <View className="gap-1.5">
      <Pressable
        onPressIn={applyBold}
        accessibilityRole="button"
        accessibilityLabel="Bold selected text"
        className="retro-key flex-row items-center gap-1.5 self-start rounded-lg border-2 border-retro-ink bg-white px-2.5 py-1.5"
        {...(Platform.OS === "web"
          ? {
              onMouseDown: (event: { preventDefault: () => void }) => {
                event.preventDefault();
              },
            }
          : {})}
      >
        <Bold size={14} color="#17211B" />
        <Text className="font-retro-bold text-xs text-retro-ink">Bold</Text>
      </Pressable>
      {Platform.OS === "web" ? (
        <WebStoryEditor
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          className={className}
          editorRef={editorRef}
        />
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSelectionChange={(event) => {
            selectionRef.current = event.nativeEvent.selection;
          }}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          className={className}
        />
      )}
    </View>
  );
}
