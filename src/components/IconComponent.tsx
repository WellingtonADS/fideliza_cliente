import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { AppIcons, AppIconKey } from './iconNames';

// Tipagem dos props seguindo o padrão usado em fideliza_gestao
export type IconComponentProps = {
  name?: string;         // Nome direto FontAwesome (prioridade sobre 'icon')
  icon?: AppIconKey;     // Chave semântica do mapeamento AppIcons
  size?: number;         // Tamanho (default 30)
  color?: string;        // Cor (default #000)
  label?: string;        // Rótulo opcional abaixo do ícone
  containerStyle?: ViewStyle; // Estilo extra para o container
  labelStyle?: TextStyle;     // Estilo extra para o texto
};

const IconComponent: React.FC<IconComponentProps> = ({
  name,
  icon,
  size = 30,
  color = '#000',
  label,
  containerStyle,
  labelStyle,
}) => {
  const resolvedName = name || (icon ? AppIcons[icon] : 'question');
  return (
    <View style={[styles.container, containerStyle]}>
      <FontAwesome name={resolvedName} size={size} color={color} />
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
});

export default IconComponent;
