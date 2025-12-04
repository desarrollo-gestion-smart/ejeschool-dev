import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../types/Navigation';
import LessIcon from '../../../assets/icons/lessthen.svg';
export default function ChatSupport() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RootStackParamList, 'ChatSupport'>>();
  const [input, setInput] = useState('');
  const currentUser = route?.params?.userRole || 'padre';
  const initialMessages = useMemo(() => ([
    { id: '1', from: currentUser, text: 'Hola, ¿estás cerca?', time: new Date() },
    { id: '2', from: currentUser === 'padre' ? 'conductor' : 'padre', text: 'Estoy en unos minutos', time: new Date() },
    { id: '3', from: currentUser, text: 'OK, estoy esperando en Vinmark Store', time: new Date() },
    { id: '4', from: currentUser === 'padre' ? 'conductor' : 'padre', text: 'Lo siento, me encuentro en tráfico. Por favor, déjame un momento.', time: new Date() },
  ]), [currentUser]);
  const [messages, setMessages] = useState(initialMessages);
  const listRef = useRef<FlatList<any>>(null);
  const send = () => {
    const text = input.trim();
    if (!text) return;
    const m = { id: String(Date.now()), from: currentUser, text, time: new Date() };
    setMessages(prev => [...prev, m]);
    setInput('');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };
  
  return (
    <View style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>

             <LessIcon width={24} height={24} fill={'#FFFFFF'} /> 
          </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{route?.params?.recipientName || 'Contacto'}</Text>
          <Image style={styles.avatarImg} source={{ uri: route?.params?.recipientAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop' }} />
        </View>
        </View>
      </View>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const mine = item.from === currentUser;
            return (
              <View style={[styles.row, mine ? styles.rowRight : styles.rowLeft]}>
                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
                <View style={[mine ? styles.tailRight : styles.tailLeft]} />
                <Text style={[styles.time, mine ? styles.timeRight : styles.timeLeft]}>
                  {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          }}
        />
        <View style={[styles.inputBar]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="escribe un mensaje..."
            placeholderTextColor="#A3A3A3"
            style={styles.input}
            returnKeyType="send"
            enablesReturnKeyAutomatically
            onSubmitEditing={send}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E5E5', },
  header: { backgroundColor: '#5d01bc', paddingHorizontal: 20, paddingBottom: 12 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  back: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 40, lineHeight: 28 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  avatarImg: { width: 56, height: 56, borderRadius: 28, marginLeft: '20%' },
  container: { flex: 1 },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  row: { marginBottom: 14, maxWidth: '86%', position: 'relative' },
  rowLeft: { alignSelf: 'flex-start' },
  rowRight: { alignSelf: 'flex-end' },
  bubble: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14 },
  bubbleMine: { backgroundColor: '#5d01bc' },
  bubbleOther: { backgroundColor: '#FFFFFF' },
  tailLeft: { position: 'absolute', bottom: -1, left: -6, width: 0, height: 0, },
  tailRight: { position: 'absolute', bottom: -1, right: -6, width: 0, height: 0,  },
  messageText: { color: '#111111', fontSize: 16 },
  time: { marginTop: 6, color: '#6B7280', fontSize: 12 },
  timeLeft: { textAlign: 'left' },
  timeRight: { textAlign: 'right' },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40, paddingTop: 8, backgroundColor: '#E0E0E2', height: 70 },
  input: { flex: 1, height: 40, borderRadius: 10, backgroundColor: '#FFFFFF',},

  headerBar: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 18 },
}); 
