/**
 * Mock Telemetry Service
 * In production, this would integrate with a real analytics SDK (e.g., Amplitude, PostHog)
 * to stream funnel events like 'exposure', 'mic_tap', 'record_start', etc.
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (__DEV__) {
    console.log(`[Telemetry] Event logged: ${eventName}`, properties || {});
  }
};
