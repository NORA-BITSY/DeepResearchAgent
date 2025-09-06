# DeepResearchAgent Web Interface

A modern, cross-platform GUI for DeepResearchAgent built with React Native for Web, iOS, and Android.

![DeepResearchAgent Web Interface](./screenshots/dashboard.png)

## 🚀 Features

- **Multi-Platform**: Single codebase for Web, iOS, and Android
- **Real-time Updates**: WebSocket integration for live task progress
- **Agent Management**: Monitor and control all agents from one interface
- **MCP Tools Integration**: Manage and configure MCP tools visually
- **Research Tasks**: Create, monitor, and export research tasks
- **Dark Mode**: Automatic theme switching based on system preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## 📱 Screenshots

| Dashboard | Research Task | Agent Management |
|-----------|---------------|------------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Research](./screenshots/research.png) | ![Agents](./screenshots/agents.png) |

## 🛠 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+ (for backend)
- Expo CLI: `npm install -g expo-cli`

### Quick Start

1. **Clone and navigate to the web app:**
   ```bash
   cd DeepResearchAgent/dra-web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the backend server:**
   ```bash
   # In the main DeepResearchAgent directory
   cd ..
   python api_server.py
   ```

5. **Run the web app:**
   ```bash
   # For web
   npm run web

   # For iOS (Mac only)
   npm run ios

   # For Android
   npm run android
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000

# Features
REACT_APP_ENABLE_MCP=true
REACT_APP_ENABLE_HIERARCHICAL=true

# Theme
REACT_APP_DEFAULT_THEME=auto
```

### API Endpoints

The app expects the following backend endpoints:

- `/api/dashboard` - Dashboard statistics
- `/api/research/task` - Create research tasks
- `/api/agents` - Agent management
- `/api/mcp/tools` - MCP tools configuration
- `/api/settings` - Application settings

## 🏗 Architecture

```
dra-web-app/
├── src/
│   ├── screens/          # Screen components
│   │   ├── DashboardScreen.tsx
│   │   ├── ResearchTaskScreen.tsx
│   │   ├── AgentsScreen.tsx
│   │   └── MCPToolsScreen.tsx
│   ├── components/       # Reusable components
│   ├── services/         # API services
│   │   └── apiService.ts
│   ├── store/           # Redux state management
│   │   ├── index.ts
│   │   └── slices/
│   └── utils/           # Utility functions
├── App.tsx              # Main app component
└── package.json
```

## 🎨 UI Components

The app uses **React Native Paper** for Material Design 3 components:

- Cards for content organization
- FAB for primary actions
- Chips for filters and tags
- DataTables for structured data
- Charts for visualizations

## 📊 State Management

Redux Toolkit is used for state management:

```typescript
// Example: Dispatching a research task
dispatch(createResearchTask({
  query: "Analyze market trends",
  type: "research",
  agents: ["planning", "researcher"],
  options: { useMCP: true }
}));
```

## 🔌 WebSocket Integration

Real-time updates via Socket.io:

```typescript
// Subscribe to task updates
apiService.connectWebSocket((data) => {
  if (data.type === 'task_update') {
    dispatch(updateTaskProgress(data));
  }
});
```

## 📱 Platform-Specific Features

### Web
- Responsive layout
- Keyboard shortcuts
- Download/export functionality

### Mobile (iOS/Android)
- Native navigation gestures
- Push notifications
- Biometric authentication (optional)

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📦 Building for Production

### Web Build
```bash
npm run build:web
# Output in dist/
```

### iOS Build
```bash
expo build:ios
```

### Android Build
```bash
expo build:android
```

## 🚀 Deployment

### Web Deployment

1. **Build the app:**
   ```bash
   npm run build:web
   ```

2. **Deploy to your hosting service:**
   - Vercel: `vercel deploy dist/`
   - Netlify: Drag & drop `dist/` folder
   - AWS S3: `aws s3 sync dist/ s3://your-bucket`

### Mobile Deployment

Follow Expo's guide for deploying to App Store and Google Play.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- GitHub Issues: [Create an issue](https://github.com/SkyworkAI/DeepResearchAgent/issues)
- Documentation: [Read the docs](https://skyworkai.github.io/DeepResearchAgent/)

## 🙏 Acknowledgments

- Built with React Native and Expo
- UI components from React Native Paper
- Charts from react-native-chart-kit
- State management with Redux Toolkit