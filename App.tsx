import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import React from 'react';
import { NavigationContainer, LinkingOptions, DefaultTheme, Theme } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthStackParamList } from './src/navigation/AuthNavigator';
import { colors } from './src/theme/colors';

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
  const navTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      primary: colors.primary,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer linking={linking} theme={navTheme}>
      <AuthProvider>
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;