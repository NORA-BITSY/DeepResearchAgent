import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  apiKeys: Record<string, string>;
  general: {
    useHierarchical: boolean;
    enableMCP: boolean;
    autoSave: boolean;
  };
  performance: {
    maxConcurrentTasks: number;
    taskTimeout: number;
  };
  theme: 'light' | 'dark' | 'auto';
}

const initialState: SettingsState = {
  apiKeys: {},
  general: {
    useHierarchical: true,
    enableMCP: true,
    autoSave: false,
  },
  performance: {
    maxConcurrentTasks: 5,
    taskTimeout: 300,
  },
  theme: 'auto',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateApiKey: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.apiKeys[action.payload.key] = action.payload.value;
    },
    updateGeneralSettings: (state, action: PayloadAction<Partial<SettingsState['general']>>) => {
      state.general = { ...state.general, ...action.payload };
    },
    updatePerformanceSettings: (state, action: PayloadAction<Partial<SettingsState['performance']>>) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    setTheme: (state, action: PayloadAction<SettingsState['theme']>) => {
      state.theme = action.payload;
    },
  },
});

export const { updateApiKey, updateGeneralSettings, updatePerformanceSettings, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;