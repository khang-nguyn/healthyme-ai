import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  callOpenAiService,
  LlmApiError,
  LlmInvalidJsonError,
} from "../services/llmService";
import type {
  HealthFormValues,
  HealthReport,
} from "../types/healthReport.type";
import type { RootState } from "./index";
import { HEALTH_REPORT_PROMPT } from "@/prompt/healthReportPrompt";

interface HealthState {
  loading: boolean;
  reportData: HealthReport | null;
  error: string | null;
}

const initialState: HealthState = {
  loading: false,
  reportData: null,
  error: null,
};

export const generateHealthReport = createAsyncThunk<
  HealthReport,
  HealthFormValues,
  { rejectValue: string }
>("health/generateHealthReport", async (formValues, { rejectWithValue }) => {
  try {
    const llmInput = {
      fullName: formValues.fullName,
      age: formValues.age,
      gender: formValues.gender,
      heightCm: formValues.heightCm,
      currentWeightKg: formValues.currentWeightKg,
      goalWeightKg: formValues.goalWeightKg,
      exerciseMinutesPerDay: formValues.exerciseMinutesPerDay,
    };

    const report = await callOpenAiService<HealthReport>({
      prompt: HEALTH_REPORT_PROMPT,
      userInput: JSON.stringify(llmInput),
    });

    return report;
  } catch (error) {
    if (error instanceof LlmInvalidJsonError) {
      return rejectWithValue("Invalid JSON returned from OpenAI API.");
    }

    if (error instanceof LlmApiError) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Unknown error while generating report.");
  }
});

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    clearHealthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateHealthReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateHealthReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(generateHealthReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to generate report.";
      });
  },
});

export const { clearHealthError } = healthSlice.actions;

export const selectHealthLoading = (state: RootState) => state.health.loading;
export const selectHealthReport = (state: RootState) => state.health.reportData;
export const selectHealthError = (state: RootState) => state.health.error;
export const selectHasHealthReport = (state: RootState) =>
  Boolean(state.health.reportData);

export default healthSlice.reducer;
