import type { HealthFormValues, HealthReport } from "../types/healthReport";

const baseReport: HealthReport = {
  profile: {
    fullName: "Nguyen Van A",
    age: 29,
    gender: "male",
    heightCm: 172,
    currentWeightKg: 72,
    goalWeightKg: 68,
    goal: "Reduce 4kg in 8 weeks and improve cardiovascular endurance.",
    exerciseMinutesPerDay: 60,
  },
  summary: {
    bmi: 24.3,
    bodyFatPercent: 21.4,
    restingHeartRate: 68,
    bloodPressure: "118/76",
    sleepHours: 7.2,
    healthSummaryParagraph:
      "Overall health indicators are stable. BMI is 24.3, which is within a healthy range, while heart rate, blood pressure, and sleep suggest balanced recovery and cardiovascular status.",
  },

  exercises: [
    {
      id: "ex-1",
      date: "2026-03-24",
      activity: "Running",
      durationMinutes: 40,
      caloriesBurned: 410,
      intensity: "High",
    },
    {
      id: "ex-2",
      date: "2026-03-25",
      activity: "Strength Training",
      durationMinutes: 50,
      caloriesBurned: 360,
      intensity: "Moderate",
    },
    {
      id: "ex-3",
      date: "2026-03-27",
      activity: "Cycling",
      durationMinutes: 35,
      caloriesBurned: 280,
      intensity: "Moderate",
    },
    {
      id: "ex-4",
      date: "2026-03-29",
      activity: "Yoga",
      durationMinutes: 45,
      caloriesBurned: 170,
      intensity: "Low",
    },
  ],
  nutrition: [
    { type: "Protein", grams: 120 },
    { type: "Carbs", grams: 250 },
    { type: "Fat", grams: 65 },
  ],
  weightHistory: [
    { date: "2026-03-01", weightKg: 74.2 },
    { date: "2026-03-08", weightKg: 73.8 },
    { date: "2026-03-15", weightKg: 73.4 },
    { date: "2026-03-22", weightKg: 72.8 },
    { date: "2026-03-29", weightKg: 72.1 },
  ],
  timeline: [
    {
      id: "tm-1",
      date: "2026-03-10",
      title: "Initial assessment",
      detail: "Started baseline program with 4 workout sessions per week.",
    },
    {
      id: "tm-2",
      date: "2026-03-17",
      title: "Nutrition adjustment",
      detail: "Reduced sugar intake and raised protein target to 120g/day.",
    },
    {
      id: "tm-3",
      date: "2026-03-25",
      title: "Performance checkpoint",
      detail: "5km run time improved by 2 minutes.",
    },
  ],
  activityComposition: [
    { type: "Cardio", percentage: 40, minutes: 120 },
    { type: "Strength", percentage: 35, minutes: 105 },
    { type: "Stretching", percentage: 15, minutes: 45 },
    { type: "Rest", percentage: 10, minutes: 30 },
  ],
  bodyComposition: [
    { type: "Muscle", percentage: 45 },
    { type: "Fat", percentage: 21 },
    { type: "Water", percentage: 24 },
    { type: "Bone", percentage: 10 },
  ],
  exerciseEffort: [
    { date: "2026-03-24", caloriesBurned: 410, durationMinutes: 40 },
    { date: "2026-03-25", caloriesBurned: 360, durationMinutes: 50 },
    { date: "2026-03-27", caloriesBurned: 280, durationMinutes: 35 },
    { date: "2026-03-29", caloriesBurned: 170, durationMinutes: 45 },
  ],
};

export function getMockReport(): HealthReport {
  return structuredClone(baseReport);
}

export function buildReportFromForm(values: HealthFormValues): HealthReport {
  const cloned = structuredClone(baseReport);
  const bmi = Number(
    (values.currentWeightKg / (values.heightCm / 100) ** 2).toFixed(1),
  );

  cloned.profile = {
    ...values,
  };

  cloned.summary.bmi = bmi;
  cloned.summary.healthSummaryParagraph = `${values.fullName} has an updated BMI of ${bmi}. Overall progress is steady toward the goal weight with consistent exercise commitment.`;
  cloned.weightHistory = [
    ...cloned.weightHistory.slice(0, -1),
    {
      date: "2026-03-31",
      weightKg: values.currentWeightKg,
    },
  ];

  cloned.timeline = [
    {
      id: "tm-form",
      date: "2026-03-31",
      title: "Form updated",
      detail: `Profile updated for ${values.fullName}. Goal: ${values.goal}`,
    },
    ...cloned.timeline,
  ];

  return cloned;
}
