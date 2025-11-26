import React, { useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { register as registerApi } from '../api/auth';


import type { RootStackParamList } from '../types/Navigation';
import { SinginWithaGoogle } from '../components/Button/SinginWithaGoogle';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;


export default function RegisterStudent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const passwordRef = useRef<TextInput>(null);
  const [Name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = async () => {
    if (!email || !password) {
      Alert.alert('Por favor, complete todos los campos');
      return;
    }
    if (!Name || !lastName || !phone) {
      Alert.alert('Por favor, complete todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Las contraseñas no coinciden');
      return;
    }
    try {
      await registerApi({ name: `${Name} ${lastName}`.trim(), email, password, role: 'parent' });
      navigation.replace('PageFather');
    } catch (e: any) {
      Alert.alert('Registro fallido', e?.response?.data?.message || 'No se pudo registrar');
    }
  };



  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.skyline}>
                  <View style={styles.building1} />
                  <View style={styles.building2} />
                  <View style={styles.building3} />
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Registrar</Text>
                  <View style={styles.titleBar} />

                     <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    placeholderTextColor="#999"
                    value={Name}
                    onChangeText={setName}
                    keyboardType='default'
                    autoCapitalize="none"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={setLastName}
                    keyboardType='default'
                    autoCapitalize="none"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Teléfono"
                    placeholderTextColor="#999"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />


                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />

                  <TextInput
                    ref={passwordRef}
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="done"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    returnKeyType="done"
                  />

                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={register}
                  >
                    <Text style={styles.loginButtonText}> Registrar </Text>
                  </TouchableOpacity>
                  <SinginWithaGoogle />

                </View>
                    <Text style={styles.terms}>
                  Al hacer clic en iniciar, acepta nuestros Términos y
                  condiciones
                </Text>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#6A11CB',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#6A11CB',
  },
  skyline: {
    width: '100%',
    position: 'absolute',
    height: 100,
    backgroundColor: '#4C1D95',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  building1: {
    width: 30,
    height: 60,
    backgroundColor: '#6A11CB',
  },
  building2: {
    width: 40,
    height: 80,
    backgroundColor: '#6A11CB',
  },
  building3: {
    width: 25,
    height: 50,
    backgroundColor: '#6A11CB',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignSelf: 'center',
    width: '88%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  titleBar: {
    width: 50,
    height: 3,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#6A11CB',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
 
  terms: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 20,
  },
});
