import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

// PageAgent type - we'll import dynamically
type PageAgentType = any;

// Logging
console.log('PageAgent React Native Web App loaded');

const App: React.FC = () => {
    console.log('App component rendering');
    
    const [pageAgent, setPageAgent] = useState<PageAgentType | null>(null);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Array<{ id: string; text: string; isUser: boolean }>>([
        { id: '1', text: 'Hello! I am PageAgent. How can I help you control this web page?', isUser: false },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize PageAgent
    useEffect(() => {
        const initPageAgent = async () => {
            try {
                console.log('Initializing PageAgent...');
                
                // For web demo, load page-agent from CDN
                // In production, you'd use the npm package after building
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/page-agent@1.5.1/dist/iife/page-agent.demo.js';
                script.crossOrigin = 'anonymous';
                
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
                
                console.log('PageAgent script loaded');
                
                // Get the global PageAgent constructor
                const PageAgent = (window as any).PageAgent;
                
                if (!PageAgent) {
                    throw new Error('PageAgent not found on window');
                }
                
                // Get config from environment
                const baseURL = 'http://localhost:1234/v1';
                const apiKey = 'NA';
                const model = 'qwen/qwen3.5-9b';
                
                console.log('Creating PageAgent with:', { baseURL, model });
                
                // Create PageAgent instance
                const agent = new PageAgent({
                    model: model,
                    baseURL: baseURL,
                    apiKey: apiKey,
                    language: 'en-US',
                    // Exclude our own UI from being controlled
                    interactiveBlacklist: [],
                });
                
                console.log('PageAgent created successfully:', agent);
                setPageAgent(agent);
                
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: 'PageAgent initialized! You can now control this page using natural language.',
                    isUser: false
                }]);
                
            } catch (error) {
                console.error('Failed to initialize PageAgent:', error);
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: `Error initializing PageAgent: ${error}`,
                    isUser: false
                }]);
            }
        };
        
        initPageAgent();
    }, []);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            if (pageAgent) {
                console.log('Executing PageAgent with:', inputText);
                
                // Execute the command using PageAgent
                const result = await pageAgent.execute(inputText);
                
                console.log('PageAgent result:', result);
                
                const agentResponse = {
                    id: (Date.now() + 1).toString(),
                    text: result?.message || `Executed: "${inputText}" - Result: ${JSON.stringify(result)}`,
                    isUser: false,
                };
                setMessages(prev => [...prev, agentResponse]);
            } else {
                // Fallback if PageAgent not initialized
                const agentResponse = {
                    id: (Date.now() + 1).toString(),
                    text: `I received: "${userMessage.text}". PageAgent is not initialized yet.`,
                    isUser: false,
                };
                setMessages(prev => [...prev, agentResponse]);
            }
        } catch (error) {
            console.error('PageAgent error:', error);
            const errorResponse = {
                id: (Date.now() + 1).toString(),
                text: `Error: ${error}`,
                isUser: false,
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PageAgent</Text>
                <Text style={styles.headerSubtitle}>React Native for Web Demo</Text>
                {pageAgent && (
                    <Text style={styles.status}>✓ PageAgent Ready</Text>
                )}
            </View>

            <ScrollView style={styles.messagesContainer}>
                {messages.map(message => (
                    <View
                        key={message.id}
                        style={[
                            styles.messageBubble,
                            message.isUser ? styles.userMessage : styles.agentMessage,
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageText,
                                message.isUser ? styles.userMessageText : styles.agentMessageText,
                            ]}
                        >
                            {message.text}
                        </Text>
                    </View>
                ))}
                {isLoading && (
                    <View style={[styles.messageBubble, styles.agentMessage]}>
                        <Text style={[styles.messageText, styles.agentMessageText]}>
                            ⏳ Processing...
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a command (e.g., 'Click the button')..."
                    placeholderTextColor="#999"
                    onSubmitEditing={handleSend}
                    editable={!isLoading}
                />
                <TouchableOpacity 
                    style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
                    onPress={handleSend}
                    disabled={isLoading}
                >
                    <Text style={styles.sendButtonText}>
                        {isLoading ? '...' : 'Send'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#007AFF',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    status: {
        fontSize: 12,
        color: '#90EE90',
        marginTop: 8,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    agentMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
    },
    messageText: {
        fontSize: 16,
    },
    userMessageText: {
        color: '#fff',
    },
    agentMessageText: {
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    sendButton: {
        marginLeft: 12,
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        borderRadius: 22,
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default App;
