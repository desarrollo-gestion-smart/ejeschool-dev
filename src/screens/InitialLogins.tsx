import { StatusBar, StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import ResponsiveLogo from '../components/ResponsiveLogo';
import LogoSvg from '../assets/logo-s.svg';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ButtonText from '../components/Button/ButtonText';
import { RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Schoolsvg from '../assets/school.svg';
type Props = NativeStackScreenProps<RootStackParamList, 'InitialLogins'>;

export default function InitialLogins({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const contentTop = height < 640 ? -50 : -100;
  const titleSize = Math.min(42, Math.max(100, width * 0.08));
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { top: contentTop }] }>
          <View style={styles.logoContainer}>
            <ResponsiveLogo SvgComponent={LogoSvg} sizePercent={0.33} maxWidth={121} maxHeight={128} />
          </View>

          <Text style={[styles.title, { fontSize: titleSize }]}>EjeSchool</Text>

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
        <Schoolsvg
        style={styles.schoolsvg}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: '#5d01bc' },

  content: {
    flex: 1,
    marginTop: '42%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logoContainer: {
    marginBottom: 10,
  },

  customButton: {
    backgroundColor: '#fff',
    marginTop: 40,
    height: 45,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  customButtonSecond: {
    backgroundColor: '#2196F3',
    marginTop: 20,
    height: 45,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  title: {
    fontFamily: 'aber',
    fontSize: 32,
    color: 'white',
  },
  schoolsvg: {
    flex: 1,
    width: '100%',
    zIndex: -1,
    top: 20,
  },

});
