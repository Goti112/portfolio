"use client";

import { useEffect, useState } from "react";

interface CopyEmailProps {
  readonly email: string;
  readonly copyLabel: string;
  readonly copiedLabel: string;
}

const copiedResetDelayMs: number = 2000;

export function CopyEmail({ email, copyLabel, copiedLabel }: CopyEmailProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  useEffect((): (() => void) | undefined => {
    if (!copied) return undefined;
    const timer = window.setTimeout((): void => setCopied(false), copiedResetDelayMs);
    return (): void => window.clearTimeout(timer);
  }, [copied]);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="copy-email" data-copied={copied} onClick={() => void copy()}>
      <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
    </button>
  );
}
