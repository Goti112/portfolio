import type { ExternalDestination, PrimaryProjectId } from "@/content/types";

const publishedDestination = (url: string): ExternalDestination => Object.freeze({
  status: "published",
  url,
});

export const projectRepositories: Readonly<Record<PrimaryProjectId, ExternalDestination>> = Object.freeze({
  "github-city": publishedDestination("https://github.com/Goti112/github-city"),
  "qgc-planner": publishedDestination("https://github.com/Goti112/Mission-Planner-Demo"),
  "borderpass-ai": publishedDestination("https://github.com/Goti112/borderpass-ai"),
});

export const contactDestinations: Readonly<{
  email: ExternalDestination;
  github: ExternalDestination;
}> = Object.freeze({
  email: publishedDestination("mailto:mmanz2606@gmail.com"),
  github: publishedDestination("https://github.com/Goti112"),
});
