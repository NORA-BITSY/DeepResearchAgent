import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
  Chip,
  SegmentedButtons,
  Surface,
  Text,
  useTheme,
  Switch,
  List,
  Dialog,
  Portal,
  RadioButton,
  ProgressBar,
  Snackbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createResearchTask } from '../store/researchSlice';
import MarkdownDisplay from 'react-native-markdown-display';

export default function ResearchTaskScreen({ navigation }: any) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isRunning, currentTask, results } = useAppSelector(
    (state) => state.research
  );

  const [taskInput, setTaskInput] = useState('');
  const [taskType, setTaskType] = useState('research');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [advancedOptions, setAdvancedOptions] = useState({
    maxDepth: 2,
    maxSteps: 10,
    timeout: 300,
    useMCP: true,
    useHierarchical: true,
  });
  const [showAgentDialog, setShowAgentDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const availableAgents = [
    { id: 'planning', name: 'Planning Agent', icon: 'chart-timeline' },
    { id: 'researcher', name: 'Deep Researcher', icon: 'magnify' },
    { id: 'analyzer', name: 'Deep Analyzer', icon: 'brain' },
    { id: 'browser', name: 'Browser Agent', icon: 'web' },
    { id: 'general', name: 'General Tool Agent', icon: 'toolbox' },
  ];

  const taskTemplates = [
    {
      title: 'Market Research',
      description: 'Analyze market trends and competitor landscape',
      query: 'Conduct a comprehensive market analysis of [INDUSTRY] including key players, trends, and opportunities',
    },
    {
      title: 'Technical Analysis',
      description: 'Deep dive into technical documentation and code',
      query: 'Analyze the technical architecture of [SYSTEM] and provide recommendations for improvements',
    },
    {
      title: 'Literature Review',
      description: 'Research academic papers and publications',
      query: 'Provide a literature review on [TOPIC] including recent developments and key findings',
    },
    {
      title: 'Data Analysis',
      description: 'Process and analyze data from various sources',
      query: 'Analyze the dataset at [URL] and provide insights on patterns and anomalies',
    },
  ];

  const handleStartTask = async () => {
    if (!taskInput.trim()) {
      setSnackbarVisible(true);
      return;
    }

    const taskConfig = {
      query: taskInput,
      type: taskType,
      agents: selectedAgents.length > 0 ? selectedAgents : ['planning'],
      options: advancedOptions,
    };

    dispatch(createResearchTask(taskConfig));
    setShowResults(true);
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!showResults ? (
          <>
            {/* Task Input */}
            <Card style={styles.card}>
              <Card.Content>
                <Title>Research Query</Title>
                <TextInput
                  mode="outlined"
                  placeholder="What would you like to research?"
                  value={taskInput}
                  onChangeText={setTaskInput}
                  multiline
                  numberOfLines={4}
                  style={styles.textInput}
                />
                
                {/* Task Type */}
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Task Type
                </Text>
                <SegmentedButtons
                  value={taskType}
                  onValueChange={setTaskType}
                  buttons={[
                    { value: 'research', label: 'Research', icon: 'magnify' },
                    { value: 'analysis', label: 'Analysis', icon: 'chart-line' },
                    { value: 'browser', label: 'Browser', icon: 'web' },
                    { value: 'general', label: 'General', icon: 'toolbox' },
                  ]}
                  style={styles.segmentedButtons}
                />
              </Card.Content>
            </Card>

            {/* Templates */}
            <Card style={styles.card}>
              <Card.Content>
                <Title>Quick Templates</Title>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.templateRow}>
                    {taskTemplates.map((template, index) => (
                      <Surface
                        key={index}
                        style={styles.templateCard}
                        elevation={1}
                      >
                        <Text variant="titleSmall">{template.title}</Text>
                        <Text variant="bodySmall" style={styles.templateDesc}>
                          {template.description}
                        </Text>
                        <Button
                          mode="text"
                          compact
                          onPress={() => setTaskInput(template.query)}
                        >
                          Use Template
                        </Button>
                      </Surface>
                    ))}
                  </View>
                </ScrollView>
              </Card.Content>
            </Card>

            {/* Agent Selection */}
            <Card style={styles.card}>
              <Card.Content>
                <Title>Agent Configuration</Title>
                <View style={styles.agentChips}>
                  {availableAgents.map((agent) => (
                    <Chip
                      key={agent.id}
                      icon={agent.icon}
                      selected={selectedAgents.includes(agent.id)}
                      onPress={() => toggleAgent(agent.id)}
                      style={styles.agentChip}
                    >
                      {agent.name}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>

            {/* Advanced Options */}
            <Card style={styles.card}>
              <Card.Content>
                <Title>Advanced Options</Title>
                <List.Section>
                  <List.Item
                    title="Use MCP Tools"
                    description="Enable Model Context Protocol tools"
                    left={(props) => <List.Icon {...props} icon="tools" />}
                    right={() => (
                      <Switch
                        value={advancedOptions.useMCP}
                        onValueChange={(v) =>
                          setAdvancedOptions({ ...advancedOptions, useMCP: v })
                        }
                      />
                    )}
                  />
                  <List.Item
                    title="Hierarchical Agents"
                    description="Use multi-layer agent coordination"
                    left={(props) => <List.Icon {...props} icon="sitemap" />}
                    right={() => (
                      <Switch
                        value={advancedOptions.useHierarchical}
                        onValueChange={(v) =>
                          setAdvancedOptions({
                            ...advancedOptions,
                            useHierarchical: v,
                          })
                        }
                      />
                    )}
                  />
                  <List.Item
                    title={`Max Depth: ${advancedOptions.maxDepth}`}
                    description="Research depth level"
                    left={(props) => <List.Icon {...props} icon="layers" />}
                  />
                  <List.Item
                    title={`Max Steps: ${advancedOptions.maxSteps}`}
                    description="Maximum execution steps"
                    left={(props) => <List.Icon {...props} icon="debug-step-over" />}
                  />
                  <List.Item
                    title={`Timeout: ${advancedOptions.timeout}s`}
                    description="Task timeout in seconds"
                    left={(props) => <List.Icon {...props} icon="timer" />}
                  />
                </List.Section>
              </Card.Content>
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={handleStartTask}
                icon="rocket"
                loading={isRunning}
                disabled={isRunning}
                style={styles.startButton}
              >
                Start Research
              </Button>
            </View>
          </>
        ) : (
          /* Results View */
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.resultsHeader}>
                <Title>Research Results</Title>
                <Button
                  mode="text"
                  onPress={() => setShowResults(false)}
                  icon="arrow-left"
                >
                  New Task
                </Button>
              </View>

              {isRunning && (
                <View style={styles.progressSection}>
                  <Text variant="titleMedium">Processing...</Text>
                  <ProgressBar progress={0.5} style={styles.progressBar} />
                  <Text variant="bodySmall" style={styles.progressText}>
                    {currentTask?.status || 'Initializing agents...'}
                  </Text>
                </View>
              )}

              {results && (
                <View style={styles.resultsContent}>
                  <Surface style={styles.resultsSurface} elevation={1}>
                    <MarkdownDisplay
                      style={{
                        body: { color: theme.colors.onSurface },
                        heading1: { color: theme.colors.primary },
                        heading2: { color: theme.colors.secondary },
                        link: { color: theme.colors.tertiary },
                        code_inline: {
                          backgroundColor: theme.colors.surfaceVariant,
                          color: theme.colors.onSurfaceVariant,
                        },
                      }}
                    >
                      {results}
                    </MarkdownDisplay>
                  </Surface>

                  <View style={styles.resultActions}>
                    <Button
                      mode="outlined"
                      icon="download"
                      onPress={() => {}}
                      style={styles.actionButton}
                    >
                      Export
                    </Button>
                    <Button
                      mode="outlined"
                      icon="share"
                      onPress={() => {}}
                      style={styles.actionButton}
                    >
                      Share
                    </Button>
                    <Button
                      mode="outlined"
                      icon="content-save"
                      onPress={() => {}}
                      style={styles.actionButton}
                    >
                      Save
                    </Button>
                  </View>
                </View>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Please enter a research query
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
  },
  textInput: {
    marginTop: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  templateRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  templateCard: {
    padding: 12,
    marginRight: 12,
    width: 200,
    borderRadius: 8,
  },
  templateDesc: {
    marginVertical: 4,
    opacity: 0.7,
  },
  agentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  agentChip: {
    margin: 4,
  },
  actionButtons: {
    marginTop: 16,
  },
  startButton: {
    paddingVertical: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSection: {
    marginVertical: 16,
  },
  progressBar: {
    marginVertical: 8,
  },
  progressText: {
    opacity: 0.7,
  },
  resultsContent: {
    marginTop: 16,
  },
  resultsSurface: {
    padding: 16,
    borderRadius: 8,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});