// fideliza_cliente/src/screens/PointHistoryScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PointHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Extrato de Pontos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PointHistoryScreen;