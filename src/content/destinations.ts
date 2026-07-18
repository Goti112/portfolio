import type { ExternalDestination, PrimaryProjectId } from "@/content/types";

const pendingDestination: ExternalDestination = Object.freeze({ status: "pending" });

export const projectRepositories: Readonly<Record<PrimaryProjectId, ExternalDestination>> = Object.freeze({
  "qgc-planner": pendingDestination,
  "borderpass-ai": pendingDestination,
  "ticket-ocr": pendingDestination,
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
  email: pendingDestination,
  github: pendingDestination,
});
