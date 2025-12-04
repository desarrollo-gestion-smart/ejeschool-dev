import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Lessthen from '../../../../../assets/icons/lessthen.svg';
import Search from '../../../../../assets/icons/search.svg';



type Friend = {
  id: string;
  name: string;
  avatar: string;
  status: 'selected' | 'available' | 'invited';
};

export default function InviteFriends() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Johnny Rios', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=64&h=64&fit=crop', status: 'selected' },
    { id: '2', name: 'Alfred Hodges', avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=64&h=64&fit=crop', status: 'available' },
    { id: '3', name: 'Samuel Hammond', avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=64&h=64&fit=crop', status: 'invited' },
    { id: '4', name: 'Dora Hines', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop', status: 'invited' },
    { id: '5', name: 'Carolyn Francis', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=64&h=64&fit=crop', status: 'available' },
    { id: '6', name: 'Isaiah McGee', avatar: 'https://images.unsplash.com/photo-1548778943-6a8d886d6e12?w=64&h=64&fit=crop', status: 'available' },
    { id: '7', name: 'Mark Holmes', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e0ac1da?w=64&h=64&fit=crop', status: 'selected' },
    { id: '8', name: 'Russell McGuire', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop', status: 'available' },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(f => f.name.toLowerCase().includes(q));
  }, [friends, query]);

  const toggleInvite = (id: string) => {
    setFriends(prev => prev.map(f => (f.id === id ? { ...f, status: f.status === 'selected' ? 'available' : 'selected' } : f)));
  };

  return (
    <View style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}>
                <Lessthen
                    height={24}
                    width={20}
                    fill={'#fff'}
                />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invitar Amigos</Text>
          <View style={styles.headerSpacer} />
          
        </View>
        <View style={styles.searchBox}>
                <Search 
                    height={17}
                    width={17}
                    fill={'#fff'}
                />

          <TextInput
            placeholder="Buscar amigos"
            placeholderTextColor="#E9D5FF"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>
      </View>
      <ScrollView style={styles.list}>
        {filtered.map(f => (
          <View key={f.id} style={styles.row}>
            <Image source={{ uri: f.avatar }} style={styles.avatar} />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowTitle}>{f.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleInvite(f.id)}
              style={[styles.actionBtn, f.status === 'selected' ? styles.actionGreen : f.status === 'invited' ? styles.actionGray : styles.actionPurple]}
            >
              <Text style={styles.actionSymbol}>{f.status === 'selected' ? '✓' : f.status === 'invited' ? '✗' : '+'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E5E5' },
  header: { backgroundColor: '#5d01bc', paddingHorizontal: 14, paddingBottom: 9 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20 },
  back: { width: 40, height: 32, borderRadius: 16, alignItems: 'flex-start', justifyContent: 'center' },
  backArrow: { color: '#FFFFFF', fontSize: 26, lineHeight: 26 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSpacer: { width: 40 },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#8640CD', borderRadius: 12, paddingHorizontal: 10, },
  searchInput: { color: '#fff', fontSize: 14, fontWeight: '700' },
  list: { flex: 1, backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#D6D6D6', borderBottomWidth: 2.3, borderBottomColor: '#E5E7EB' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  rowTextBox: { flex: 1 },
  rowTitle: { color: '#111827', fontSize: 16, fontWeight: '400' },
  actionBtn: { width: 44, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionPurple: { backgroundColor: '#5d01bc' },
  actionGreen: { backgroundColor: '#4CD964' },
  actionGray: { backgroundColor: '#E2E1E8' },
  actionSymbol: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
