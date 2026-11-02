/**
 * Survei Kepuasan (v1 screenshots 52–53). v1 asked for a star rating and a story;
 * v2 adds two short questions. Answers are kept for the session only; replace with
 * the survey API.
 */

import { useSyncExternalStore } from 'react';

export const surveyServices = ['Lacak bus', 'Cek Laik', 'Peta', 'Berita', 'Lapor', 'eTiket'] as const;
export type SurveyService = (typeof surveyServices)[number];

export const easeScale = ['Sangat sulit', 'Sulit', 'Biasa', 'Mudah', 'Sangat mudah'] as const;

export const ratingLabels = ['Sangat buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat baik'] as const;

export const STORY_MAX = 500;

export type SurveyAnswers = {
  rating: number;
  services: SurveyService[];
  ease: number;
  story: string;
};

let submitted: SurveyAnswers | undefined;
const listeners = new Set<() => void>();
const getSubmitted = () => submitted;

export function useSubmittedSurvey() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSubmitted,
    getSubmitted,
  );
}

export function submitSurvey(answers: SurveyAnswers) {
  submitted = answers;
  listeners.forEach((listener) => listener());
}
