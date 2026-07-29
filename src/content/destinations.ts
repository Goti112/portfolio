import type { ExternalDestination, PrimaryProjectId } from "@/content/types";

const pendingDestination: ExternalDestination = Object.freeze({ status: "pending" });

const publishedDestination = (url: string): ExternalDestination => Object.freeze({
  status: "published",
  url,
});

export const projectRepositories: Readonly<Record<PrimaryProjectId, ExternalDestination>> = Object.freeze({
  "qgc-planner": publishedDestination("https://github.com/Goti112/Mission-Planner-Demo"),
  "borderpass-ai": publishedDestination("https://github.com/Goti112/borderpass-ai"),
  "ticket-ocr": publishedDestination("https://github.com/Goti112/ticket_app"),
});

export const experimentRepositories: Readonly<
  Record<"web-game" | "roblox-game" | "ai-wrapped", ExternalDestination>
> = Object.freeze({
  "web-game": pendingDestination,
  "roblox-game": pendingDestination,
  "ai-wrapped": pendingDestination,
});

export const contactDestinations: Readonly<{
  email: ExternalDestination;
  github: ExternalDestination;
}> = Object.freeze({
  email: publishedDestination("mailto:mmanz2606@gmail.com"),
  github: publishedDestination("https://github.com/Goti112"),
});
