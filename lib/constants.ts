export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProgress(raised: number, goal: number): number {
  return Math.min(Math.round((raised / goal) * 100), 100);
}

export const categoryLabels: Record<string, string> = {
  textbooks: "Textbooks",
  equipment: "Equipment",
  travel: "Travel & Conferences",
  welfare: "Welfare",
  events: "Events",
  accessibility: "Accessibility",
  sports: "Sports",
  memorial: "Memorial",
  outreach: "Community Outreach",
};

export const categoryColors: Record<string, string> = {
  textbooks: "bg-blue-100 text-blue-700",
  equipment: "bg-purple-100 text-purple-700",
  travel: "bg-amber-100 text-amber-700",
  welfare: "bg-rose-100 text-rose-700",
  events: "bg-pink-100 text-pink-700",
  accessibility: "bg-teal-100 text-teal-700",
  sports: "bg-green-100 text-green-700",
  memorial: "bg-gray-100 text-gray-700",
  outreach: "bg-indigo-100 text-indigo-700",
};
