export interface LaunchIdentityVerificationArgs {
  clientSecret: string | null;
  url: string | null;
}

export interface LaunchIdentityVerificationResult {
  error?: string;
}
