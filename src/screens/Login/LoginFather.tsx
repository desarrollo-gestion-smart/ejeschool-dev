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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { GoBack } from '../../components/Button/GoBack';
import { login } from '../../api/auth';

type RootStackParamList = {
  RegisterStudent: undefined;
  PageFather: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginFather() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Por favor, complete todos los campos');
      return;
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
  
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

                <GoBack />
                <View style={styles.skyline}>
                  <View style={styles.building1} />
                  <View style={styles.building2} />
                  <View style={styles.building3} />
                </View>

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

                  <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('RegisterStudent')}>
                    <Text style={styles.registerButtonText}>Registrarse</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.terms}>
                  Al hacer clic en iniciar, acepta nuestros Términos y condiciones
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
  backButton: {
    padding: 10,
    marginLeft: 10,
    marginTop: 5,
  },

  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#5d01bc',
  },
  safeArea: {
    flex: 1,
  },
  skyline: {
    height: 100,
    backgroundColor: '#4C1D95',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 10,
  },
  contentUp: {
    marginTop: -24,
  },
  building1: {
    width: 30,
    height: 60,
    backgroundColor: '#5d01bc',
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
    borderRadius: 10,
    padding: 16,
    alignSelf: 'center',
    width: '88%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
  registerButton: {
    alignSelf: 'center',
    backgroundColor: '#2672ca',
    paddingVertical: 15,
    borderRadius: 10,
    width: '88%',
    maxWidth: 360,
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  terms: {
    top: 10,
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
