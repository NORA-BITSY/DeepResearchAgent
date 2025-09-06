import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/apiService';

interface ResearchTask {
  id: string;
  query: string;
  type: string;
  agents: string[];
  status: string;
  progress: number;
  results?: string;
  error?: string;
  startTime: Date;
  endTime?: Date;
}

interface ResearchState {
  currentTask: ResearchTask | null;
  taskHistory: ResearchTask[];
  isRunning: boolean;
  results: string | null;
  error: string | null;
}

const initialState: ResearchState = {
  currentTask: null,
  taskHistory: [],
  isRunning: false,
  results: null,
  error: null,
};

export const createResearchTask = createAsyncThunk(
  'research/createTask',
  async (taskConfig: any) => {
    const response = await apiService.createResearchTask(taskConfig);
    return response;
  }
);

export const cancelResearchTask = createAsyncThunk(
  'research/cancelTask',
  async (taskId: string) => {
    const response = await apiService.cancelTask(taskId);
    return response;
  }
);

const researchSlice = createSlice({
  name: 'research',
  initialState,
  reducers: {
    updateTaskProgress: (state, action: PayloadAction<{ taskId: string; progress: number; status: string }>) => {
      if (state.currentTask && state.currentTask.id === action.payload.taskId) {
        state.currentTask.progress = action.payload.progress;
        state.currentTask.status = action.payload.status;
      }
    },
    setResults: (state, action: PayloadAction<string>) => {
      state.results = action.payload;
      state.isRunning = false;
    },
    clearResults: (state) => {
      state.results = null;
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createResearchTask.pending, (state) => {
        state.isRunning = true;
        state.error = null;
        state.results = null;
      })
      .addCase(createResearchTask.fulfilled, (state, action) => {
        state.currentTask = action.payload;
      })
      .addCase(createResearchTask.rejected, (state, action) => {
        state.isRunning = false;
        state.error = action.error.message || 'Failed to create research task';
      })
      .addCase(cancelResearchTask.fulfilled, (state) => {
        state.isRunning = false;
        if (state.currentTask) {
          state.currentTask.status = 'cancelled';
        }
      });
  },
});

export const { updateTaskProgress, setResults, clearResults } = researchSlice.actions;
export default researchSlice.reducer;