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
import CustomHeader from '../components/CustomHeader';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = ({ navigation }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader title="Recuperar Senha" showBack={true} />,
    });
  }, [navigation]);
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
        <IconComponent icon="recoverPassword" size={26} color="#FFFFFF" />
        <Text style={styles.headerText}>Recuperar Senha</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.closeButton}>Voltar</Text>
        </TouchableOpacity>
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
  closeButton: {
    fontSize: 16,
    color: '#FDD835',
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1E1E3F',
    justifyContent: 'space-between',
  },
    goBackButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#8282a3ff',
      borderRadius: 8,
      marginLeft: 16,
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
  },
  footerText: {
    color: '#FDD835',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // goBackButton style removed (duplicate)
});

export default ForgotPasswordScreen;