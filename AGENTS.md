# Dono agent notes

This is an Expo Router (React Native) app targeting web, iOS, and Android.
Prefer `expo-router` APIs (`Link`, `useRouter`, `useLocalSearchParams`) over web-only Next.js APIs.
Use React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`, `TextInput`) styled with NativeWind `className`.
Backend lives in `convex/` and is consumed via `convex/react` (`useQuery` / `useMutation`).
