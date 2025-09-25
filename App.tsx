import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthStackParamList } from './src/navigation/AuthNavigator';

// Configuração do linking para deeplink de redefinição de senha
const linking: LinkingOptions<AuthStackParamList> = {
  prefixes: ['fidelizacliente://'],
  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password',
        // O parâmetro "token" será passado automaticamente
      },
      // Adicione outros mapeamentos de tela se necessário
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <AuthProvider>
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;