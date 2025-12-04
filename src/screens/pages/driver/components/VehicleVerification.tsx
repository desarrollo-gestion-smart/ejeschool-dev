import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // 👈 Importación clave para 'replace'
import LowArrowIcon from '../../../../assets/icons/lowarrow.svg';
// --- DEFINICIÓN DE TIPOS CORREGIDA ---
// 1. Define tus rutas. El nombre 'PageDriver' debe coincidir con tu Navigator.
type RootStackParamList = {
  PageDriver: undefined;
  VehicleVerification: undefined;
};

// 2. Define el tipo de navegación del Stack para usar 'replace'.
type DriverStackNavigationProps = StackNavigationProp<
  RootStackParamList,
  'VehicleVerification'
>;
// -------------------------------------

const VEHICLES = [
  { id: '1', label: 'chevrolet Silverado' },
  { id: '2', label: 'Ford EcoSport' },
  { id: '3', label: 'Fiat 100' },
  { id: '4', label: 'Renault Oroch ' },
];

export default function VehicleVerificationScreen() {
  const insets = useSafeAreaInsets();
  // Usa el tipo corregido
  const navigation = useNavigation<DriverStackNavigationProps>();

  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [listOpen, setListOpen] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleVerify = async () => {
    if (!selectedVehicle) {
      Alert.alert('Debes seleccionar un vehículo para verificar');
      return;
    }

    setIsLoading(true);

    try {
      console.log(`Validando vehículo: ${selectedVehicle}`);
      navigation.replace('PageDriver');
    } catch (error) {
      console.error('Error de validación:', error);
      Alert.alert('Error de Verificación', 'Intente de nuevo');
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !selectedVehicle || isLoading;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            insets.top +
            (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      
        <Text style={styles.title}>Seleccionar Vehículo</Text>
      {/* Contenido principal */}
      <View style={styles.content}>

        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() => setListOpen(v => !v)}
        >
          <Text
            style={[
              styles.selectText,
              selectedVehicle && styles.selectTextFilled,
            ]}
          >
            {selectedVehicle || 'Seleccionar Vehículo'}
          </Text>
          <LowArrowIcon width={20} height={24} color="#000" fill="#000" style={styles.selectIcon} />
        </TouchableOpacity>

        {listOpen && (
          <View style={styles.listPanel}>
            <Text style={styles.listTitle}></Text>
            <FlatList
              data={VEHICLES}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    setSelectedVehicle(item.label);
                    setListOpen(false);
                  }}
                >
                  <Text style={styles.vehicleText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.listCancel} onPress={() => setListOpen(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.verifyButton,
            isButtonDisabled && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={isButtonDisabled}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? 'Verificando...' : 'Verificar ahora'}
          </Text>
        </TouchableOpacity>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#6D28D9',
    paddingVertical: 40,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 50,
  },
  lessIcon: {
    marginLeft: 40,
    color: '#888',
    
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#242E42',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 40,
  },
  selectText: {
    fontSize: 18,
    color: '#888',
    flex: 1,
  },
  selectTextFilled: {
    color: '#000',
  },
  selectIcon: {
    marginLeft: 12,
  },
  instruction: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  codeWrapper: { width: '100%', alignItems: 'center', position: 'relative' },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
  },
  digitBox: {
    width: 50,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#6D28D9',
  },
  digit: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#6D28D9',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginTop: 60,
  },
  verifyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  invisibleInput: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0,
  },
  listPanel: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    maxHeight: 280,
    marginTop: -50,
    marginBottom: 32,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#111',
  },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  vehicleText: {
    fontSize: 18,
  },
  listCancel: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#6D28D9',
    fontSize: 18,
    fontWeight: '600',
  },
});
