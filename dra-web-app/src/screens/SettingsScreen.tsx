import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, List, Switch, TextInput, Button, useTheme } from 'react-native-paper';

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>API Configuration</Title>
            <TextInput
              label="OpenAI API Key"
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              label="Anthropic API Key"
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              label="Google API Key"
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>General Settings</Title>
            <List.Section>
              <List.Item
                title="Use Hierarchical Agents"
                left={(props) => <List.Icon {...props} icon="sitemap" />}
                right={() => <Switch value={true} />}
              />
              <List.Item
                title="Enable MCP Tools"
                left={(props) => <List.Icon {...props} icon="tools" />}
                right={() => <Switch value={true} />}
              />
              <List.Item
                title="Auto-save Results"
                left={(props) => <List.Icon {...props} icon="content-save" />}
                right={() => <Switch value={false} />}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Performance</Title>
            <TextInput
              label="Max Concurrent Tasks"
              mode="outlined"
              keyboardType="numeric"
              defaultValue="5"
              style={styles.input}
            />
            <TextInput
              label="Task Timeout (seconds)"
              mode="outlined"
              keyboardType="numeric"
              defaultValue="300"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Button mode="contained" style={styles.saveButton}>
          Save Settings
        </Button>
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
  input: {
    marginVertical: 8,
  },
  saveButton: {
    marginTop: 16,
  },
});