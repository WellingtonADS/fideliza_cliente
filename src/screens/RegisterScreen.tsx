// src/screens/RegisterScreen.tsx
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
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import StyledTextInput from '../components/StyledTextInput';
import IconComponent from '../components/IconComponent';
import ThemedText from '../components/ThemedText';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  // Removido header custom para evitar duplicidade; usamos TopBar interna
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    try {
      await signUp({ name, email, password });
      // O AppNavigator irá redirecionar automaticamente para a HomePage
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro no Registro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <ThemedText variant="h1" style={styles.title}>Inscreva-se</ThemedText>
        <ThemedText style={styles.subtitle}>Entre com e-mail e senha:</ThemedText>

        <StyledTextInput
          label="Nome Completo"
          placeholder="Digite seu nome completo"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <StyledTextInput
          label="Email"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <StyledTextInput
          label="Senha"
          placeholder="Crie uma senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <StyledTextInput
          label="Confirme a Senha"
          placeholder="Digite a senha novamente"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <ThemedText style={styles.buttonText}>Cadastrar</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <ThemedText style={styles.footerText}>Já tem conta? <Text style={styles.link}>Clique Aqui.</Text></ThemedText>
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
    marginLeft: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
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
    padding: 30,
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
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 30,
    color: colors.textMuted,
    fontSize: 14,
  },
  link: {
    color: colors.accent,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
