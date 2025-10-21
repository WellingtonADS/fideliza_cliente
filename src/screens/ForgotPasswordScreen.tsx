// src/screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import StyledTextInput from '../components/StyledTextInput';
import { requestPasswordRecovery } from '../services/api';
import IconComponent from '../components/IconComponent';
import ThemedText from '../components/ThemedText';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = ({ navigation }: Props) => {
  // Removemos o header custom para evitar duplicidade; usamos top bar própria padronizada
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
  Alert.alert('Atenção', 'Por favor, insira seu e-mail.');
      return;
    }
     setIsLoading(true);
    try {
      // --- LÓGICA DO BACKEND REAL ---
      const response = await requestPasswordRecovery(email);

      Alert.alert(
  'Verifique seu e-mail',
        response.data.message, // Usa a mensagem vinda diretamente da API
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
      // -----------------------------------------

    } catch (error) {
      // Mesmo em caso de erro de rede, mostramos uma mensagem genérica por segurança
      Alert.alert(
  'Verifique seu e-mail',
        "Se uma conta com este e-mail existir, um link de recuperação foi enviado.",
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <ThemedText style={styles.subtitle}>
          Insira o seu e-mail para receber um link de redefinição.
        </ThemedText>

        <StyledTextInput
          label="E-mail"
          placeholder="Digite seu e-mail de registro"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <ThemedText style={styles.buttonText}>Enviar Link</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ThemedText style={styles.footerText}>Voltar para o Login</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
  },
    goBackButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primaryDark,
      borderRadius: 8,
      marginLeft: 16,
    },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: colors.text,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
  },
  footerText: {
    color: colors.accent,
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // goBackButton style removed (duplicate)
});

export default ForgotPasswordScreen;