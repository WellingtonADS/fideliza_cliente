import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getClientDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardData } from '../types/dashboard';

// CORREÇÃO: Alinhado o nome da rota para 'Home'
type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  // CORREÇÃO: Usar 'signOut' em vez de 'logout'
  const { user, signOut } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getClientDashboard();
        setData(response);
      } catch (err) {
        setError('Não foi possível carregar os dados do dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#FFFFFF" />;
    }

    if (error || !data) {
      return <Text style={styles.errorText}>{error || 'Dados não encontrados.'}</Text>;
    }

    // Substitua 'awarded_by' por uma propriedade existente, por exemplo 'company'
    const ultimaLoja = data.last_activity?.company?.name ?? 'Nenhuma';

    return (
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Seu QR Code de Fidelidade</Text>
          <View style={styles.qrCodeContainer}>
            {data.qr_code_base64 ? (
              <Image
                style={styles.qrCodeImage}
                source={{ uri: `data:image/png;base64,${data.qr_code_base64}` }}
              />
            ) : (
              <View style={[styles.qrCodeImage, styles.qrCodePlaceholder]}>
                <Text style={styles.qrCodePlaceholderText}>QR Code indisponível</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo de Pontos</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total de Pontos:</Text>
            <Text style={styles.infoValue}>{data.total_points}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Última Loja Visitada:</Text>
            <Text style={styles.infoValue}>{ultimaLoja}</Text>
          </View>
        </View>

        {/* Secção de Botões de Navegação */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('PointHistory')}
          >
            <Text style={styles.buttonText}>Ver Extrato Completo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Companies')}
          >
            <Text style={styles.buttonText}>Explorar Lojas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Rewards')}
          >
            <Text style={styles.buttonText}>Ver Prémios e Recompensas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.title}>Olá, {user?.name || 'Cliente'}!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signOut}>
            <Text style={styles.logoutButton}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

// Seus estilos permanecem os mesmos
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    fontSize: 16,
    color: '#FDD835',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E1E3F',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  qrCodePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodePlaceholderText: {
    color: '#B0B0B0',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#3D5CFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
