// src/screens/EditProfileScreen.tsx
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
import { MainStackParamList } from '../navigation/MainNavigator';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../services/api';
import StyledTextInput from '../components/StyledTextInput';

type Props = NativeStackScreenProps<MainStackParamList, 'EditProfileScreen'>;

const EditProfileScreen = ({ navigation }: Props) => {
  const { user, refreshUser } = useAuth(); // Usamos refreshUser para atualizar o contexto
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (password && password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const payload: { name?: string; password?: string } = {};
      if (name !== user?.name) {
        payload.name = name;
      }
      if (password) {
        payload.password = password;
      }

      if (Object.keys(payload).length === 0) {
        Alert.alert('Informação', 'Nenhuma alteração foi feita.');
        setLoading(false);
        return;
      }

      await updateMyProfile(payload);
      await refreshUser(); // Atualiza os dados do utilizador no contexto global

      Alert.alert('Sucesso', 'O seu perfil foi atualizado.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o seu perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Perfil</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <StyledTextInput
          label="Nome Completo"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.infoText}>Deixe os campos de senha em branco se não quiser alterá-la.</Text>
        <StyledTextInput
          label="Nova Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <StyledTextInput
          label="Confirmar Nova Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Salvar Alterações</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ... (Adicione os estilos abaixo)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E3F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 16,
    color: '#FDD835',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  infoText: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
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
});

export default EditProfileScreen;
