import type {
  ActivityComposition,
  BodyComposition,
  ExerciseEffort,
  ExerciseRecord,
  HealthReport,
  NutritionItem,
  TimelineEvent,
  WeightRecord,
} from "../types/healthReport.type";

export interface NutritionChartDatum {
  label: string;
  value: number;
}

export interface WeightChartDatum {
  x: string;
  y: number;
}

export interface ActivityCompositionDatum {
  type: string;
  value: number;
}

export interface BodyCompositionDatum {
  type: string;
  value: number;
}

export interface ExerciseEffortDatum {
  date: string;
  calories: number;
  duration: number;
}

const defaultReport: HealthReport = {
  profile: {
    fullName: "",
    age: 0,
    gender: "male",
    heightCm: 0,
    currentWeightKg: 0,
    goalWeightKg: 0,
    goal: "",
    exerciseMinutesPerDay: 0,
  },
  summary: {
    bmi: 0,
    bodyFatPercent: 0,
    restingHeartRate: 0,
    bloodPressure: "",
    sleepHours: 0,
    healthSummaryParagraph: "",
  },
  exercises: [],
  nutrition: [],
  weightHistory: [],
  timeline: [],
  activityComposition: [],
  bodyComposition: [],
  exerciseEffort: [],
};

function safeString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function safeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toExerciseRecords(value: unknown): ExerciseRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isObject).map((item, index) => {
    const intensityValue = safeString(item.intensity, "Moderate");
    const intensity: ExerciseRecord["intensity"] =
      intensityValue === "Low" || intensityValue === "High"
        ? intensityValue
        : "Moderate";

    return {
      id: safeString(item.id, `exercise-${index + 1}`),
      date: safeString(item.date, "-"),
      activity: safeString(item.activity, "Unknown activity"),
      durationMinutes: Math.max(0, safeNumber(item.durationMinutes, 0)),
      caloriesBurned: Math.max(0, safeNumber(item.caloriesBurned, 0)),
      intensity,
    };
  });
}

function toNutritionItems(value: unknown): NutritionItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map((item) => {
      const typeValue = safeString(item.type, "Carbs");
      const type: NutritionItem["type"] =
        typeValue === "Protein" || typeValue === "Fat" ? typeValue : "Carbs";

      return {
        type,
        grams: Math.max(0, safeNumber(item.grams, 0)),
      };
    })
    .filter((item) => item.grams > 0);
}

function toWeightRecords(value: unknown): WeightRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map((item) => ({
      date: safeString(item.date, "-"),
      weightKg: Math.max(0, safeNumber(item.weightKg, 0)),
    }))
    .filter((item) => item.weightKg > 0);
}

function toTimelineEvents(value: unknown): TimelineEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isObject).map((item, index) => ({
    id: safeString(item.id, `timeline-${index + 1}`),
    date: safeString(item.date, "-"),
    title: safeString(item.title, "Progress update"),
    detail: safeString(item.detail, "-"),
  }));
}

function toActivityComposition(value: unknown): ActivityComposition[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map((item) => {
      const typeValue = safeString(item.type, "Cardio");
      const type: ActivityComposition["type"] =
        typeValue === "Strength" ||
        typeValue === "Stretching" ||
        typeValue === "Rest"
          ? typeValue
          : "Cardio";

      return {
        type,
        percentage: Math.max(0, Math.min(100, safeNumber(item.percentage, 0))),
        minutes: Math.max(0, safeNumber(item.minutes, 0)),
      };
    })
    .filter((item) => item.minutes > 0);
}

function toBodyComposition(value: unknown): BodyComposition[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map((item) => {
      const typeValue = safeString(item.type, "Muscle");
      const type: BodyComposition["type"] =
        typeValue === "Fat" || typeValue === "Water" || typeValue === "Bone"
          ? typeValue
          : "Muscle";

      return {
        type,
        percentage: Math.max(0, Math.min(100, safeNumber(item.percentage, 0))),
      };
    })
    .filter((item) => item.percentage > 0);
}

function toExerciseEffort(value: unknown): ExerciseEffort[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map((item) => ({
      date: safeString(item.date, "-"),
      caloriesBurned: Math.max(0, safeNumber(item.caloriesBurned, 0)),
      durationMinutes: Math.max(0, safeNumber(item.durationMinutes, 0)),
    }))
    .filter((item) => item.caloriesBurned > 0 || item.durationMinutes > 0);
}

export function sanitizeHealthReport(
  report: HealthReport | null | undefined,
): HealthReport | null {
  if (!report) {
    return null;
  }

  const source = report as unknown;
  if (!isObject(source)) {
    return defaultReport;
  }

  const profile = isObject(source.profile) ? source.profile : {};
  const summary = isObject(source.summary) ? source.summary : {};

  return {
    profile: {
      fullName: safeString(profile.fullName, defaultReport.profile.fullName),
      age: Math.max(0, safeNumber(profile.age, defaultReport.profile.age)),
      gender:
        safeString(profile.gender, defaultReport.profile.gender) === "female"
          ? "female"
          : safeString(profile.gender, defaultReport.profile.gender) === "other"
            ? "other"
            : "male",
      heightCm: Math.max(
        0,
        safeNumber(profile.heightCm, defaultReport.profile.heightCm),
      ),
      currentWeightKg: Math.max(
        0,
        safeNumber(
          profile.currentWeightKg,
          defaultReport.profile.currentWeightKg,
        ),
      ),
      goalWeightKg: Math.max(
        0,
        safeNumber(profile.goalWeightKg, defaultReport.profile.goalWeightKg),
      ),
      goal: safeString(profile.goal, defaultReport.profile.goal),
      exerciseMinutesPerDay: Math.max(
        0,
        safeNumber(
          profile.exerciseMinutesPerDay,
          defaultReport.profile.exerciseMinutesPerDay,
        ),
      ),
    },
    summary: {
      bmi: Math.max(0, safeNumber(summary.bmi, defaultReport.summary.bmi)),
      bodyFatPercent: Math.max(
        0,
        safeNumber(
          summary.bodyFatPercent,
          defaultReport.summary.bodyFatPercent,
        ),
      ),
      restingHeartRate: Math.max(
        0,
        safeNumber(
          summary.restingHeartRate,
          defaultReport.summary.restingHeartRate,
        ),
      ),
      bloodPressure: safeString(
        summary.bloodPressure,
        defaultReport.summary.bloodPressure,
      ),
      sleepHours: Math.max(
        0,
        safeNumber(summary.sleepHours, defaultReport.summary.sleepHours),
      ),
      healthSummaryParagraph: safeString(
        summary.healthSummaryParagraph,
        defaultReport.summary.healthSummaryParagraph,
      ),
    },
    exercises: toExerciseRecords(source.exercises),
    nutrition: toNutritionItems(source.nutrition),
    weightHistory: toWeightRecords(source.weightHistory),
    timeline: toTimelineEvents(source.timeline),
    activityComposition: toActivityComposition(source.activityComposition),
    bodyComposition: toBodyComposition(source.bodyComposition),
    exerciseEffort: toExerciseEffort(source.exerciseEffort),
  };
}

export function toNutritionChartData(
  items: NutritionItem[],
): NutritionChartDatum[] {
  return items
    .map((item) => ({
      label: item.type,
      value: Math.max(0, safeNumber(item.grams, 0)),
    }))
    .filter((item) => item.value > 0);
}

export function toWeightChartData(items: WeightRecord[]): WeightChartDatum[] {
  return items
    .map((item) => ({
      x: safeString(item.date, "-"),
      y: Math.max(0, safeNumber(item.weightKg, 0)),
    }))
    .filter((item) => item.y > 0);
}

export function toActivityCompositionData(
  items: ActivityComposition[],
): ActivityCompositionDatum[] {
  return items.map((item) => ({
    type: item.type,
    value: Math.max(0, safeNumber(item.percentage, 0)),
  }));
}

export function toBodyCompositionData(
  items: BodyComposition[],
): BodyCompositionDatum[] {
  return items.map((item) => ({
    type: item.type,
    value: Math.max(0, safeNumber(item.percentage, 0)),
  }));
}

export function toExerciseEffortData(
  items: ExerciseEffort[],
): ExerciseEffortDatum[] {
  return items.map((item) => ({
    date: safeString(item.date, "-"),
    calories: Math.max(0, safeNumber(item.caloriesBurned, 0)),
    duration: Math.max(0, safeNumber(item.durationMinutes, 0)),
  }));
}
