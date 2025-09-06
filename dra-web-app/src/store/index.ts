import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import researchReducer from './researchSlice';
import agentsReducer from './agentsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    research: researchReducer,
    agents: agentsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;