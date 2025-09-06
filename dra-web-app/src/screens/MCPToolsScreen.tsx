import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
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
  FAB,
  Searchbar,
  Badge,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MCPTool {
  id: string;
  name: string;
  type: 'search' | 'crawl' | 'memory' | 'document' | 'integration';
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  command: string;
  apiKeyRequired: boolean;
  enabled: boolean;
}

export default function MCPToolsScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [addToolDialog, setAddToolDialog] = useState(false);
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);

  const mcpTools: MCPTool[] = [
    {
      id: 'tavily',
      name: 'Tavily Search',
      type: 'search',
      status: 'connected',
      description: 'Real-time web search with extract/map/crawl capabilities',
      command: 'npx -y @tavily/mcp',
      apiKeyRequired: true,
      enabled: true,
    },
    {
      id: 'exa',
      name: 'Exa Precision Search',
      type: 'search',
      status: 'connected',
      description: 'High-quality search with fresh web sets',
      command: 'npx -y exa-mcp',
      apiKeyRequired: true,
      enabled: true,
    },
    {
      id: 'firecrawl',
      name: 'Firecrawl',
      type: 'crawl',
      status: 'connected',
      description: 'JS rendering, site-level crawl, batch extraction',
      command: 'npx -y firecrawl-mcp-server',
      apiKeyRequired: true,
      enabled: true,
    },
    {
      id: 'qdrant',
      name: 'Qdrant Memory',
      type: 'memory',
      status: 'disconnected',
      description: 'Semantic memory layer for persistence',
      command: 'uvx mcp-server-qdrant',
      apiKeyRequired: false,
      enabled: false,
    },
    {
      id: 'markitdown',
      name: 'MarkItDown',
      type: 'document',
      status: 'connected',
      description: 'Convert PDF, DOCX, PPTX to Markdown',
      command: 'uvx markitdown-mcp-server',
      apiKeyRequired: false,
      enabled: true,
    },
    {
      id: 'github',
      name: 'GitHub Integration',
      type: 'integration',
      status: 'disconnected',
      description: 'Access issues, PRs, files from repositories',
      command: 'npx -y @modelcontextprotocol/server-github',
      apiKeyRequired: true,
      enabled: false,
    },
  ];

  const filteredTools = mcpTools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || tool.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return theme.colors.primary;
      case 'disconnected':
        return theme.colors.outline;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'search':
        return 'magnify';
      case 'crawl':
        return 'spider-web';
      case 'memory':
        return 'database';
      case 'document':
        return 'file-document';
      case 'integration':
        return 'link-variant';
      default:
        return 'tools';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search and Filters */}
        <Card style={styles.searchCard}>
          <Card.Content>
            <Searchbar
              placeholder="Search MCP tools..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                <Chip
                  selected={selectedType === null}
                  onPress={() => setSelectedType(null)}
                  style={styles.filterChip}
                >
                  All
                </Chip>
                {['search', 'crawl', 'memory', 'document', 'integration'].map((type) => (
                  <Chip
                    key={type}
                    icon={getTypeIcon(type)}
                    selected={selectedType === type}
                    onPress={() => setSelectedType(type)}
                    style={styles.filterChip}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Chip>
                ))}
              </View>
            </ScrollView>
          </Card.Content>
        </Card>

        {/* MCP Tools List */}
        {filteredTools.map((tool) => (
          <Card key={tool.id} style={styles.toolCard}>
            <Card.Content>
              <View style={styles.toolHeader}>
                <View style={styles.toolTitle}>
                  <Icon
                    name={getTypeIcon(tool.type)}
                    size={24}
                    color={theme.colors.primary}
                  />
                  <View style={styles.toolInfo}>
                    <Title>{tool.name}</Title>
                    <View style={styles.statusRow}>
                      <Badge
                        style={{
                          backgroundColor: getStatusColor(tool.status),
                        }}
                      />
                      <Text variant="bodySmall" style={styles.statusText}>
                        {tool.status}
                      </Text>
                      {tool.apiKeyRequired && (
                        <Chip compact mode="outlined" style={styles.apiChip}>
                          API Key Required
                        </Chip>
                      )}
                    </View>
                  </View>
                </View>
                <Switch
                  value={tool.enabled}
                  onValueChange={() => {}}
                />
              </View>

              <Paragraph style={styles.toolDescription}>
                {tool.description}
              </Paragraph>

              <Surface style={styles.commandBox} elevation={1}>
                <Text variant="labelSmall">Command:</Text>
                <Text variant="bodySmall" style={styles.commandText}>
                  {tool.command}
                </Text>
              </Surface>

              <View style={styles.toolActions}>
                <Button
                  mode="outlined"
                  onPress={() => {}}
                  icon="play"
                  disabled={tool.status === 'connected'}
                >
                  Connect
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {}}
                  icon="test-tube"
                >
                  Test
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setSelectedTool(tool)}
                  icon="cog"
                >
                  Configure
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Register New Tool */}
        <Card style={styles.addCard}>
          <Card.Content>
            <View style={styles.addContent}>
              <Icon name="plus-circle" size={48} color={theme.colors.primary} />
              <Title>Register New MCP Tool</Title>
              <Paragraph>Add custom MCP servers to extend functionality</Paragraph>
              <Button
                mode="contained"
                icon="plus"
                style={styles.addButton}
                onPress={() => setAddToolDialog(true)}
              >
                Add Tool
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Tool Dialog */}
      <Portal>
        <Dialog visible={addToolDialog} onDismiss={() => setAddToolDialog(false)}>
          <Dialog.Title>Register MCP Tool</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Tool Name"
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Command"
              mode="outlined"
              placeholder="npx -y @your/mcp-tool"
              style={styles.dialogInput}
            />
            <TextInput
              label="Description"
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
            <TextInput
              label="Environment Variables (JSON)"
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder='{"API_KEY": "$YOUR_API_KEY"}'
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddToolDialog(false)}>Cancel</Button>
            <Button onPress={() => setAddToolDialog(false)}>Register</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Configure Tool Dialog */}
      <Portal>
        <Dialog
          visible={!!selectedTool}
          onDismiss={() => setSelectedTool(null)}
        >
          <Dialog.Title>{selectedTool?.name} Configuration</Dialog.Title>
          <Dialog.Content>
            {selectedTool?.apiKeyRequired && (
              <TextInput
                label="API Key"
                mode="outlined"
                secureTextEntry
                style={styles.dialogInput}
              />
            )}
            <TextInput
              label="Timeout (seconds)"
              mode="outlined"
              keyboardType="numeric"
              defaultValue="30"
              style={styles.dialogInput}
            />
            <TextInput
              label="Max Retries"
              mode="outlined"
              keyboardType="numeric"
              defaultValue="3"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSelectedTool(null)}>Cancel</Button>
            <Button onPress={() => setSelectedTool(null)}>Save</Button>
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
  searchCard: {
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  toolCard: {
    marginBottom: 16,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  toolTitle: {
    flexDirection: 'row',
    flex: 1,
  },
  toolInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    marginLeft: 8,
    marginRight: 12,
    textTransform: 'capitalize',
  },
  apiChip: {
    height: 24,
  },
  toolDescription: {
    marginVertical: 12,
    opacity: 0.8,
  },
  commandBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  commandText: {
    fontFamily: 'monospace',
    marginTop: 4,
  },
  toolActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
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
  dialogInput: {
    marginVertical: 8,
  },
});