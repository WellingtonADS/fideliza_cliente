// src/screens/ResetPasswordScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import StyledTextInput from '../components/StyledTextInput';
import { resetPassword } from '../services/api';

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;
type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = ({ navigation }: Props) => {
  const route = useRoute<ResetPasswordRouteProp>();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.token) {
      setToken(route.params.token);
    }
  }, [route.params?.token]);

  const handleReset = async () => {
    if (!token || !newPassword || !confirmPassword) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      Alert.alert(
        'Sucesso',
        'A sua senha foi redefinida com sucesso. Por favor, faça o login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      const detail = error.response?.data?.detail || 'Não foi possível redefinir a senha.';
      Alert.alert('Erro', detail);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Redefinir Senha</Text>
        <StyledTextInput
          label="Token de Recuperação"
          placeholder="Cole o token do seu e-mail"
          value={token}
          onChangeText={setToken}
        />
        <StyledTextInput
          label="Nova Senha"
          placeholder="Digite a sua nova senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <StyledTextInput
          label="Confirmar Nova Senha"
          placeholder="Digite a nova senha novamente"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Redefinir Senha</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>Voltar para o Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A2A',
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
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3D5CFF',
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
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

export default ResetPasswordScreen;
