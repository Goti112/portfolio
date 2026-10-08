import type { PortfolioContent } from "@/content/types";

export function linkedTechnologies(projects: PortfolioContent["projects"]["items"]): ReadonlySet<string> {
  return new Set(projects.flatMap((project) => project.technologies.map((technology) => technology.toLowerCase())));
}