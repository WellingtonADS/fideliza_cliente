// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'; // Adicionado Text
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator'; 


const AppNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>A carregar...</Text>
      </View>
    );
  }

  return token ? <MainNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, // Cor de fundo escura, consistente com o resto do app
  },
  loadingText: {
    marginTop: 10,
    color: colors.text,
    fontSize: 16,
  }
});

export default AppNavigator;
