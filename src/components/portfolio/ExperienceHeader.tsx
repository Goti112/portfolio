"use client";

import { useEffect, useRef, useState } from "react";
import type { NavigationItem, PortfolioContent } from "@/content/types";

interface ExperienceHeaderProps {
  readonly content: PortfolioContent;
}

export function ExperienceHeader({ content }: ExperienceHeaderProps): React.JSX.Element {
  const [mode, setMode] = useState<"docked" | "floating">("docked");
  const [activeTarget, setActiveTarget] = useState<NavigationItem["target"] | null>(null);
  const [tuning, setTuning] = useState(false);
  const lockActiveRef = useRef(false);
  const unlockTimeoutRef = useRef<number | null>(null);
  const releaseLockRef = useRef<() => void>(() => undefined);
  const previousTargetRef = useRef<NavigationItem["target"] | null>(activeTarget);
  const hasInteractedRef = useRef(false);
  const headerCopy = content.system.header;

  const resetUnlockTimeout = (): void => {
    if (unlockTimeoutRef.current !== null) window.clearTimeout(unlockTimeoutRef.current);
    unlockTimeoutRef.current = window.setTimeout(() => releaseLockRef.current(), 900);
  };

  const lockTarget = (target: NavigationItem["target"] | null): void => {
    hasInteractedRef.current = true;
    lockActiveRef.current = true;
    setActiveTarget(target);
    resetUnlockTimeout();
  };

  useEffect((): void => {
    if (previousTargetRef.current !== activeTarget && hasInteractedRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTuning(true);
    }
    previousTargetRef.current = activeTarget;
  }, [activeTarget]);

  useEffect((): (() => void) => {
    const sections = content.navigation
      .map((item) => ({ item, element: document.getElementById(item.target) }))
      .filter((section): section is { item: NavigationItem; element: HTMLElement } => section.element !== null);
    const visible = new Map<NavigationItem["target"], number>();
    let observer: IntersectionObserver | null = null;
    let previousCommitWasAtBottom = false;

    const isAtBottom = (): boolean => window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;

    const measureVisible = (): void => {
      visible.clear();
      const activationTop = window.innerHeight * 0.35;
      const activationBottom = window.innerHeight * 0.45;
      for (const { item, element } of sections) {
        const bounds = element.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(bounds.bottom, activationBottom) - Math.max(bounds.top, activationTop));
        visible.set(item.target, bounds.height > 0 ? overlap / bounds.height : 0);
      }
    };

    const commit = (): void => {
      if (observer === null) measureVisible();
      if (lockActiveRef.current) return;

      if (isAtBottom()) {
        previousCommitWasAtBottom = true;
        setActiveTarget("contact");
        return;
      }

      if (previousCommitWasAtBottom) {
        previousCommitWasAtBottom = false;
        measureVisible();
      }

      const best = [...visible.entries()]
        .filter(([, ratio]) => ratio > 0)
        .sort((left, right) => right[1] - left[1])[0];
      setActiveTarget(best ? best[0] : null);
    };

    const releaseLock = (): void => {
      if (!lockActiveRef.current) return;
      lockActiveRef.current = false;
      if (unlockTimeoutRef.current !== null) {
        window.clearTimeout(unlockTimeoutRef.current);
        unlockTimeoutRef.current = null;
      }
      commit();
    };

    releaseLockRef.current = releaseLock;

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver((entries): void => {
        for (const entry of entries) {
          const section = sections.find(({ item }) => item.target === entry.target.id);
          if (section !== undefined) {
            visible.set(section.item.target, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
        }
        commit();
      }, { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] });
      sections.forEach(({ element }) => observer?.observe(element));
    }

    const syncMode = (): void => {
      hasInteractedRef.current = true;
      setMode(window.scrollY > 48 ? "floating" : "docked");
      if (lockActiveRef.current) resetUnlockTimeout();
      commit();
    };

    const syncInitialPosition = (): void => {
      setMode(window.scrollY > 48 ? "floating" : "docked");
      commit();
    };

    const supportsScrollEnd = "onscrollend" in window;
    window.addEventListener("scroll", syncMode, { passive: true });
    if (supportsScrollEnd) window.addEventListener("scrollend", releaseLock);
    syncInitialPosition();

    return (): void => {
      window.removeEventListener("scroll", syncMode);
      if (supportsScrollEnd) window.removeEventListener("scrollend", releaseLock);
      if (unlockTimeoutRef.current !== null) {
        window.clearTimeout(unlockTimeoutRef.current);
        unlockTimeoutRef.current = null;
      }
      lockActiveRef.current = false;
      releaseLockRef.current = (): void => undefined;
      observer?.disconnect();
    };
  }, [content.navigation]);

  const navigationLabel = headerCopy.navigationLabel;
  const skipLabel = headerCopy.skipLabel;
  const targetLocale = content.locale === "es" ? "en" : "es";
  const targetHref = content.locale === "es" ? "/en" : "/";
  const targetLabel = headerCopy.languageTargetLabel;
  const activeItem = content.navigation.find((item) => item.target === activeTarget);
  const activeChannelIndex = activeItem ? content.navigation.indexOf(activeItem) + 1 : 0;
  const activeLabel = activeItem?.label ?? headerCopy.homeChannelLabel;

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={() => lockTarget(null)}>{skipLabel}</a>
      <header className="experience-header" data-mode={mode}>
        <a className="experience-header__brand" href="#profile" onClick={() => lockTarget(null)}>
          <span className="experience-header__rec-dot" aria-hidden="true" />
          <span className="experience-header__brand-name">{content.intro.name}</span>
          <span className="experience-header__brand-short" aria-hidden="true">M. MANZANO</span>
          <span className="experience-header__rec" aria-hidden="true">{" // "}{headerCopy.broadcastLabel}</span>
        </a>
        <nav aria-label={navigationLabel}>
          <ul className="experience-header__navigation">
            {content.navigation.map((item, index) => (
              <li key={item.target}>
                <a
                  href={`#${item.target}`}
                  aria-current={activeTarget === item.target ? "location" : undefined}
                  data-active={activeTarget === item.target}
                  onClick={() => lockTarget(item.target)}
                >
                  <span className="experience-header__channel-copy">
                    <span className="experience-header__channel-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="experience-header__channel-label">{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p
          className="experience-header__osd"
          data-channel={activeChannelIndex}
          data-tuning={tuning}
          onAnimationEnd={() => setTuning(false)}
        >
          <span className="sr-only">{headerCopy.currentChannelLabel}: </span>
          <span aria-hidden="true">{headerCopy.channelPrefix} {String(activeChannelIndex).padStart(2, "0")}</span>
          <span className="experience-header__osd-arrow" aria-hidden="true">▸</span>
          <span className="experience-header__osd-label">{activeLabel}</span>
        </p>
        <a className="experience-header__language" href={targetHref} hrefLang={targetLocale} lang={targetLocale}>
          <span className="sr-only">{content.system.languageLabel}: {targetLabel}</span>
          <span aria-hidden="true" className="experience-header__lang-option" data-locale="es" data-current={content.locale === "es"}>ES</span>
          <span aria-hidden="true" className="experience-header__lang-option" data-locale="en" data-current={content.locale === "en"}>EN</span>
        </a>
      </header>
    </>
  );
}
