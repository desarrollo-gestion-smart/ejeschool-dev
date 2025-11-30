import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LessIcon from '../../../../../assets/icons/lessthen.svg';



export default function MyAccount() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const userName = 'Larry Davis';
  const userEmail = 'larry.davis@example.com';
  const identify = '12345678901234567890';
  const password = '********';
  const Telephone = '+54 9 01123456789';
  const rol = 'Estudiante';
  return (
    <View style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>

             <LessIcon width={24} height={24} fill={'#FFFFFF'} /> 
          </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mi Cuenta</Text>
          <Image style={styles.avatarImg} source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop' }} />
        </View>
        </View>
      </View>
      <View style={{ display:'flex', flexDirection:'row', justifyContent:'space-between', backgroundColor:'#F2F2F2'}}>
           <View style={{flexDirection:'column' , width:'100%'}}>
         
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: 15, backgroundColor:'#fff', width:'100%', height: 60, marginVertical: 20}}>
                <Text style={{fontSize: 18, fontWeight: '300', color:'#030303'}}>
                  Perfil
                </Text>
                 <Text style={{fontSize: 17, fontWeight: '300', color:'#C8C7CC'}}>
                    {rol}
                  </Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: 15, backgroundColor:'#fff', width:'100%', height: 44}}>

                <Text style={{fontSize: 17, fontWeight: '300', color:'#030303'}}>
                 Nombre
                </Text>
                 <Text style={{fontSize: 17, fontWeight: '300', color:'#C8C7CC'}}>
                  {userName}
                </Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: 15, backgroundColor:'#fff', width:'100%', height: 44}}>

                <Text style={{fontSize: 17, fontWeight: '300', color:'#030303'}}>
                Email
                </Text>
                  
                <Text style={{fontSize: 17, fontWeight: '300', color:'#C8C7CC'}}>
                  {userEmail}
                </Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: 15, backgroundColor:'#fff', width:'100%', height: 44}}>

                <Text style={{fontSize: 17, fontWeight: '300', color:'#030303'}}>
                  Identificaion
                </Text>
                <Text style={{fontSize: 17, fontWeight: '300', color:'#C8C7CC'}}>
                  {identify}
                </Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: 15, backgroundColor:'#fff', width:'100%', height: 44 }}>  

                <Text style={{fontSize: 17, fontWeight: '300', color:'#030303'}}>
                 Contraseña
                </Text>
                 <Text style={{fontSize: 17, fontWeight: '300', color:'#C8C7CC'}}>
                  {password}
                </Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: 15, backgroundColor:'#fff', width:'100%', height: 44 }}>  

                <Text style={{fontSize: 17, fontWeight: '300', color:'#030303'}}>
                  Telefono
                </Text>
                 <Text style={{fontSize: 15, fontWeight: '300', color:'#C8C7CC'}}>
                  {Telephone}
                </Text>
          </View>

                 
              
               
          </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E5E5', },
  header: { backgroundColor: '#5d01bc', paddingHorizontal: 20, paddingBottom: 12 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  back: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 40, lineHeight: 28 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  avatarImg: { width: 56, height: 56, borderRadius: 28, marginLeft: '20%' },
  container: { flex: 1 },

  headerBar: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 18 },
}); 
