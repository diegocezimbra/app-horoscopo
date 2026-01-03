/**
 * ==============================================================================
 * Onboarding Components - Module Exports
 * ==============================================================================
 *
 * Export all onboarding components for easy importing.
 * These components are designed for user engagement and data capture.
 *
 * @module components/onboarding
 */

// Part 1 - Initial engagement components
export { GenderSelect } from './GenderSelect';
export type { GenderSelectProps, Gender } from './GenderSelect';

export { Preparation } from './Preparation';
export type { PreparationProps } from './Preparation';

export { SocialProof } from './SocialProof';
export type { SocialProofProps } from './SocialProof';

export { QuizQuestion } from './QuizQuestion';
export type { QuizQuestionProps, Answer } from './QuizQuestion';

export { CredibilityBadges } from './CredibilityBadges';
export type { CredibilityBadgesProps } from './CredibilityBadges';

export { AnalysisLoading } from './AnalysisLoading';
export type { AnalysisLoadingProps } from './AnalysisLoading';

export { CelebrityComparison } from './CelebrityComparison';
export type { CelebrityComparisonProps } from './CelebrityComparison';

export { PricingPlans } from './PricingPlans';
export type { PricingPlansProps, PricingPlan } from './PricingPlans';

// Part 2 - Engagement and data capture components
export { PositiveFeedback } from './PositiveFeedback';
export type { PositiveFeedbackProps } from './PositiveFeedback';

export { NameInput } from './NameInput';
export type { NameInputProps } from './NameInput';

export { InterestsSelect } from './InterestsSelect';
export type {
  InterestsSelectProps,
  InterestOption,
  AdditionalAspect,
} from './InterestsSelect';

export { FeaturesShowcase } from './FeaturesShowcase';
export type { FeaturesShowcaseProps } from './FeaturesShowcase';
