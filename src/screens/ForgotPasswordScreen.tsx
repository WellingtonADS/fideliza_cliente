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
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Por favor, insira o seu e-mail.');
      return;
    }
     setIsLoading(true);
    try {
      // --- LÓGICA DO BACKEND REAL ---
      const response = await requestPasswordRecovery(email);

      Alert.alert(
        'Verifique o seu E-mail',
        response.data.message, // Usa a mensagem vinda diretamente da API
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
      // -----------------------------------------

    } catch (error) {
      // Mesmo em caso de erro de rede, mostramos uma mensagem genérica por segurança
      Alert.alert(
        'Verifique o seu E-mail',
        "Se uma conta com este e-mail existir, um link de recuperação foi enviado.",
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Icon name="lock-reset" size={30} color="#FFFFFF" />
        <Text style={styles.headerText}>Recuperar Senha</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Insira o seu e-mail para receber um link de redefinição.
        </Text>

        <StyledTextInput
          label="Email"
          placeholder="Digite o seu e-mail de registo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Enviar Link de Recuperação</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.footerText}>Voltar para o Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E3F',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3D5CFF',
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 30,
    color: '#FDD835',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;