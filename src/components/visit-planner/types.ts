/** VISIT PLANNER — what the planner knows about a property: read from the property record by the server page, never typed. */
export type PlannerProperty = {
  slug: string;
  name: string;
  address: string;
  place: string;
  area: string | null;
  status: string;
  photo: { src: string; small: string; width: number; height: number; alt: string; position?: string };
  mapUrl: string | null;
  routeUrl: string | null;
  tourPath: string | null;
  pagePath: string;
  deskPath: string | null;
};
