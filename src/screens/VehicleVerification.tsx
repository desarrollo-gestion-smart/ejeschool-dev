import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // 👈 Importación clave para 'replace'

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
  { id: '1', label: 'Bus 01 - ABC 123' },
  { id: '2', label: 'Bus 02 - DEF 456' },
  { id: '3', label: 'Van 01 - GHI 789' },
  { id: '4', label: 'Van 02 - JKL 012' },
];

export default function VehicleVerificationScreen() {
  const insets = useSafeAreaInsets();
  // Usa el tipo corregido
  const navigation = useNavigation<DriverStackNavigationProps>();

  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleVerify = async () => {
    if (!selectedVehicle || code.length < 6) {
      Alert.alert(
        'Error',
        'Debes seleccionar un vehículo y digitar el código completo',
      );
      return;
    }

    setIsLoading(true);

    try {
      // 🚀 1. SIMULACIÓN DEL "MÍNIMO RELOAD" (Llamada a API/Validación)
      console.log(`Validando vehículo: ${selectedVehicle} con código: ${code}`);

      // Simula 2 segundos de carga. Esta sintaxis resuelve el Error 2345.
      await new Promise(resolve => setTimeout(() => resolve(undefined), 2000));

      // La validación fue exitosa:
      // ➡️ 2. REDIRECCIÓN A PageDriver.tsx
      // Usamos replace() para que el usuario no pueda volver a esta pantalla.
      navigation.replace('PageDriver');
    } catch (error) {
      console.error('Error de validación:', error);
      Alert.alert(
        'Error de Verificación',
        'El código o vehículo no son válidos. Intente de nuevo.',
      );
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !selectedVehicle || code.length < 6 || isLoading;

  return (
    <View
      style={[
        styles.container,
        {
          // Aplicación de insets
          paddingTop:
            insets.top +
            (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {/* Contenido principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Seleccionar Vehículo</Text>

        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={[
              styles.selectText,
              selectedVehicle && styles.selectTextFilled,
            ]}
          >
            {selectedVehicle || 'Seleccionar Vehículo'}
          </Text>
          {/* icon */}
        </TouchableOpacity>

        <Text style={styles.instruction}>
          Digite su código de verificación enviado por SMS
        </Text>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          style={styles.codeWrapper}
        >
          <View style={styles.codeContainer}>
            {[0, 1, 2, 3, 4, 5].map(index => (
              <View key={index} style={styles.digitBox}>
                <Text style={styles.digit}>
                  {code.length > index ? code[index] : '•'}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={text =>
            setCode(text.replace(/[^0-9]/g, '').slice(0, 6))
          }
          keyboardType="numeric"
          maxLength={6}
          style={styles.hiddenInput}
        />

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

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Vehículo</Text>

            <FlatList
              data={VEHICLES}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.vehicleItem}
                  onPress={() => {
                    setSelectedVehicle(item.label);
                    setCode('');
                    setModalVisible(false);
                    inputRef.current?.focus();
                  }}
                >
                  <Text style={styles.vehicleText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6D28D9',
    marginBottom: 50,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    width: '100%',
    marginBottom: 50,
  },
  selectText: {
    fontSize: 18,
    color: '#888',
  },
  selectTextFilled: {
    color: '#000',
  },
  instruction: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  codeWrapper: { width: '100%', alignItems: 'center' },
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
    borderRadius: 30,
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
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  vehicleItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  vehicleText: {
    fontSize: 18,
  },
  cancelButton: {
    padding: 18,
    alignItems: 'center',
  },
  cancelText: {
    color: '#6D28D9',
    fontSize: 18,
    fontWeight: '600',
  },
});
