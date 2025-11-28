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

import ResponsiveLogo from '../../components/ResponsiveLogo';
import LogoSvg from '../../assets/logo-s.svg';
import { login } from '../../api/auth';

// Nuevo API - Solo esto necesitamos
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type RootStackParamList = {
  
  PageDriver: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginDriver() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Por favor, complete todos los campos');
      return;
    }

    try {
      const res = await login({ email, password, role: 'driver' });
      const role = res.user.role;

      if (role === 'driver' || role === 'admin') {
        navigation.replace('PageDriver');
      } else {
        Alert.alert('Acceso denegado', 'Tu rol no tiene acceso a esta pantalla');
      }
    } catch (e: any) {
      Alert.alert('Login fallido', e?.response?.data?.message || 'Error de autenticación');
    }
  };

  // Gesto de deslizar de derecha a izquierda para volver atrás (sin Reanimated)
  const swipeBackGesture = Gesture.Pan()
    .minDistance(40)
    .minPointers(1)
    .maxPointers(1)
    .activeOffsetX([-10, 10])   // solo horizontal
    .failOffsetY([-15, 15])     // cancela si hay mucho movimiento vertical
    .onEnd((event) => {
      // Deslizó hacia la derecha más de 120px y con velocidad suficiente → volver
      if (event.translationX > 120 && event.velocityX > 400) {
        navigation.goBack();
      }
    });

  return (
    <>
      <StatusBar barStyle="light-content" />

      {/* Gesto en toda la pantalla */}
      <GestureDetector gesture={swipeBackGesture}>
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="handled"
                >
                 

                  <View style={styles.contentUp}>
                    <View style={styles.LogoWrapper}>
                      <ResponsiveLogo source={LogoSvg}/>
                    </View>

                    <View style={styles.card}>
                      <Text style={styles.cardTitle}>Iniciar Sesión</Text>
                      <View style={styles.titleBar} />

                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
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

                      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.terms}>
                    Al hacer clic en iniciar, acepta nuestros Términos y condiciones
                  </Text>
                </ScrollView>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5d01bc',
  },
  LogoWrapper:{
    marginBottom: 24,
  },
  contentUp: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '88%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
    marginBottom: 10,
  },
  titleBar: {
    width: 60,
    height: 4,
    backgroundColor: '#000',
    marginBottom: 24,
    borderRadius: 2,
  },
  input: {
    width: '100%',
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  loginButton: {
    backgroundColor: '#5d01bc',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
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
    marginHorizontal: 30,
    marginBottom: 20,
    marginTop: 20,
  },
});