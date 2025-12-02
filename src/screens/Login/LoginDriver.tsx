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
  ActivityIndicator,
} from 'react-native';
import ResponsiveLogo from '../../components/ResponsiveLogo';
import LogoSvg from '../../assets/logo-s.svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Schoolsvg from '../../assets/school.svg';
// Responsive logo y assets
// (importados arriba)
import { login } from '../../api/auth';
import { getAuthToken } from '../../api/base';

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Por favor, complete todos los campos');
      return;
    }
    setIsLoading(true);
    try {
      console.log('LoginDriver request', { endpoint: '/auth/login', email, password: '***' });
      const res = await login({ email, password });
      console.log('LoginDriver response', res);
      const token = (res as any)?.api_token || (res as any)?.token;
      if (token) {
        const masked = `${String(token).slice(0, 6)}...${String(token).slice(-4)}`;
        const stored = getAuthToken();
        const maskedStored = stored ? `${String(stored).slice(0, 6)}...${String(stored).slice(-4)}` : null;
        console.log('LoginDriver token', { received: masked, stored: maskedStored });
        navigation.replace('PageDriver');
      } else {
        Alert.alert('Login', 'Respuesta sin token');
      }
    } catch (e: any) {
      console.log('LoginDriver error', e?.response?.data || e);
      Alert.alert('Login fallido', e?.response?.data?.message || 'Error de autenticación');
    } finally {
      setIsLoading(false);
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
      <GestureDetector gesture={swipeBackGesture}>

        <View style={styles.header}> 
        <View style={styles.middlelogo}> 
          <Schoolsvg
        style={styles.schoolsvg}/>

        </View>
          <View style={styles.space}/>
          <View style={styles.content}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                  <View style={styles.contentUp}>
                    <ResponsiveLogo SvgComponent={LogoSvg} />
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
                      <TouchableOpacity style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} onPress={handleLogin} disabled={isLoading}>
                        {isLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.terms}>Al hacer clic en iniciar, acepta nuestros Términos y condiciones</Text>
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
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    color: '#000',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
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
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.8,
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
