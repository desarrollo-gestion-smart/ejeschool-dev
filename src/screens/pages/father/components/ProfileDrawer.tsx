// src/components/drawer/ProfileDrawer.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../types/Navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import LogoutIcon from '../../../../assets/menu/logout.svg';
import SettingsIcon from '../../../../assets/menu/settings.svg';
import NotificationIcon from '../../../../assets/menu/notification.svg';
import ClockIcon from '../../../../assets/menu/clock.svg';
import HomeIcon from '../../../../assets/menu/home.svg';



type Props = {
  visible: boolean;
  onClose: () => void;
  userName: string;
  userPhoto?: string; // opcional: url o require()
  vehiclePlate: string;
  onLogout: () => void;
};

export default function ProfileDrawer({
  visible,
  onClose,
  userName = 'Larry Davis',
  userPhoto,
  vehiclePlate = 'SDF-5221',
  onLogout,
}: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Gesto para cerrar deslizando hacia la izquierda
  const pan = Gesture.Pan()
    .onUpdate(e => {
      if (e.translationX < 0) {
        // Puedes añadir animación aquí si usas Reanimated
      }
    })
    .onEnd(e => {
      if (e.translationX < -100 || e.velocityX < -500) {
        onClose();
      }
    });
    const onHome = () => {
      onClose();
    };
    const onHistory = () => {
      onClose();
    };
    const onSettings = () => {
      onClose();
    };
  //   const menuItems = [
  //     { icon: 'Home', label: 'Inicio', action: () => onNavigate('Home') },
  //     { icon: 'History', label: 'Historial', action: () => onNavigate('History') },
  //     { icon: 'Bell', label: 'Notificaciones', action: () => onNavigate('Notifications') },
  //     { icon: 'Settings', label: 'Configuración', action: () => onNavigate('Settings') },
  //     { icon: 'Logout', label: 'Cerrar sesión', action: onLogout, danger: true },
  //   ];

  return (
    <Modal visible={visible} transparent animationType="none">
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
      <GestureDetector gesture={pan}>
        <View style={styles.overlay}>
          {/* Fondo oscuro semitransparente */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />

          {/* Cajón lateral */}
          <View style={styles.drawer}>
            <SafeAreaView style={{ flex: 1 }}>
              {/* Header */}
              <View style={styles.headerBox}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                ></TouchableOpacity>
                <View style={styles.headerInner}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { onClose(); navigation.navigate('MyAccount'); }}
                  >
                    {userPhoto ? (
                      <Image
                        source={{ uri: userPhoto }}
                        style={styles.avatarLarge}
                      />
                    ) : (
                      <View style={styles.avatarLargePlaceholder}>
                        <Text style={styles.avatarPlaceholderText}>
                          {userName.charAt(0).toLocaleUpperCase()}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <Text style={styles.headerName}>{userName}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{vehiclePlate}</Text>
                  </View>
                </View>
              </View>

              {/* Menú */}
              <View style={styles.menuBox}>

                  <View>
                    <TouchableOpacity style={styles.menuItem} onPress={onHome}>
                      <HomeIcon
                        width={24}
                        height={24}
                        fill="#6B7280"
                        style={styles.menuIcon}
                      />
                      <Text style={styles.menuLabel}>Inicio</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.menuItem} onPress={onHistory}>
                      <ClockIcon  
                        width={24}
                        height={24}
                        fill="#6B7280"
                        style={styles.menuIcon}
                      />
                      <Text style={styles.menuLabel}>Historial</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); navigation.navigate('Notifications'); }}>
                      <NotificationIcon
                        width={24}
                        height={24}
                        fill="#6B7280"
                        style={styles.menuIcon}
                      />
                      <Text style={styles.menuLabel}>Notificaciones</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.menuItem} onPress={onSettings}>
                      <SettingsIcon
                        width={24}
                        height={24}
                        fill="#6B7280"
                        style={styles.menuIcon}
                      />
                      <Text style={styles.menuLabel}>Configuración</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
                      <LogoutIcon
                        width={24}
                        height={24}
                        fill="#6B7280"
                        style={styles.menuIcon}
                      />
                      <Text style={styles.menuLabel}>Cerrar sesión</Text>
                    </TouchableOpacity>
                  </View>


              </View>
            </SafeAreaView>
          </View>
        </View>
      </GestureDetector>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
  },
  drawer: {
    width: 280,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  closeButton: { position: 'absolute', 
    left: 16, 
    top: 16,
     zIndex: 10
     },
  closeIcon: { fontSize: 28,
     fontWeight: '600',
      color: '#FFFFFF'
     },

  headerBox: {
    backgroundColor: '#5d01bc',
    paddingVertical: 24,
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerInner: { alignItems: 'flex-start', zIndex: 1, padding: 20 },
  avatarLarge: {
    width: 50,
    height: 20,
    borderColor: '#FFFFFF',
  },
  avatarLargePlaceholder: {
    width: 73,
    height: 73,
    borderRadius: 45,
    backgroundColor: '#5d01bc',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
  headerName: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  badge: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  badgeText: { color: '#5d01bc', fontSize: 20, fontWeight: '700' },

  bubblesLayer: { ...StyleSheet.absoluteFill, zIndex: 0 },
  bubble: { position: 'absolute', borderRadius: 9999 },
  bubble1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -20,
    left: -20,
    backgroundColor: 'rgba(93,1,188,0.65)',
  },
  bubble2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    top: 10,
    right: 20,
    backgroundColor: 'rgba(93,1,188,0.45)',
  },
  bubble3: {
    width: 140,
    height: 140,
    borderRadius: 70,
    bottom: -30,
    right: -40,
    backgroundColor: 'rgba(93,1,188,0.25)',
  },
  bubble4: {
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 20,
    left: 60,
    backgroundColor: 'rgba(93,1,188,0.35)',
  },

  menuBox: { backgroundColor: '#FFFFFF', paddingTop: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: { marginRight: 12,  },
  menuLabel: { fontSize: 15, fontWeight: '900', color: '#111827' },
});
