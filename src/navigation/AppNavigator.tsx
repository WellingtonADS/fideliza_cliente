// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'; // Adicionado Text
import { useAuth } from '../context/AuthContext';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator'; 

const AppNavigator = () => {
  const { token, isLoading } = useAuth();

  // Mostra um indicador de loading enquanto o estado de autenticação é verificado
  if (isLoading) {
    return (
      // CORREÇÃO: Adicionamos uma cor de fundo e um texto de feedback
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>A carregar...</Text>
      </View>
    );
  }

  // Se houver um token, mostra o MainNavigator; senão, o AuthNavigator.
  return token ? <MainNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A2A', // Cor de fundo escura, consistente com o resto do app
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
  }
});

export default AppNavigator;
