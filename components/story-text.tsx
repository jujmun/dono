import {
  createElement,
  useLayoutEffect,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { Bold, Italic, Underline } from "lucide-react-native";
import {
  STORY_FONT_FAMILY,
  htmlToStory,
  parseStoryRuns,
  storyRunFontFamily,
  storyToEditorHtml,
  toggleStoryMark,
  type StoryMark,
} from "@/lib/story-text";

const storyFont = {
  fontFamily: STORY_FONT_FAMILY,
  fontWeight: "400" as const,
};

const webRunStyle = (run: {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}) => ({
  fontFamily: storyRunFontFamily(run),
  fontWeight: run.bold ? 700 : 400,
  fontStyle: run.italic ? ("italic" as const) : ("normal" as const),
  textDecoration: run.underline ? "underline" : "none",
});

type StoryTextProps = {
  text: string;
  className?: string;
};

/** Render story copy in Work Sans with bold / italic / underline spans. */
export function StoryText({ text, className }: StoryTextProps) {
  const runs = parseStoryRuns(text);
  return (
    <Text className={className} style={storyFont}>
      {runs.map((run, index) => (
        <Text
          key={index}
          style={{
            fontFamily: storyRunFontFamily(run),
            fontWeight: run.bold ? "700" : "400",
            fontStyle: run.italic ? "italic" : "normal",
            textDecorationLine: run.underline ? "underline" : "none",
          }}
        >
          {run.text}
        </Text>
      ))}
    </Text>
  );
}

/** Inline formatted children for web `<p>` story paragraphs. */
export function storyRichWebChildren(text: string): ReactNode[] {
  return parseStoryRuns(text).map((run, index) =>
    createElement("span", { key: index, style: webRunStyle(run) }, run.text),
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
  contains: (node: Node) => boolean;
};

const FORMAT_COMMAND: Record<StoryMark, string> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
};

function emitEditorStory(el: EditorEl | null, onChangeText: (value: string) => void) {
  if (!el) return;
  onChangeText(htmlToStory(el.innerHTML));
}

function FormatButton({
  mark,
  label,
  onPress,
}: {
  mark: StoryMark;
  label: string;
  onPress: (mark: StoryMark) => void;
}) {
  const icon =
    mark === "bold" ? (
      <Bold size={14} color="#17211B" />
    ) : mark === "italic" ? (
      <Italic size={14} color="#17211B" />
    ) : (
      <Underline size={14} color="#17211B" />
    );

  if (Platform.OS === "web") {
    return createElement(
      "button",
      {
        type: "button",
        className: "story-format-btn",
        "aria-label": label,
        onMouseDown: (event: { preventDefault: () => void }) => {
          event.preventDefault();
        },
        onClick: () => onPress(mark),
      },
      icon,
      createElement("span", null, label),
    );
  }

  return (
    <Pressable
      onPress={() => onPress(mark)}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center gap-1.5 rounded-lg border-2 border-retro-ink bg-white px-2.5 py-1.5"
    >
      {icon}
      <Text style={storyFont} className="text-xs text-retro-ink">
        {label}
      </Text>
    </Pressable>
  );
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

  const apply = (mark: StoryMark) => {
    document.execCommand(FORMAT_COMMAND[mark]);
    emitEditorStory(editorRef.current, onChangeText);
  };

  return (
    <View className={`relative ${className ?? ""}`}>
      {!value && placeholder ? (
        <Text
          pointerEvents="none"
          className="absolute left-0 top-0 text-sm"
          style={{ ...storyFont, color: placeholderTextColor ?? "#56615A" }}
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
          fontFamily: STORY_FONT_FAMILY,
          fontWeight: 400,
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
          if (!(event.metaKey || event.ctrlKey)) return;
          const key = event.key.toLowerCase();
          if (key === "b") {
            event.preventDefault();
            apply("bold");
          } else if (key === "i") {
            event.preventDefault();
            apply("italic");
          } else if (key === "u") {
            event.preventDefault();
            apply("underline");
          }
        },
      })}
    </View>
  );
}

/** Multiline story field with Bold / Italic / Underline in Work Sans. */
export function StoryTextInput({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  className,
}: StoryTextInputProps) {
  const editorRef = useRef<EditorEl | null>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  const applyMark = (mark: StoryMark) => {
    if (Platform.OS === "web") {
      document.execCommand(FORMAT_COMMAND[mark]);
      emitEditorStory(editorRef.current, onChangeText);
      return;
    }
    const { start, end } = selectionRef.current;
    onChangeText(toggleStoryMark(value, start, end, mark));
  };

  return (
    <View className="gap-1.5">
      <View className="flex-row flex-wrap gap-1.5">
        <FormatButton mark="bold" label="Bold" onPress={applyMark} />
        <FormatButton mark="italic" label="Italic" onPress={applyMark} />
        <FormatButton mark="underline" label="Underline" onPress={applyMark} />
      </View>
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
          style={storyFont}
        />
      )}
    </View>
  );
}
