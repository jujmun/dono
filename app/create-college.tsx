import { useLocalSearchParams } from "expo-router";
import { CreateCollegeWizard } from "@/components/create-college-wizard";
import { EditSocietyForm } from "@/components/edit-society-form";

export default function CreateCollegePage() {
  const { editSlug } = useLocalSearchParams<{ editSlug?: string }>();
  if (editSlug) {
    return <EditSocietyForm editSlug={editSlug} orgType="college" />;
  }
  return <CreateCollegeWizard />;
}
