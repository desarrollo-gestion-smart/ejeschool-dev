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
import ResponsiveLogo from '../../components/ResponsiveLogo';
import LogoSvg from '../../assets/logo-s.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Schoolsvg from '../../assets/school.svg';

import { login } from '../../api/auth';

// Solo esto necesitamos del nuevo Gesture Handler
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type RootStackParamList = {
  RegisterStudent: undefined;
  PageFather: undefined;
};
export default function Login() {
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginFather() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Por favor, complete todos los campos');
      const res = await login({ email, password, role: 'parent' });
    }
    try {
      const res = await login({ email, password });
      const role = res.user.role;
      if (role === 'parent' || role === 'admin') {
        navigation.replace('PageFather');
      } else {
        Alert.alert('Acceso denegado', 'Tu rol no tiene acceso a esta pantalla');
      }
    } catch (e: any) {
      Alert.alert('Login fallido', e?.response?.data?.message || 'Error de autenticación');
    }
  };

  // Gesto de deslizar de derecha a izquierda para volver atrás (sin Reanimated)
  const swipeBackGesture = Gesture.Pan()
    .minDistance(40)                    // Mínimo recorrido
    .minPointers(1)
    .maxPointers(1)
    .activeOffsetX([-10, 10])           // Solo se activa si el movimiento es principalmente horizontal
    .failOffsetY([-15, 15])             // Se cancela si hay mucho movimiento vertical
    .onEnd((event) => {
      // Deslizó hacia la derecha (translationX positivo) lo suficiente y rápido → volver atrás
      if (event.translationX > 120 && event.velocityX > 400) {
        navigation.goBack();
      }
    });

  return (
    <>
      <StatusBar barStyle="light-content" />

      {/* GestureDetector envuelve toda la pantalla */}
      <GestureDetector gesture={swipeBackGesture}>
         <View style={styles.header}> 
        <View style={styles.middlelogo}> 
          <Schoolsvg
        style={styles.schoolsvg}/>

        </View>
          <View style={styles.space}/>
          <View style={styles.content}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
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
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    <View style={styles.passwordContainer}>
                      <TextInput
                        ref={passwordRef}
                        style={[styles.input, styles.inputPassword]}
                        placeholder="Contraseña"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        returnKeyType="done"
                      />
                      <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(v => !v)}>
                        <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                      <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => navigation.navigate('RegisterStudent')}
                  >
                    <Text style={styles.registerButtonText}>Registrarse</Text>
                  </TouchableOpacity>
                  <Text style={styles.terms}>
                    Al hacer clic en iniciar, acepta nuestros Términos y condiciones
                  </Text>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
            </View>

      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    top: '10%',
    position: 'absolute',
    zIndex: 1,
    flex: 1,
  },
  header: {
    zIndex: -1,
    flex: 1,
  },
  middlelogo:{
    backgroundColor: '#5d01bc',
    height: '45%',
    alignContent:'flex-end',
    justifyContent:'flex-end',
  },
   schoolsvg: {
    flex: 1,
    width: '100%',
    
  },
  space:{
    backgroundColor: 'white',
    height: '70%',
  },
  LogoWrapper:{
    marginBottom: 24,
  },
  contentUp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },cardTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  titleBar: {
    width: 60,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  inputPassword: {
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    height: 22,
    width: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#5d01bc',
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#2672ca',
    paddingVertical: 8,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
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
  },
});
