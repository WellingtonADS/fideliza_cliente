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
import IconComponent from '../components/IconComponent';
import ThemedText from '../components/ThemedText';
import { colors } from '../theme/colors';

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;
type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = ({ navigation }: Props) => {
  // Removemos o header custom para evitar duplicidade; usamos top bar interna padronizada
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
        'Sua senha foi redefinida com sucesso. Por favor, faça login.',
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <StyledTextInput
          label="Token de recuperação"
          placeholder="Cole o token do seu e-mail"
          value={token}
          onChangeText={setToken}
        />
        <StyledTextInput
          label="Nova senha"
          placeholder="Digite a nova senha"
          value={newPassword}
          onChangeText={setNewPassword}
          isPassword
        />
        <StyledTextInput
          label="Confirmar nova senha"
          placeholder="Confirme a nova senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
        />
        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <ThemedText style={styles.buttonText}>Redefinir Senha</ThemedText>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
      marginLeft: 10,
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
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 30,
    color: colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerText: {
    fontSize: 22,
    color: colors.text,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
});

export default ResetPasswordScreen;
