import { describe, expect, it } from "vitest";
import {
  htmlToStory,
  parseStoryBold,
  storyHasBold,
  storyToEditorHtml,
  toggleStoryBold,
} from "./story-text";

describe("parseStoryBold", () => {
  it("returns a single plain part when there are no markers", () => {
    expect(parseStoryBold("Hello world")).toEqual([
      { text: "Hello world", bold: false },
    ]);
  });

  it("splits mixed plain and bold segments", () => {
    expect(parseStoryBold("We need **new blades** this term.")).toEqual([
      { text: "We need ", bold: false },
      { text: "new blades", bold: true },
      { text: " this term.", bold: false },
    ]);
  });

  it("handles adjacent bold spans", () => {
    expect(parseStoryBold("**Yes** **please**")).toEqual([
      { text: "Yes", bold: true },
      { text: " ", bold: false },
      { text: "please", bold: true },
    ]);
  });

  it("leaves unmatched markers as literal text", () => {
    expect(parseStoryBold("Almost **bold")).toEqual([
      { text: "Almost **bold", bold: false },
    ]);
  });
});

describe("storyHasBold", () => {
  it("is true only when a complete **pair** is present", () => {
    expect(storyHasBold("plain")).toBe(false);
    expect(storyHasBold("Almost **bold")).toBe(false);
    expect(storyHasBold("We need **new blades**")).toBe(true);
  });
});

describe("toggleStoryBold", () => {
  it("wraps a selection", () => {
    expect(toggleStoryBold("Hello world", 0, 5)).toBe("**Hello** world");
  });

  it("unwraps a selection that already includes markers", () => {
    expect(toggleStoryBold("**Hello** world", 0, 9)).toBe("Hello world");
  });

  it("unwraps when markers sit just outside the selection", () => {
    expect(toggleStoryBold("**Hello** world", 2, 7)).toBe("Hello world");
  });

  it("expands an empty selection to the word at the cursor", () => {
    expect(toggleStoryBold("Hello world", 1, 1)).toBe("**Hello** world");
  });

  it("is a no-op in whitespace", () => {
    expect(toggleStoryBold("Hello world", 5, 5)).toBe("Hello world");
  });

  it("wraps the last word when the cursor is at the end", () => {
    expect(toggleStoryBold("Hello world", 11, 11)).toBe("Hello **world**");
  });
});

describe("story editor html", () => {
  it("round-trips bold and plain text", () => {
    const story = "We need **new blades** this term.";
    expect(storyToEditorHtml(story)).toBe(
      "We need <strong>new blades</strong> this term.",
    );
    expect(htmlToStory(storyToEditorHtml(story))).toBe(story);
  });

  it("accepts <b> tags and line breaks from the editor", () => {
    expect(htmlToStory("Hello <b>world</b><br>again")).toBe(
      "Hello **world**\nagain",
    );
  });

  it("accepts font-weight spans from the editor", () => {
    expect(htmlToStory('<span style="font-weight: 700">Hello</span>')).toBe(
      "**Hello**",
    );
  });

  it("decodes entities after unwrapping tags", () => {
    expect(htmlToStory("A &amp; B")).toBe("A & B");
  });
});
