import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AgentsState {
  agents: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AgentsState = {
  agents: [],
  isLoading: false,
  error: null,
};

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setAgents: (state, action: PayloadAction<any[]>) => {
      state.agents = action.payload;
    },
    updateAgentStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const agent = state.agents.find(a => a.id === action.payload.id);
      if (agent) {
        agent.status = action.payload.status;
      }
    },
  },
});

export const { setAgents, updateAgentStatus } = agentsSlice.actions;
export default agentsSlice.reducer;