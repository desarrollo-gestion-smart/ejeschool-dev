import { Alert } from 'react-native';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';


 




export const SinginWithaGoogle = () => {;
    const [cargandoGoogle] = useState(false); 

    

      const handleGoogleSignIn = async () => {
        Alert.alert('Google', 'Inicio con Google no está configurado en este entorno');
      };


  return (
           <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleGoogleSignIn}    
                    disabled={cargandoGoogle}                
                  >
                    <Text>
                      
                      <Image source={{uri: 'https://img.icons8.com/color/48/000000/google-logo.png'}} style={styles.googleIcon} />
                    </Text>
                    <Text style={styles.registerButtonText}>
                      {cargandoGoogle ? 'Conectando...' : 'Registrar con Google'}
                    </Text>
                  </TouchableOpacity> 
  )
}

const styles = StyleSheet.create({
   googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: '88%',
    maxWidth: 400,
    height: 45,
    borderRadius: 10,
    marginTop: 12,
  },
  registerButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',

  },
});
