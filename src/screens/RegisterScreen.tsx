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
import CustomHeader from '../components/CustomHeader';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader title="Cadastro" showBack={true} />,
    });
  }, [navigation]);
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
      Alert.alert('Erro no Registo', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
  <IconComponent icon="register" size={26} color="#FFFFFF" />
        <Text style={styles.headerText}>Registrar</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.closeButton}>Voltar</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Inscreva-se</Text>
        <Text style={styles.subtitle}>Entre com e-mail e senha:</Text>

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
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>Já tem conta? <Text style={styles.link}>Clique Aqui.</Text></Text>
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
    color: '#B0B0B0',
    fontSize: 14,
  },
  link: {
    color: '#FDD835',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
