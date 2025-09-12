import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getClientDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardData } from '../types/dashboard';
import IconComponent from '../components/IconComponent';
import CustomHeader from '../components/CustomHeader';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader title="Início" showBack={true} />,
    });
  }, [navigation]);
  const { user, signOut } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const response = await getClientDashboard();
      setData(response);
    } catch (err) {
      setError('Não foi possível carregar os dados do dashboard.');
      console.error(err);
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const ultimaLoja = data?.last_activity?.company?.name || 'Nenhuma';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <IconComponent icon="home" size={24} color="#FFFFFF" />
          <Text style={styles.topBarTitle}>Início</Text>
        </View>
            <TouchableOpacity style={styles.goBackButton} onPress={signOut}>
              <Text style={styles.closeButton}>Sair</Text>
            </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.centerArea}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerArea}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={[styles.button,{marginTop:16}]} onPress={() => load()}>
            <Text style={styles.buttonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#fff" />}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.greetingRow}>
            <Text style={styles.title}>Olá, <Text style={styles.highlight}>{user?.name || 'Cliente'}</Text>!</Text>
          </View>

            <Card>
              <Text style={styles.cardTitle}>Seu QR Code de Fidelidade</Text>
              <View style={styles.qrCodeContainer}>
                {data?.qr_code_base64 ? (
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
            </Card>

            <Card>
              <Text style={styles.cardTitle}>Resumo de Pontos</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total de Pontos:</Text>
                <Text style={styles.infoValue}>{data?.total_points ?? 0}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Última Loja Visitada:</Text>
                <Text style={styles.infoValue}>{ultimaLoja}</Text>
              </View>
            </Card>

            <Card>
              <Text style={[styles.cardTitle,{marginBottom:10}]}>Ações Rápidas</Text>
              <ActionButton title="Ver Extrato Completo" onPress={() => navigation.navigate('PointHistory')} />
              <ActionButton title="Explorar Lojas" onPress={() => navigation.navigate('Companies')} />
              <ActionButton title="Ver Prémios e Recompensas" onPress={() => navigation.navigate('Rewards')} />
              <ActionButton title="Editar Perfil" onPress={() => navigation.navigate('EditProfile')} />
            </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#1E1E3F',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarTitle: {
    marginLeft: 10,
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  highlight: {
    color: '#FFFFFF'
  },
  greetingRow: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  actionButton: {
    backgroundColor: '#3D5CFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
      goBackButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#8282a3ff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      closeButton: {
        fontSize: 16,
        color: '#FDD835',
        fontWeight: 'bold',
      },
});

export default HomeScreen;
