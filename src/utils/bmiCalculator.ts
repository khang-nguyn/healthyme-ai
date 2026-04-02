export const BMI_UNDERWEIGHT = 18.5;
export const BMI_WARNING_OVERWEIGHT = 25;
export const BMI_OBESITY = 30;

export function calculateBmi(heightCm: number, weightKg: number): number {
  const heightMeter = heightCm / 100;
  return weightKg / (heightMeter * heightMeter);
}

export function getWeightThresholdByBmi(heightCm: number) {
  const heightMeter = heightCm / 100;
  const meterSquare = heightMeter * heightMeter;

  return {
    underweightKg: BMI_UNDERWEIGHT * meterSquare,
    overweightKg: BMI_WARNING_OVERWEIGHT * meterSquare,
    obesityKg: BMI_OBESITY * meterSquare,
  };
}

export function formatKg(value: number): string {
  return value.toFixed(1);
}

export function getBmiStatus(bmi: number): string {
  if (bmi < BMI_UNDERWEIGHT) {
    return "Underweight";
  }
  if (bmi < BMI_WARNING_OVERWEIGHT) {
    return "Healthy";
  }
  if (bmi < BMI_OBESITY) {
    return "Overweight";
  }
  return "Obesity";
}
