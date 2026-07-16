import { describe, expect, it } from "vitest";
import {
  buildPasswordFlowFormData,
  getPasswordFlowFormFields,
  isAccountAlreadyExistsError,
  isInvalidAccountIdError,
} from "./password-flow";

describe("password flow helpers", () => {
  it("builds sign-up form data with password field", () => {
    const fields = getPasswordFlowFormFields({
      flow: "signUp",
      email: "user@ox.ac.uk",
      password: "StrongPass123!",
    });
    expect(fields).toEqual({
      email: "user@ox.ac.uk",
      password: "StrongPass123!",
      flow: "signUp",
    });
  });

  it("builds sign-in form data with password field", () => {
    const fields = getPasswordFlowFormFields({
      flow: "signIn",
      email: "user@ox.ac.uk",
      password: "StrongPass123!",
    });
    expect(fields).toEqual({
      email: "user@ox.ac.uk",
      password: "StrongPass123!",
      flow: "signIn",
    });
  });

  it("builds email verification form data for password provider", () => {
    const fields = getPasswordFlowFormFields({
      flow: "email-verification",
      email: "user@ox.ac.uk",
      code: "123456",
    });
    expect(fields).toEqual({
      email: "user@ox.ac.uk",
      code: "123456",
      flow: "email-verification",
    });
  });

  it("builds reset verification form data with newPassword field", () => {
    const fields = getPasswordFlowFormFields({
      flow: "reset-verification",
      email: "user@ox.ac.uk",
      code: "123456",
      newPassword: "StrongPass123!",
    });
    expect(fields).toEqual({
      email: "user@ox.ac.uk",
      code: "123456",
      newPassword: "StrongPass123!",
      flow: "reset-verification",
    });
  });

  it("builds resend OTP verify form data", () => {
    const fields = getPasswordFlowFormFields({
      provider: "resend",
      email: "user@ox.ac.uk",
      code: "123456",
    });
    expect(fields).toEqual({
      email: "user@ox.ac.uk",
      code: "123456",
      flow: "email-verification",
    });
  });

  it("trims codes in form data", () => {
    const formData = buildPasswordFlowFormData({
      flow: "email-verification",
      email: "user@ox.ac.uk",
      code: " 123456 ",
    });
    expect(formData.get("code")).toBe("123456");
  });

  it("detects InvalidAccountId errors", () => {
    expect(isInvalidAccountIdError(new Error("InvalidAccountId"))).toBe(true);
    expect(isInvalidAccountIdError(new Error("Invalid credentials"))).toBe(false);
  });

  it("detects account already exists errors", () => {
    expect(isAccountAlreadyExistsError(new Error("Account already exists"))).toBe(
      true,
    );
  });
});
