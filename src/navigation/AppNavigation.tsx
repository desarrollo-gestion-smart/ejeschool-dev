import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../types/navigation';

import InitialLogins from '../screens/InitialLogins';

//Driver 
import LoginDriver from '../screens/Login/LoginDriver';
import PageDriver from '../screens/pages/PageDriver';


//father 
import LoginFather from '../screens/Login/LoginFather';
import PageFather from '../screens/pages/father/PageFather';
import RegisterStudent from '../screens/RegisterStudent';
import DashboardFather from '../screens/pages/father/components/dashboard/DashboardFather';
import ChatSupport from '../screens/pages/father/ChatComponent';
import Notifications from '../screens/pages/father/components/dashboard/Notificaciones';
import MyAccount from '../screens/pages/father/components/dashboard/Myaccount';
import Historias from '../screens/pages/father/components/dashboard/Historias';
import Paymethod from '../screens/pages/father/components/dashboard/Paymethod';
import vehicleVerification from '../screens/pages/driver/components/VehicleVerification';



const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InitialLogins"
        screenOptions={{ headerShown: false }}
      >
                <Stack.Screen name="vehicleVerification" component={vehicleVerification} />
        <Stack.Screen name="InitialLogins" component={InitialLogins} />  

        <Stack.Screen name="LoginFather" component={LoginFather} />
        <Stack.Screen name="LoginDriver" component={LoginDriver} />
        <Stack.Screen name="RegisterStudent" component={RegisterStudent} />

        <Stack.Screen name="PageDriver" component={PageDriver} />
        <Stack.Screen name="PageFather" component={PageFather} />
        <Stack.Screen name="DashboardFather" component={DashboardFather}  />
        <Stack.Screen name="ChatSupport" component={ChatSupport} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="MyAccount" component={MyAccount} />
        <Stack.Screen name="Historias" component={Historias} />
        <Stack.Screen name="Paymethod" component={Paymethod} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
