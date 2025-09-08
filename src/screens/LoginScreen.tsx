// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import StyledTextInput from '../components/StyledTextInput'; // Nosso novo componente
import Icon from 'react-native-vector-icons/MaterialIcons';

// Tipagem para as props de navegação
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha o email e a senha.');
      return;
    }
    setIsLoading(true);
    try {
      await signIn({ email, password });
      // O AppNavigator irá redirecionar automaticamente para a HomePage
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Icon name="login" size={30} color="#FFFFFF" />
        <Text style={styles.headerText}>Login</Text>
      </View>
      <View style={styles.content}>
        <Image source={require('../assets/images/logo_fideliza.png')} style={styles.logo} />
        <Text style={styles.title}>Fideliza+</Text>
        <Text style={styles.subtitle}>O programa de fidelidade que te valoriza</Text>

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
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.footerText}>Esqueceu a senha? <Text style={styles.link}>Clique aqui.</Text></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>Não tem conta? <Text style={styles.link}>Clique aqui.</Text></Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  logo: {
    width: 400,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
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
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 10,
  },
  link: {
    color: '#FDD835', // Um amarelo para destaque
    fontWeight: 'bold',
  },
});

export default LoginScreen;
