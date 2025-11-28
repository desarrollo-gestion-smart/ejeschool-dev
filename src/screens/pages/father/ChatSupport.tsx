import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function ChatSupport() {
  const messages = [
    { id: '1', from: 'soporte', text: 'Hola, ¿en qué puedo ayudarte?' },
    { id: '2', from: 'padre', text: 'Consulta sobre el recorrido de mi hijo.' },
  ];

  return (
    <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
      <View style={styles.header}> 
        <Text style={styles.headerTitle}>Chat de soporte</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.message, item.from === 'padre' ? styles.me : styles.them]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#5d01bc', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  list: { padding: 12 },
  message: { padding: 12, borderRadius: 10, marginBottom: 8, maxWidth: '80%' },
  them: { backgroundColor: '#E5E7EB', alignSelf: 'flex-start' },
  me: { backgroundColor: '#D1FAE5', alignSelf: 'flex-end' },
  messageText: { color: '#111827', fontSize: 14 },
});
