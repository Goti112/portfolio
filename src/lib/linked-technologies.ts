import type { PortfolioContent } from "@/content/types";

const impliedTechnologies: Readonly<Record<string, readonly string[]>> = Object.freeze({
  postgresql: ["sql"],
  mysql: ["sql"],
});

export function linkedTechnologies(projects: PortfolioContent["projects"]["items"]): ReadonlySet<string> {
  return new Set(projects.flatMap((project) => [...project.technologies, ...project.tooling].flatMap((technology) => {
    const key = technology.toLowerCase();
    return [key, ...(impliedTechnologies[key] ?? [])];
  })));
}
