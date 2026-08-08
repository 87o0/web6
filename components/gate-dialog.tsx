'use client';

import { useGate } from '@/components/gate-context';

/**
 * Purchase gating now opens the real AuthDialog directly via
 * gate-context -> useAuthDialog().openAuth(). This component is kept
 * only to satisfy existing imports and renders nothing visible.
 */
export function GateDialog() {
  useGate();
  return null;
}
