import { StatusBar, StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import ResponsiveLogo from '../components/ResponsiveLogo';
import LogoSvg from '../assets/logo-s.svg';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ButtonText from '../components/Button/ButtonText';
import { RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'InitialLogins'>;

export default function InitialLogins({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const contentTop = height < 640 ? -50 : -100;
  const titleSize = Math.min(32, Math.max(24, width * 0.08));
  const welcomeSize = Math.min(24, Math.max(18, width * 0.06));
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { top: contentTop }] }>
          <View style={styles.logoContainer}>
            <ResponsiveLogo SvgComponent={LogoSvg} sizePercent={0.33} maxWidth={121} maxHeight={128} />
          </View>

          <Text style={[styles.title, { fontSize: titleSize }]}>EjeSchool</Text>
          <Text style={[styles.welcome, { fontSize: welcomeSize }]}>Bienvenido</Text>

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
  container: { flex: 1,
    justifyContent: 'center',
    backgroundColor: '#6D28D9' },

  content: {
    flex: 1,
    marginTop: '30%',
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

  logoWrapper: {
    shadowColor: '#110c0cff',
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
