import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../types/navigation';

import Home from '../screens/Home';
import LoginFather from '../screens/Login/LoginFather';
import LoginDriver from '../screens/Login/LoginDriver';
import PageDriver from '../screens/pages/PageDriver';
import PageFather from '../screens/pages/PageFather';
import VehicleVerificationScreen from '../screens/VehicleVerification'; //

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="LoginFather" component={LoginFather} />
        <Stack.Screen name="LoginDriver" component={LoginDriver} />
        <Stack.Screen name="PageDriver" component={PageDriver} />
        <Stack.Screen name="PageFather" component={PageFather} />
        <Stack.Screen
          name="VehicleVerification"
          component={VehicleVerificationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
