import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, DataTable, Chip, useTheme } from 'react-native-paper';

export default function HistoryScreen() {
  const theme = useTheme();

  const history = [
    {
      id: '1',
      task: 'Market Analysis: EV Industry',
      type: 'research',
      agents: ['Planning', 'Researcher'],
      status: 'completed',
      duration: '2m 34s',
      date: '2024-01-15',
    },
    {
      id: '2',
      task: 'Code Review: Authentication',
      type: 'analysis',
      agents: ['Analyzer'],
      status: 'completed',
      duration: '1m 12s',
      date: '2024-01-15',
    },
    {
      id: '3',
      task: 'Web Scraping: News Articles',
      type: 'browser',
      agents: ['Browser'],
      status: 'failed',
      duration: '45s',
      date: '2024-01-14',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Research History</Title>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Task</DataTable.Title>
                <DataTable.Title>Type</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
                <DataTable.Title numeric>Duration</DataTable.Title>
              </DataTable.Header>

              {history.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>{item.task}</DataTable.Cell>
                  <DataTable.Cell>{item.type}</DataTable.Cell>
                  <DataTable.Cell>
                    <Chip
                      compact
                      mode="flat"
                      style={{
                        backgroundColor:
                          item.status === 'completed'
                            ? theme.colors.primaryContainer
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
      </ScrollView>
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
  card: {
    marginBottom: 16,
  },
});