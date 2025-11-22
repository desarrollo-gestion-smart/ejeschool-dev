import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonTextProps {
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

const ButtonText: React.FC<ButtonTextProps> = ({
  label,
  style,
  textStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default ButtonText;
