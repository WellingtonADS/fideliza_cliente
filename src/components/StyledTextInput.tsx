// src/components/StyledTextInput.tsx
import React, { useMemo, useState } from 'react';
import { TextInput, StyleSheet, View, TextInputProps, Text, TouchableOpacity } from 'react-native';
import IconComponent from './IconComponent';

// Estende as propriedades padrão do TextInput para máxima flexibilidade
interface StyledTextInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean; // exibir botão de mostrar/ocultar senha
}

const StyledTextInput = ({ label, isPassword, secureTextEntry, ...props }: StyledTextInputProps) => {
  const [secure, setSecure] = useState<boolean>(Boolean(isPassword ?? secureTextEntry));
  const showToggle = Boolean(isPassword);
  const inputPaddingRight = useMemo(() => (showToggle ? 48 : 15), [showToggle]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          style={[styles.input, { paddingRight: inputPaddingRight }]}
          placeholderTextColor="#8A8A8A"
          secureTextEntry={secure}
          {...props}
        />
        {showToggle && (
          <TouchableOpacity
            accessibilityLabel={secure ? 'Mostrar senha' : 'Ocultar senha'}
            onPress={() => setSecure((s) => !s)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconComponent name={secure ? 'eye' : 'eye-slash'} size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    width: '100%',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});

export default StyledTextInput;
