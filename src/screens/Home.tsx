import { StatusBar, StyleSheet, View, Text, Image } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ButtonText from '../components/ButtonText';
import { RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../assets/logo-s.png')}
                style={styles.logo}
              />
            </View>
          </View>

          <Text style={styles.title}>EjeSchool</Text>
          <Text style={styles.welcome}>Bienvenido</Text>

          <ButtonText
            label="Iniciar Sesión Como Padres"
            style={styles.customButton}
            onPress={() => navigation.navigate('LoginFather')}
          />

          <ButtonText
            label="Iniciar Como Conductor"
            onPress={() => navigation.navigate('LoginDriver')}
            style={styles.customButtonSecond}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6D28D9' },

  content: {
    flex: 1,
    top: -100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  customButton: {
    backgroundColor: '#fff',
    marginTop: 30,
    height: 50,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  customButtonSecond: {
    backgroundColor: '#2196F3',
    marginTop: 30,
    height: 50,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  logoContainer: { marginBottom: 20, alignItems: 'center' },

  logo: { width: '100%', height: '100%' },

  logoWrapper: {
    shadowColor: '#110c0cff',
    width: 200,
    height: 220,
    shadowOffset: { width: 0, height: 5 },
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    elevation: 10,
    borderRadius: 80,
  },

  title: {
    fontFamily: 'arial',
    fontSize: 32,
    color: 'white',
    marginBottom: 20,
  },

  welcome: {
    fontSize: 24,
    color: 'white',
  },
});
