import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  Text,
  useTheme,
  List,
  Switch,
  IconButton,
  Dialog,
  Portal,
  TextInput,
  DataTable,
  Badge,
  ProgressBar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'error';
  model: string;
  tasksCompleted: number;
  successRate: number;
  avgResponseTime: string;
  enabled: boolean;
  description: string;
  tools: string[];
}

export default function AgentsScreen() {
  const theme = useTheme();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'planning',
      name: 'Planning Agent',
      type: 'planning_agent',
      status: 'active',
      model: 'claude-3-7-sonnet-thinking',
      tasksCompleted: 342,
      successRate: 96,
      avgResponseTime: '2.3s',
      enabled: true,
      description: 'Coordinates other agents and decomposes complex tasks',
      tools: ['managed_agent_tool'],
    },
    {
      id: 'researcher',
      name: 'Deep Researcher',
      type: 'deep_researcher_agent',
      status: 'active',
      model: 'claude-3-7-sonnet-thinking',
      tasksCompleted: 289,
      successRate: 94,
      avgResponseTime: '5.7s',
      enabled: true,
      description: 'Conducts extensive web searches and research',
      tools: ['deep_researcher_tool', 'python_interpreter_tool'],
    },
    {
      id: 'analyzer',
      name: 'Deep Analyzer',
      type: 'deep_analyzer_agent',
      status: 'idle',
      model: 'gemini-2.5-pro',
      tasksCompleted: 198,
      successRate: 92,
      avgResponseTime: '4.1s',
      enabled: true,
      description: 'Performs systematic analysis and data processing',
      tools: ['deep_analyzer_tool', 'python_interpreter_tool'],
    },
    {
      id: 'browser',
      name: 'Browser Agent',
      type: 'browser_use_agent',
      status: 'idle',
      model: 'gpt-4.1',
      tasksCompleted: 145,
      successRate: 89,
      avgResponseTime: '8.2s',
      enabled: true,
      description: 'Automates browser operations and web interactions',
      tools: ['auto_browser_use_tool', 'python_interpreter_tool'],
    },
    {
      id: 'general',
      name: 'General Tool Agent',
      type: 'general_tool_agent',
      status: 'idle',
      model: 'claude-3-7-sonnet-thinking',
      tasksCompleted: 267,
      successRate: 91,
      avgResponseTime: '3.5s',
      enabled: true,
      description: 'Handles general-purpose tasks with various tools',
      tools: ['web_fetcher_tool', 'web_searcher_tool', 'python_interpreter_tool'],
    },
  ]);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [configDialog, setConfigDialog] = useState(false);
  const [modelConfig, setModelConfig] = useState({
    temperature: 0.7,
    maxTokens: 4096,
    topP: 0.9,
  });

  const toggleAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, enabled: !agent.enabled } : agent
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.primary;
      case 'idle':
        return theme.colors.outline;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const openConfig = (agent: Agent) => {
    setSelectedAgent(agent);
    setConfigDialog(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Agent Overview */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Title>Agent Overview</Title>
            <View style={styles.overviewStats}>
              <Surface style={styles.overviewStat} elevation={1}>
                <Icon name="robot" size={24} color={theme.colors.primary} />
                <Text variant="headlineSmall">5</Text>
                <Text variant="bodySmall">Total Agents</Text>
              </Surface>
              <Surface style={styles.overviewStat} elevation={1}>
                <Icon name="check-circle" size={24} color={theme.colors.primary} />
                <Text variant="headlineSmall">3</Text>
                <Text variant="bodySmall">Active</Text>
              </Surface>
              <Surface style={styles.overviewStat} elevation={1}>
                <Icon name="chart-line" size={24} color={theme.colors.primary} />
                <Text variant="headlineSmall">92.4%</Text>
                <Text variant="bodySmall">Avg Success</Text>
              </Surface>
              <Surface style={styles.overviewStat} elevation={1}>
                <Icon name="clock-fast" size={24} color={theme.colors.primary} />
                <Text variant="headlineSmall">4.8s</Text>
                <Text variant="bodySmall">Avg Response</Text>
              </Surface>
            </View>
          </Card.Content>
        </Card>

        {/* Agent Cards */}
        {agents.map((agent) => (
          <Card key={agent.id} style={styles.agentCard}>
            <Card.Content>
              <View style={styles.agentHeader}>
                <View style={styles.agentTitle}>
                  <Title>{agent.name}</Title>
                  <View style={styles.statusBadge}>
                    <Badge
                      style={{
                        backgroundColor: getStatusColor(agent.status),
                      }}
                    />
                    <Text variant="bodySmall" style={styles.statusText}>
                      {agent.status}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={agent.enabled}
                  onValueChange={() => toggleAgent(agent.id)}
                />
              </View>

              <Paragraph style={styles.agentDescription}>
                {agent.description}
              </Paragraph>

              <View style={styles.agentInfo}>
                <Chip icon="brain" compact style={styles.infoChip}>
                  {agent.model}
                </Chip>
                <Chip icon="toolbox" compact style={styles.infoChip}>
                  {agent.tools.length} tools
                </Chip>
              </View>

              {/* Stats Table */}
              <Surface style={styles.statsTable} elevation={1}>
                <View style={styles.statRow}>
                  <Text variant="bodyMedium">Tasks Completed</Text>
                  <Text variant="bodyMedium" style={styles.statValue}>
                    {agent.tasksCompleted}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text variant="bodyMedium">Success Rate</Text>
                  <View style={styles.statValueContainer}>
                    <Text variant="bodyMedium" style={styles.statValue}>
                      {agent.successRate}%
                    </Text>
                    <ProgressBar
                      progress={agent.successRate / 100}
                      style={styles.miniProgress}
                    />
                  </View>
                </View>
                <View style={styles.statRow}>
                  <Text variant="bodyMedium">Avg Response Time</Text>
                  <Text variant="bodyMedium" style={styles.statValue}>
                    {agent.avgResponseTime}
                  </Text>
                </View>
              </Surface>

              {/* Tools */}
              <View style={styles.toolsSection}>
                <Text variant="titleSmall">Available Tools</Text>
                <View style={styles.toolChips}>
                  {agent.tools.map((tool, index) => (
                    <Chip
                      key={index}
                      compact
                      mode="outlined"
                      style={styles.toolChip}
                    >
                      {tool.replace(/_/g, ' ')}
                    </Chip>
                  ))}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.agentActions}>
                <Button
                  mode="outlined"
                  onPress={() => openConfig(agent)}
                  icon="cog"
                >
                  Configure
                </Button>
                <Button mode="outlined" icon="chart-box">
                  View Logs
                </Button>
                <Button mode="outlined" icon="restart">
                  Restart
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Add New Agent */}
        <Card style={styles.addCard}>
          <Card.Content>
            <View style={styles.addContent}>
              <Icon name="plus-circle" size={48} color={theme.colors.primary} />
              <Title>Add New Agent</Title>
              <Paragraph>Configure a custom agent for specific tasks</Paragraph>
              <Button mode="contained" icon="plus" style={styles.addButton}>
                Create Agent
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Configuration Dialog */}
      <Portal>
        <Dialog visible={configDialog} onDismiss={() => setConfigDialog(false)}>
          <Dialog.Title>Agent Configuration</Dialog.Title>
          <Dialog.Content>
            <Text variant="titleMedium">{selectedAgent?.name}</Text>
            <TextInput
              label="Model"
              value={selectedAgent?.model}
              mode="outlined"
              style={styles.configInput}
            />
            <TextInput
              label="Temperature"
              value={modelConfig.temperature.toString()}
              mode="outlined"
              keyboardType="numeric"
              style={styles.configInput}
            />
            <TextInput
              label="Max Tokens"
              value={modelConfig.maxTokens.toString()}
              mode="outlined"
              keyboardType="numeric"
              style={styles.configInput}
            />
            <TextInput
              label="Top P"
              value={modelConfig.topP.toString()}
              mode="outlined"
              keyboardType="numeric"
              style={styles.configInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfigDialog(false)}>Cancel</Button>
            <Button onPress={() => setConfigDialog(false)}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  overviewCard: {
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  overviewStat: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 150 : 70,
    padding: 12,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  agentCard: {
    marginBottom: 16,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentTitle: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  agentDescription: {
    marginVertical: 8,
    opacity: 0.8,
  },
  agentInfo: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  infoChip: {
    marginRight: 8,
  },
  statsTable: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniProgress: {
    width: 50,
    height: 4,
    marginLeft: 8,
  },
  toolsSection: {
    marginVertical: 12,
  },
  toolChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  toolChip: {
    margin: 4,
  },
  agentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  addCard: {
    marginBottom: 16,
  },
  addContent: {
    alignItems: 'center',
    padding: 24,
  },
  addButton: {
    marginTop: 16,
  },
  configInput: {
    marginVertical: 8,
  },
});