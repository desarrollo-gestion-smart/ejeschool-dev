/**
 * @format
 */
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AppRegistry } from 'react-native';
import App from './App';

GoogleSignin.configure({
  webClientId: 'TU_WEB_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com', 
});
AppRegistry.registerComponent('EjeSchool', () => App);
