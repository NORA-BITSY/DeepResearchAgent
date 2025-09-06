import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { store } from './src/store';
import DashboardScreen from './src/screens/DashboardScreen';
import ResearchTaskScreen from './src/screens/ResearchTaskScreen';
import AgentsScreen from './src/screens/AgentsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MCPToolsScreen from './src/screens/MCPToolsScreen';
import DrawerContent from './src/components/DrawerContent';

const Drawer = createDrawerNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#2563eb',
      secondary: '#7c3aed',
      tertiary: '#dc2626',
      background: colorScheme === 'dark' ? '#0f172a' : '#f8fafc',
      surface: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
      surfaceVariant: colorScheme === 'dark' ? '#334155' : '#f1f5f9',
    },
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={customTheme}>
        <NavigationContainer>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Drawer.Navigator
            initialRouteName="Dashboard"
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
              headerStyle: {
                backgroundColor: customTheme.colors.surface,
              },
              headerTintColor: customTheme.colors.onSurface,
              drawerStyle: {
                backgroundColor: customTheme.colors.surface,
                width: 280,
              },
            }}
          >
            <Drawer.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                title: 'Dashboard',
                headerTitle: 'DeepResearchAgent',
              }}
            />
            <Drawer.Screen
              name="ResearchTask"
              component={ResearchTaskScreen}
              options={{
                title: 'New Research Task',
              }}
            />
            <Drawer.Screen
              name="Agents"
              component={AgentsScreen}
              options={{
                title: 'Agent Management',
              }}
            />
            <Drawer.Screen
              name="MCPTools"
              component={MCPToolsScreen}
              options={{
                title: 'MCP Tools',
              }}
            />
            <Drawer.Screen
              name="History"
              component={HistoryScreen}
              options={{
                title: 'Research History',
              }}
            />
            <Drawer.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: 'Settings',
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}