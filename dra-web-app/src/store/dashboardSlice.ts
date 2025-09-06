import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/apiService';

interface DashboardState {
  stats: {
    completedTasks: number;
    activeAgents: number;
    successRate: string;
    totalResearchTime: string;
  } | null;
  recentTasks: any[];
  agentStatus: any[];
  performanceMetrics: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  recentTasks: [],
  agentStatus: [],
  performanceMetrics: null,
  isLoading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    const response = await apiService.getDashboardData();
    return response;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateStats: (state, action: PayloadAction<any>) => {
      state.stats = action.payload;
    },
    updateAgentStatus: (state, action: PayloadAction<any[]>) => {
      state.agentStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.recentTasks = action.payload.recentTasks;
        state.agentStatus = action.payload.agentStatus;
        state.performanceMetrics = action.payload.performanceMetrics;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { updateStats, updateAgentStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;