export interface HealthProfile {
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
  goal: string;
  exerciseMinutesPerDay: number;
}

export interface SummaryMetrics {
  bmi: number;
  bodyFatPercent: number;
  restingHeartRate: number;
  bloodPressure: string;
  sleepHours: number;
  healthSummaryParagraph: string;
}

export interface ExerciseRecord {
  id: string;
  date: string;
  activity: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: "Low" | "Moderate" | "High";
}

export interface NutritionItem {
  type: "Protein" | "Carbs" | "Fat";
  grams: number;
}

export interface WeightRecord {
  date: string;
  weightKg: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  detail: string;
}

export interface ActivityComposition {
  type: "Cardio" | "Strength" | "Stretching" | "Rest";
  percentage: number;
  minutes: number;
}

export interface BodyComposition {
  type: "Muscle" | "Fat" | "Water" | "Bone";
  percentage: number;
}

export interface ExerciseEffort {
  date: string;
  caloriesBurned: number;
  durationMinutes: number;
}

export interface HealthReport {
  profile: HealthProfile;
  summary: SummaryMetrics;
  exercises: ExerciseRecord[];
  nutrition: NutritionItem[];
  weightHistory: WeightRecord[];
  timeline: TimelineEvent[];
  activityComposition: ActivityComposition[];
  bodyComposition: BodyComposition[];
  exerciseEffort: ExerciseEffort[];
}

export interface HealthFormValues {
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
  goal: string;
  exerciseMinutesPerDay: number;
}
