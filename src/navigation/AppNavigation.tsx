import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { RootStackParamList } from '../types/Navigation';
import * as FileSystem from 'expo-file-system/legacy';
import { setAuthToken } from '../api/base';

import InitialLogins from '../screens/InitialLogins';

//Driver 
import LoginDriver from '../screens/Login/LoginDriver';
import PageDriver from '../screens/pages/driver/PageDriver';


//father 
import LoginFather from '../screens/Login/LoginFather';
import PageFather from '../screens/pages/father/PageFather';
import RegisterStudent from '../screens/RegisterStudent';
import DashboardFather from '../screens/pages/father/components/dashboard/DashboardFather';
import ChatSupport from '../screens/pages/father/ChatComponent';
import Notifications from '../screens/pages/father/components/dashboard/Notificaciones';
import MyAccount from '../screens/pages/father/components/dashboard/Myaccount';
import Historias from '../screens/pages/father/components/dashboard/TripsHistory';
import vehicleVerification from '../screens/pages/driver/components/VehicleVerification';



const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [ready, setReady] = React.useState(false);
  const [initial, setInitial] = React.useState<keyof RootStackParamList>('InitialLogins');

  React.useEffect(() => {
    const init = async () => {
      try {
          // @ts-ignore
        const path = `${FileSystem.documentDirectory || ''}session.json`;
        const exists = path ? await FileSystem.getInfoAsync(path) : { exists: false };
        if ((exists as any)?.exists) {
          const raw = await FileSystem.readAsStringAsync(path);
          const obj = JSON.parse(raw || '{}');
          const token = obj?.token;
          const role = obj?.role as ('driver' | 'parent' | 'admin' | undefined);
          if (token) {
            setAuthToken(token);
            if (role === 'driver') setInitial('PageDriver');
            else if (role === 'parent' || role === 'admin') setInitial('PageFather');
            else setInitial('InitialLogins');
          }
        }
      } catch {}
      setReady(true);
    };
    init();
  }, []);

  return (
    <NavigationContainer>
      {ready ? (
        <Stack.Navigator
          initialRouteName={initial}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="vehicleVerification" component={vehicleVerification} />
          <Stack.Screen name="InitialLogins" component={InitialLogins} />
          <Stack.Screen name="LoginFather" component={LoginFather} />
          <Stack.Screen name="LoginDriver" component={LoginDriver} />
          <Stack.Screen name="RegisterStudent" component={RegisterStudent} />
          <Stack.Screen name="PageDriver" component={PageDriver} />
          <Stack.Screen name="PageFather" component={PageFather} />
          <Stack.Screen name="DashboardFather" component={DashboardFather} />
          <Stack.Screen name="ChatSupport" component={ChatSupport} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="MyAccount" component={MyAccount} />
          <Stack.Screen name="Historias" component={Historias} />
        </Stack.Navigator>
      ) : (
        <View />
      )}
    </NavigationContainer>
  );
}
