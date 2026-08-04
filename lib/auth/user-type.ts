type ProfileLike = {
  userType?: string | null;
} | null | undefined;

/** True for profiles.userType === "alumni" (donor accounts). */
export function isAlumni(profile: ProfileLike) {
  return profile?.userType === "alumni";
}

/**
 * Client-side hint only — creation mutations enforce this server-side via
 * `requireStudentCreator` regardless of what the UI renders. Block-lists
 * alumni rather than allow-listing "student" so profiles without a
 * `userType` (accounts predating this field) keep existing behaviour.
 */
export function canCreate(profile: ProfileLike) {
  return !isAlumni(profile);
}
