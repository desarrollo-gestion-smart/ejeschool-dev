import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../types/navigation';

import InitialLogins from '../screens/InitialLogins';
import LoginFather from '../screens/Login/LoginFather';
import LoginDriver from '../screens/Login/LoginDriver';
import RegisterStudent from '../screens/RegisterStudent';

import PageDriver from '../screens/pages/PageDriver';
import PageFather from '../screens/pages/PageFather';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InitialLogins"
        screenOptions={{ headerShown: false }}
      >

        <Stack.Screen name="InitialLogins" component={InitialLogins} />  

        <Stack.Screen name="LoginFather" component={LoginFather} />
        <Stack.Screen name="LoginDriver" component={LoginDriver} />
        <Stack.Screen name="RegisterStudent" component={RegisterStudent} />

        <Stack.Screen name="PageDriver" component={PageDriver} />
        <Stack.Screen name="PageFather" component={PageFather} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
