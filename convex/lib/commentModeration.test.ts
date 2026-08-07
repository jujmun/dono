import { describe, expect, it } from "vitest";
import {
  containsBlockedContent,
  containsProfanity,
  containsUrl,
  findBlockedContent,
} from "./commentModeration";

describe("containsProfanity", () => {
  it("flags common profanity", () => {
    expect(containsProfanity("this is bullshit")).toBe(true);
    expect(containsProfanity("you are a fucking idiot")).toBe(true);
  });

  it("flags simple leetspeak substitutions", () => {
    expect(containsProfanity("sh1t happens")).toBe(true);
    expect(containsProfanity("what an a$$hole")).toBe(true);
  });

  it("flags suffixed variants", () => {
    expect(containsProfanity("stop being such an ass")).toBe(true);
    expect(containsProfanity("he pissed everyone off")).toBe(true);
  });

  it("does not flag innocuous words containing a banned substring", () => {
    expect(containsProfanity("this class is great")).toBe(false);
    expect(containsProfanity("Scunthorpe is a town in England")).toBe(false);
  });

  it("does not flag clean comments", () => {
    expect(containsProfanity("Great campaign, well done!")).toBe(false);
  });
});

describe("containsUrl", () => {
  it("flags http(s) links", () => {
    expect(containsUrl("check this out https://example.com")).toBe(true);
    expect(containsUrl("http://example.com/path")).toBe(true);
  });

  it("flags www links", () => {
    expect(containsUrl("go to www.example.com now")).toBe(true);
  });

  it("flags bare domains", () => {
    expect(containsUrl("visit example.com for more")).toBe(true);
    expect(containsUrl("our society site is oxford.ac.uk")).toBe(true);
  });

  it("does not flag ordinary punctuation or numbers", () => {
    expect(containsUrl("Good. Thanks for the support!")).toBe(false);
    expect(containsUrl("We raised 3.14 thousand pounds")).toBe(false);
  });

  it("does not flag clean comments", () => {
    expect(containsUrl("This is a great cause, keep it up")).toBe(false);
  });
});

describe("findBlockedContent", () => {
  it("flags CSEA phrases", () => {
    const match = findBlockedContent("looking for child porn links");
    expect(match?.category).toBe("csea");
  });

  it("flags suicide encouragement", () => {
    const match = findBlockedContent("just kill yourself already");
    expect(match?.category).toBe("suicide");
  });

  it("flags spam phrases", () => {
    const match = findBlockedContent("Click here to claim your free gift card");
    expect(match?.category).toBe("spam");
  });

  it("flags slurs", () => {
    const match = findBlockedContent("what a faggot");
    expect(match?.category).toBe("slur");
  });

  it("flags urls as blocked", () => {
    expect(containsBlockedContent("see https://evil.com")).toBe(true);
    expect(findBlockedContent("see https://evil.com")?.category).toBe("url");
  });

  it("allows clean educational text", () => {
    expect(
      findBlockedContent("We support student mental health resources on campus"),
    ).toBeNull();
  });
});
