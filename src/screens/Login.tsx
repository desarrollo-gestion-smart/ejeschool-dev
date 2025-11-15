import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A11CB', // Solid violet instead of gradient
  },
  safeArea: {
    flex: 1,
  },
  skyline: {
    height: 100,
    backgroundColor: '#4C1D95', // Darker violet
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
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoWrapper: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoText: {
    fontSize: 60,
    color: '#6A11CB',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
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
  qrButton: {
    backgroundColor: '#2575FC',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  qrButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  terms: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
});

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleLogin = () => {
    console.log('Login with', email, password);
  };

  const handleQR = () => {
    setShowQR(true);
  };

  const handleBackFromQR = () => {
    setShowQR(false);
  };

  return (
   <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Skyline Header */}
          <View style={styles.skyline}>
            {/* Simple skyline placeholder */}
            <View style={styles.building1} />
            <View style={styles.building2} />
            <View style={styles.building3} />
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Text style={styles.logoText}>S</Text>
            </View>
          </View>

          {/* Login Card */}
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
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* QR Button */}
          <TouchableOpacity style={styles.qrButton} onPress={handleQR}>
            <Text style={styles.qrButtonText}>Iniciar con QR</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            Al hacer clic en iniciar, acepta nuestros Términos y condiciones
          </Text>
        </SafeAreaView>
      </View>
      </SafeAreaProvider>
    );
  }


export default Login;