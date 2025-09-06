import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

class ApiService {
  private axiosInstance;
  private socket: any;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          AsyncStorage.removeItem('authToken');
        }
        return Promise.reject(error);
      }
    );
  }

  // WebSocket connection for real-time updates
  connectWebSocket(onMessage: (data: any) => void) {
    this.socket = io(WS_URL);
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('task_update', onMessage);
    this.socket.on('agent_status', onMessage);
    
    return () => {
      if (this.socket) {
        this.socket.disconnect();
      }
    };
  }

  // Dashboard endpoints
  async getDashboardData() {
    const response = await this.axiosInstance.get('/api/dashboard');
    return response.data;
  }

  // Research task endpoints
  async createResearchTask(taskConfig: any) {
    const response = await this.axiosInstance.post('/api/research/task', taskConfig);
    return response.data;
  }

  async getTaskStatus(taskId: string) {
    const response = await this.axiosInstance.get(`/api/research/task/${taskId}`);
    return response.data;
  }

  async getTaskHistory(limit = 50) {
    const response = await this.axiosInstance.get('/api/research/history', {
      params: { limit },
    });
    return response.data;
  }

  async cancelTask(taskId: string) {
    const response = await this.axiosInstance.post(`/api/research/task/${taskId}/cancel`);
    return response.data;
  }

  // Agent endpoints
  async getAgents() {
    const response = await this.axiosInstance.get('/api/agents');
    return response.data;
  }

  async getAgentStatus(agentId: string) {
    const response = await this.axiosInstance.get(`/api/agents/${agentId}/status`);
    return response.data;
  }

  async updateAgentConfig(agentId: string, config: any) {
    const response = await this.axiosInstance.put(`/api/agents/${agentId}/config`, config);
    return response.data;
  }

  async restartAgent(agentId: string) {
    const response = await this.axiosInstance.post(`/api/agents/${agentId}/restart`);
    return response.data;
  }

  async toggleAgent(agentId: string, enabled: boolean) {
    const response = await this.axiosInstance.post(`/api/agents/${agentId}/toggle`, {
      enabled,
    });
    return response.data;
  }

  // MCP Tools endpoints
  async getMCPTools() {
    const response = await this.axiosInstance.get('/api/mcp/tools');
    return response.data;
  }

  async registerMCPTool(toolConfig: any) {
    const response = await this.axiosInstance.post('/api/mcp/tools/register', toolConfig);
    return response.data;
  }

  async testMCPTool(toolId: string) {
    const response = await this.axiosInstance.post(`/api/mcp/tools/${toolId}/test`);
    return response.data;
  }

  // Settings endpoints
  async getSettings() {
    const response = await this.axiosInstance.get('/api/settings');
    return response.data;
  }

  async updateSettings(settings: any) {
    const response = await this.axiosInstance.put('/api/settings', settings);
    return response.data;
  }

  async getAPIKeys() {
    const response = await this.axiosInstance.get('/api/settings/api-keys');
    return response.data;
  }

  async updateAPIKey(keyName: string, value: string) {
    const response = await this.axiosInstance.put('/api/settings/api-keys', {
      key: keyName,
      value,
    });
    return response.data;
  }

  // Export/Import endpoints
  async exportResults(taskId: string, format: 'json' | 'markdown' | 'pdf') {
    const response = await this.axiosInstance.get(`/api/export/${taskId}`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }

  async importConfig(configFile: File) {
    const formData = new FormData();
    formData.append('config', configFile);
    const response = await this.axiosInstance.post('/api/import/config', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.axiosInstance.get('/api/health');
    return response.data;
  }
}

export const apiService = new ApiService();