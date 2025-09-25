import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DeeplinkScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deeplink recebido!</Text>
      <Text style={styles.subtitle}>Esta é a tela aberta via deeplink.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default DeeplinkScreen;
