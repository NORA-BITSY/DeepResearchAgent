import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  Text,
  ProgressBar,
  Chip,
  useTheme,
  AnimatedFAB,
  DataTable,
} from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchDashboardData } from '../store/dashboardSlice';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }: any) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { stats, recentTasks, agentStatus, isLoading } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
    const interval = setInterval(() => {
      dispatch(fetchDashboardData());
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surfaceVariant,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: (opacity = 1) => theme.colors.onSurface,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [85, 88, 92, 87, 90, 93, 91],
        strokeWidth: 2,
      },
    ],
  };

  const taskDistribution = {
    labels: ['Research', 'Analysis', 'Browser', 'General'],
    datasets: [
      {
        data: [45, 30, 15, 10],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content>
              <View style={styles.statContent}>
                <Icon name="check-circle" size={32} color={theme.colors.primary} />
                <View style={styles.statText}>
                  <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                    {stats?.completedTasks || 142}
                  </Text>
                  <Text variant="bodySmall">Completed Tasks</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Card.Content>
              <View style={styles.statContent}>
                <Icon name="robot" size={32} color={theme.colors.secondary} />
                <View style={styles.statText}>
                  <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
                    {stats?.activeAgents || 5}
                  </Text>
                  <Text variant="bodySmall">Active Agents</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Card.Content>
              <View style={styles.statContent}>
                <Icon name="chart-line" size={32} color={theme.colors.tertiary} />
                <View style={styles.statText}>
                  <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>
                    {stats?.successRate || '94%'}
                  </Text>
                  <Text variant="bodySmall">Success Rate</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Performance Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Weekly Performance</Title>
            <View style={styles.chart}>
              <LineChart
                data={performanceData}
                width={screenWidth - 64}
                height={200}
                chartConfig={chartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Agent Status */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Agent Status</Title>
            <View style={styles.agentGrid}>
              {[
                { name: 'Planning Agent', status: 'active', tasks: 3 },
                { name: 'Deep Researcher', status: 'active', tasks: 2 },
                { name: 'Deep Analyzer', status: 'idle', tasks: 0 },
                { name: 'Browser Agent', status: 'active', tasks: 1 },
                { name: 'General Tool Agent', status: 'idle', tasks: 0 },
              ].map((agent, index) => (
                <Surface key={index} style={styles.agentCard} elevation={1}>
                  <View style={styles.agentHeader}>
                    <Text variant="titleMedium">{agent.name}</Text>
                    <Chip
                      mode="flat"
                      compact
                      style={{
                        backgroundColor:
                          agent.status === 'active'
                            ? theme.colors.primaryContainer
                            : theme.colors.surfaceVariant,
                      }}
                    >
                      {agent.status}
                    </Chip>
                  </View>
                  {agent.tasks > 0 && (
                    <View style={styles.agentTasks}>
                      <Text variant="bodySmall">{agent.tasks} active tasks</Text>
                      <ProgressBar progress={0.6} style={styles.progressBar} />
                    </View>
                  )}
                </Surface>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Recent Tasks */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Research Tasks</Title>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Task</DataTable.Title>
                <DataTable.Title>Agent</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
                <DataTable.Title numeric>Duration</DataTable.Title>
              </DataTable.Header>

              {[
                {
                  task: 'Market Analysis: EV Industry',
                  agent: 'Deep Researcher',
                  status: 'completed',
                  duration: '2m 34s',
                },
                {
                  task: 'Code Review: Authentication',
                  agent: 'Deep Analyzer',
                  status: 'completed',
                  duration: '1m 12s',
                },
                {
                  task: 'Web Scraping: News Articles',
                  agent: 'Browser Agent',
                  status: 'in_progress',
                  duration: '45s',
                },
                {
                  task: 'Data Processing: CSV Files',
                  agent: 'General Tool',
                  status: 'completed',
                  duration: '3m 21s',
                },
              ].map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{item.task}</DataTable.Cell>
                  <DataTable.Cell>{item.agent}</DataTable.Cell>
                  <DataTable.Cell>
                    <Chip
                      compact
                      mode="flat"
                      style={{
                        backgroundColor:
                          item.status === 'completed'
                            ? theme.colors.primaryContainer
                            : item.status === 'in_progress'
                            ? theme.colors.secondaryContainer
                            : theme.colors.errorContainer,
                      }}
                    >
                      {item.status}
                    </Chip>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item.duration}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>

        {/* Task Distribution */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Task Distribution</Title>
            <View style={styles.chart}>
              <BarChart
                data={taskDistribution}
                width={screenWidth - 64}
                height={200}
                chartConfig={chartConfig}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                yAxisLabel=""
                yAxisSuffix="%"
              />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <AnimatedFAB
        icon="plus"
        label="New Task"
        extended={true}
        onPress={() => navigation.navigate('ResearchTask')}
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
        color={theme.colors.onPrimary}
      />
    </View>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 200 : 100,
    margin: 4,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
  },
  card: {
    marginBottom: 16,
  },
  chartCard: {
    marginBottom: 16,
  },
  chart: {
    marginTop: 16,
    alignItems: 'center',
  },
  agentGrid: {
    marginTop: 12,
  },
  agentCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentTasks: {
    marginTop: 8,
  },
  progressBar: {
    marginTop: 4,
    height: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});