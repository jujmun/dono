import { useLocalSearchParams } from "expo-router";
import { CreateOrgWizard } from "@/components/create-org-wizard";
import { EditSocietyForm } from "@/components/edit-society-form";

export default function CreateSocietyPage() {
  const { editSlug } = useLocalSearchParams<{ editSlug?: string }>();
  if (editSlug) {
    return <EditSocietyForm editSlug={editSlug} orgType="society" />;
  }
  return <CreateOrgWizard orgType="society" />;
}
