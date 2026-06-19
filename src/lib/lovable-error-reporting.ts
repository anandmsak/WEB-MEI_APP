// src/lib/lovable-error-reporting.ts

export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  // Completely disabled for custom standalone production/APK build
  console.log("[Production Mode] Inactive error hook:", error, context);
}