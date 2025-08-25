import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer,LinkingOptions } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
// 2. Corrigir o caminho da importação para AuthNavigator
import { AuthStackParamList } from './src/navigation/AuthNavigator';

// 1. Defina a configuração do linking
const linking: LinkingOptions<AuthStackParamList> = {
  prefixes: ['fidelizacliente://'],
  config: {
    screens: {
      // Mapeia o caminho do URL para o nome do ecrã no seu navegador
      ResetPassword: 'reset-password',
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;