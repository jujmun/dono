export type PasswordFlow =
  | "signUp"
  | "signIn"
  | "email-verification"
  | "reset"
  | "reset-verification";

type SignUpParams = {
  flow: "signUp";
  email: string;
  password: string;
};

type SignInParams = {
  flow: "signIn";
  email: string;
  password: string;
};

type EmailVerificationParams = {
  flow: "email-verification";
  email: string;
  code: string;
};

type ResetRequestParams = {
  flow: "reset";
  email: string;
};

type ResetVerificationParams = {
  flow: "reset-verification";
  email: string;
  code: string;
  newPassword: string;
};

type OtpSendParams = {
  provider: "resend";
  email: string;
};

type OtpVerifyParams = {
  provider: "resend";
  email: string;
  code: string;
};

export type PasswordFlowParams =
  | SignUpParams
  | SignInParams
  | EmailVerificationParams
  | ResetRequestParams
  | ResetVerificationParams
  | OtpSendParams
  | OtpVerifyParams;

function appendFields(formData: FormData, fields: Record<string, string>) {
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
}

export function buildPasswordFlowFormData(params: PasswordFlowParams): FormData {
  const formData = new FormData();

  if ("provider" in params) {
    formData.append("email", params.email);
    if ("code" in params) {
      formData.append("code", params.code.trim());
      formData.append("flow", "email-verification");
    }
    return formData;
  }

  switch (params.flow) {
    case "signUp":
    case "signIn":
      appendFields(formData, {
        email: params.email,
        password: params.password,
        flow: params.flow,
      });
      break;
    case "email-verification":
      appendFields(formData, {
        email: params.email,
        code: params.code.trim(),
        flow: "email-verification",
      });
      break;
    case "reset":
      appendFields(formData, {
        email: params.email,
        flow: "reset",
      });
      break;
    case "reset-verification":
      appendFields(formData, {
        email: params.email,
        code: params.code.trim(),
        newPassword: params.newPassword,
        flow: "reset-verification",
      });
      break;
    default: {
      const _exhaustive: never = params;
      return _exhaustive;
    }
  }

  return formData;
}

export function getPasswordFlowFormFields(
  params: PasswordFlowParams,
): Record<string, string> {
  if ("provider" in params) {
    if ("code" in params) {
      return {
        email: params.email,
        code: params.code.trim(),
        flow: "email-verification",
      };
    }
    return { email: params.email };
  }

  switch (params.flow) {
    case "signUp":
    case "signIn":
      return {
        email: params.email,
        password: params.password,
        flow: params.flow,
      };
    case "email-verification":
      return {
        email: params.email,
        code: params.code.trim(),
        flow: "email-verification",
      };
    case "reset":
      return {
        email: params.email,
        flow: "reset",
      };
    case "reset-verification":
      return {
        email: params.email,
        code: params.code.trim(),
        newPassword: params.newPassword,
        flow: "reset-verification",
      };
    default: {
      const _exhaustive: never = params;
      return _exhaustive;
    }
  }
}

export function isInvalidAccountIdError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /InvalidAccountId/i.test(message);
}

export function isAccountAlreadyExistsError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /already exists|account already|InvalidAccountId/i.test(message);
}
