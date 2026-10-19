export type ElectricalNavItemKey = "blogs" | "events" | "teams" | "portfolio";

const counts: Record<ElectricalNavItemKey, number> = {
  blogs: 0,
  events: 0,
  teams: 0,
  portfolio: 0,
};

export function setElectricalNavItemCounts(
  next: Record<ElectricalNavItemKey, number>,
) {
  counts.blogs = next.blogs;
  counts.events = next.events;
  counts.teams = next.teams;
  counts.portfolio = next.portfolio;
}

export function electricalNavHasItems(key: ElectricalNavItemKey) {
  return counts[key] > 0;
}
