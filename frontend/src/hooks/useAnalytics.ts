import { useCallback, useRef } from 'react';
import type { OnboardingStep, Gender } from '../types/onboarding';

/**
 * Analytics event types
 */
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

/**
 * Analytics tracking hook for onboarding events
 */
export function useAnalytics() {
  const sessionStartTime = useRef(Date.now());
  const eventQueue = useRef<AnalyticsEvent[]>([]);

  /**
   * Track a generic event
   */
  const trackEvent = useCallback((event: string, properties?: Record<string, unknown>) => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionDuration: Date.now() - sessionStartTime.current,
      },
      timestamp: Date.now(),
    };

    eventQueue.current.push(analyticsEvent);

    // In production, send to analytics service
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event, properties);
    }

    // TODO: Send to actual analytics service
    // sendToAnalytics(analyticsEvent);
  }, []);

  /**
   * Track page/step view
   */
  const trackStepView = useCallback((step: OnboardingStep) => {
    trackEvent('onboarding_step_viewed', {
      step,
      step_name: step.replace(/-/g, '_'),
    });
  }, [trackEvent]);

  /**
   * Track step completion
   */
  const trackStepComplete = useCallback((step: OnboardingStep, duration?: number) => {
    trackEvent('onboarding_step_completed', {
      step,
      step_name: step.replace(/-/g, '_'),
      duration_ms: duration,
    });
  }, [trackEvent]);

  /**
   * Track gender selection
   */
  const trackGenderSelected = useCallback((gender: Gender) => {
    trackEvent('gender_selected', { gender });
  }, [trackEvent]);

  /**
   * Track quiz answer
   */
  const trackQuizAnswer = useCallback((questionId: string, answerId: string, questionIndex: number) => {
    trackEvent('quiz_answer_submitted', {
      question_id: questionId,
      answer_id: answerId,
      question_index: questionIndex,
    });
  }, [trackEvent]);

  /**
   * Track interests selected
   */
  const trackInterestsSelected = useCallback((interests: string[]) => {
    trackEvent('interests_selected', {
      interests,
      count: interests.length,
    });
  }, [trackEvent]);

  /**
   * Track name entered
   */
  const trackNameEntered = useCallback((nameLength: number) => {
    trackEvent('name_entered', {
      name_length: nameLength,
    });
  }, [trackEvent]);

  /**
   * Track birth data entered
   */
  const trackBirthDataEntered = useCallback((hasDate: boolean, hasTime: boolean, hasPlace: boolean) => {
    trackEvent('birth_data_entered', {
      has_date: hasDate,
      has_time: hasTime,
      has_place: hasPlace,
      completeness: [hasDate, hasTime, hasPlace].filter(Boolean).length / 3,
    });
  }, [trackEvent]);

  /**
   * Track pricing plan viewed
   */
  const trackPricingViewed = useCallback((plans: string[]) => {
    trackEvent('pricing_plans_viewed', {
      plans,
      count: plans.length,
    });
  }, [trackEvent]);

  /**
   * Track pricing plan selected
   */
  const trackPlanSelected = useCallback((planId: string, price: number, period: string) => {
    trackEvent('pricing_plan_selected', {
      plan_id: planId,
      price,
      period,
    });
  }, [trackEvent]);

  /**
   * Track onboarding completion
   */
  const trackOnboardingComplete = useCallback((totalDuration: number) => {
    trackEvent('onboarding_completed', {
      total_duration_ms: totalDuration,
      total_duration_seconds: Math.round(totalDuration / 1000),
    });
  }, [trackEvent]);

  /**
   * Track onboarding abandonment
   */
  const trackOnboardingAbandoned = useCallback((step: OnboardingStep, reason?: string) => {
    trackEvent('onboarding_abandoned', {
      last_step: step,
      reason,
      session_duration_ms: Date.now() - sessionStartTime.current,
    });
  }, [trackEvent]);

  /**
   * Track feature interaction
   */
  const trackFeatureInteraction = useCallback((featureId: string, action: string) => {
    trackEvent('feature_interaction', {
      feature_id: featureId,
      action,
    });
  }, [trackEvent]);

  /**
   * Track celebrity comparison viewed
   */
  const trackCelebrityComparisonViewed = useCallback((celebrityId: string, compatibility: number) => {
    trackEvent('celebrity_comparison_viewed', {
      celebrity_id: celebrityId,
      compatibility,
    });
  }, [trackEvent]);

  /**
   * Track error
   */
  const trackError = useCallback((errorType: string, errorMessage: string, context?: Record<string, unknown>) => {
    trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      ...context,
    });
  }, [trackEvent]);

  /**
   * Get session duration
   */
  const getSessionDuration = useCallback(() => {
    return Date.now() - sessionStartTime.current;
  }, []);

  return {
    trackEvent,
    trackStepView,
    trackStepComplete,
    trackGenderSelected,
    trackQuizAnswer,
    trackInterestsSelected,
    trackNameEntered,
    trackBirthDataEntered,
    trackPricingViewed,
    trackPlanSelected,
    trackOnboardingComplete,
    trackOnboardingAbandoned,
    trackFeatureInteraction,
    trackCelebrityComparisonViewed,
    trackError,
    getSessionDuration,
  };
}
