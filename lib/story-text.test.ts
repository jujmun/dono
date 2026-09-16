import { describe, expect, it } from "vitest";
import {
  htmlToStory,
  parseStoryRuns,
  storyToEditorHtml,
  stripStoryMarkers,
  toggleStoryMark,
} from "./story-text";

describe("parseStoryRuns", () => {
  it("returns a single plain run when there are no markers", () => {
    expect(parseStoryRuns("Hello world")).toEqual([
      { text: "Hello world", bold: false, italic: false, underline: false },
    ]);
  });

  it("parses bold, italic, and underline", () => {
    expect(parseStoryRuns("**bold** _italic_ ++under++")).toEqual([
      { text: "bold", bold: true, italic: false, underline: false },
      { text: " ", bold: false, italic: false, underline: false },
      { text: "italic", bold: false, italic: true, underline: false },
      { text: " ", bold: false, italic: false, underline: false },
      { text: "under", bold: false, italic: false, underline: true },
    ]);
  });

  it("parses nested bold italic", () => {
    expect(parseStoryRuns("**_both_**")).toEqual([
      { text: "both", bold: true, italic: true, underline: false },
    ]);
  });

  it("leaves unmatched markers as literal text", () => {
    expect(parseStoryRuns("Almost **bold")).toEqual([
      { text: "Almost **bold", bold: false, italic: false, underline: false },
    ]);
  });
});

describe("stripStoryMarkers", () => {
  it("flattens formatted copy", () => {
    expect(stripStoryMarkers("We need **new blades** this term.")).toBe(
      "We need new blades this term.",
    );
    expect(stripStoryMarkers("_hi_ ++there++")).toBe("hi there");
  });
});

describe("toggleStoryMark", () => {
  it("wraps and unwraps bold", () => {
    expect(toggleStoryMark("Hello world", 0, 5, "bold")).toBe("**Hello** world");
    expect(toggleStoryMark("**Hello** world", 2, 7, "bold")).toBe("Hello world");
  });

  it("wraps italic and underline", () => {
    expect(toggleStoryMark("Hello world", 0, 5, "italic")).toBe("_Hello_ world");
    expect(toggleStoryMark("Hello world", 6, 11, "underline")).toBe(
      "Hello ++world++",
    );
  });

  it("expands an empty selection to the word at the cursor", () => {
    expect(toggleStoryMark("Hello world", 1, 1, "bold")).toBe("**Hello** world");
  });
});

describe("story editor html", () => {
  it("round-trips mixed marks", () => {
    const story = "We need **new** _blades_ ++now++.";
    expect(htmlToStory(storyToEditorHtml(story))).toBe(story);
  });

  it("accepts editor tags and line breaks", () => {
    expect(htmlToStory("Hello <b>world</b><br><i>again</i> <u>please</u>")).toBe(
      "Hello **world**\n_again_ ++please++",
    );
  });

  it("accepts style spans from the editor", () => {
    expect(
      htmlToStory('<span style="font-weight: 700">Hello</span>'),
    ).toBe("**Hello**");
    expect(
      htmlToStory('<span style="font-style: italic">Hello</span>'),
    ).toBe("_Hello_");
    expect(
      htmlToStory('<span style="text-decoration: underline">Hello</span>'),
    ).toBe("++Hello++");
  });
});
