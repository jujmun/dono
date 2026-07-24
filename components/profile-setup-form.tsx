import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import {
  onboardingProfileSchema,
  YEAR_IN_COLLEGE_OPTIONS,
  type YearInCollege,
} from "@/lib/validation/profile";

export type ProfileSetupValues = {
  name: string;
  phone: string;
  college: string;
  degree: string;
  yearInCollege: YearInCollege;
  dateOfBirth: string;
  avatarPreview: string | null;
  avatarStorageId?: string;
};

type ProfileSetupFormProps = {
  initialValues?: Partial<ProfileSetupValues>;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: ProfileSetupValues) => void | Promise<void>;
};

const inputClassName =
  "w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text";

export function ProfileSetupForm({
  initialValues,
  submitLabel,
  loading = false,
  error,
  onSubmit,
}: ProfileSetupFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [college, setCollege] = useState(initialValues?.college ?? "");
  const [degree, setDegree] = useState(initialValues?.degree ?? "");
  const [yearInCollege, setYearInCollege] = useState<YearInCollege | "">(
    initialValues?.yearInCollege ?? "",
  );
  const [dateOfBirth, setDateOfBirth] = useState(initialValues?.dateOfBirth ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialValues?.avatarPreview ?? null,
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [pickingPhoto, setPickingPhoto] = useState(false);

  const initials = (name || "D").trim().charAt(0).toUpperCase();

  const pickPhoto = async () => {
    setLocalError(null);
    setPickingPhoto(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setLocalError("Photo library permission is required to add a profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        setLocalError("Profile picture must be 5MB or smaller.");
        return;
      }

      setAvatarPreview(asset.uri);
    } finally {
      setPickingPhoto(false);
    }
  };

  const handleSubmit = () => {
    const parsed = onboardingProfileSchema.safeParse({
      name,
      phone,
      college,
      degree,
      yearInCollege,
      dateOfBirth,
    });

    if (!parsed.success) {
      setLocalError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    setLocalError(null);
    void onSubmit({
      ...parsed.data,
      avatarPreview,
    });
  };

  const displayError = error ?? localError;

  return (
    <View className="gap-5">
      <View className="items-center">
        <Pressable
          onPress={() => void pickPhoto()}
          disabled={pickingPhoto || loading}
          className="relative"
        >
          <View className="h-24 w-24 overflow-hidden rounded-full border-2 border-dono-border bg-dono-surface-muted">
            {avatarPreview ? (
              <Image
                source={{ uri: avatarPreview }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                accessibilityLabel="Profile picture preview"
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Text className="font-retro-bold text-3xl text-dono-text">{initials}</Text>
              </View>
            )}
          </View>
          <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-dono-primary">
            <Camera size={14} color="#fff" />
          </View>
        </Pressable>
        <Text className="mt-3 text-sm text-dono-muted">
          {pickingPhoto ? "Opening photos..." : "Add a profile picture (optional)"}
        </Text>
      </View>

      <View>
        <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">Full name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
          placeholderTextColor="#56615A"
          className={inputClassName}
        />
      </View>

      <View>
        <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">Phone number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+44 7700 900000"
          placeholderTextColor="#56615A"
          keyboardType="phone-pad"
          className={inputClassName}
        />
      </View>

      <View>
        <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">College</Text>
        <TextInput
          value={college}
          onChangeText={setCollege}
          placeholder="e.g. Balliol College"
          placeholderTextColor="#56615A"
          className={inputClassName}
        />
      </View>

      <View>
        <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">Degree</Text>
        <TextInput
          value={degree}
          onChangeText={setDegree}
          placeholder="e.g. BA History"
          placeholderTextColor="#56615A"
          className={inputClassName}
        />
      </View>

      <View>
        <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">
          Date of birth
        </Text>
        <TextInput
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#56615A"
          autoCapitalize="none"
          className={inputClassName}
        />
        <Text className="mt-1 text-xs text-dono-muted">
          You must be at least 18 to use Dono.
        </Text>
      </View>

      <View>
        <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">
          Year in college
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {YEAR_IN_COLLEGE_OPTIONS.map((option) => {
            const selected = yearInCollege === option;
            return (
              <Pressable
                key={option}
                onPress={() => setYearInCollege(option)}
                className={`rounded-full border px-3 py-2 ${
                  selected
                    ? "border-dono-primary bg-dono-primary/10"
                    : "border-dono-border bg-white"
                }`}
              >
                <Text
                  className={`text-sm ${
                    selected ? "font-retro-bold text-dono-primary" : "text-dono-muted"
                  }`}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {displayError ? (
        <View className="rounded-xl bg-rose-50 px-4 py-3">
          <Text className="text-sm text-rose-700">{displayError}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        className={`items-center rounded-full bg-dono-primary py-3 ${
          loading ? "opacity-50" : ""
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-retro-bold text-sm text-white">{submitLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}
