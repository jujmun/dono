/** Local placeholder data for the Societies page. Delete once a real Convex query exists. */
export interface MockSociety {
  id: string;
  name: string;
  /** Short initials shown in the placeholder icon badge. */
  icon: string;
  joined: boolean;
}

export const mockSocieties: MockSociety[] = [
  { id: "oxford-union", name: "Oxford Union", icon: "OU", joined: true },
  { id: "computing-society", name: "Computing Society", icon: "CS", joined: true },
  { id: "debate-society", name: "Debate Society", icon: "DS", joined: false },
  { id: "rowing-club", name: "Rowing Club", icon: "RC", joined: true },
  { id: "drama-society", name: "Drama Society", icon: "DR", joined: false },
  { id: "jazz-society", name: "Jazz Society", icon: "JZ", joined: false },
  { id: "chess-club", name: "Chess Club", icon: "CC", joined: false },
  { id: "volunteering-society", name: "Volunteering Society", icon: "VS", joined: true },
  { id: "photography-society", name: "Photography Society", icon: "PH", joined: false },
  { id: "entrepreneurs-society", name: "Entrepreneurs Society", icon: "ES", joined: false },
];
