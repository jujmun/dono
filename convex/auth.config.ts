export default {
  providers: [
    {
      domain:
        process.env.CONVEX_SITE_URL ??
        process.env.EXPO_PUBLIC_CONVEX_SITE_URL ??
        process.env.EXPO_PUBLIC_SITE_URL,
      applicationID: "convex",
    },
  ],
};
