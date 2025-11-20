import { useNavigation } from '@react-navigation/native';

export function useNavigationUtils() {
  const navigation = useNavigation<any>();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const to = (screen: string, params?: object) => {
    navigation.navigate(screen, params);
  };

  return { goBack, to };
}