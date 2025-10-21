import React, { useState, useEffect, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getClientDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardData } from '../types/dashboard';
import IconComponent from '../components/IconComponent';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';
import { colors } from '../theme/colors';
import ThemedText from '../components/ThemedText';

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const { user, signOut, token, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false, _retry = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const response = await getClientDashboard();
      setData(response);
    } catch (err) {
      // Se falha transitória (sem resposta ou 5xx/timeout), tenta uma vez automaticamente
      const isAxiosErr = axios.isAxiosError(err);
      const status = isAxiosErr ? err.response?.status : undefined;
      const isTransient = !isAxiosErr || !err.response || (status && status >= 500);
      if (!_retry && isTransient) {
        // pequeno atraso para evitar bombardeio em cold start de infraestrutura
        await new Promise(r => setTimeout(r, 800));
        return load(isRefresh, true);
      }
      setError('Não foi possível carregar os dados do dashboard.');
      console.error('Dashboard load error:', err);
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
    }
  };

  // Carrega quando a tela ganha foco e a autenticação está pronta
  useFocusEffect(
    useCallback(() => {
      if (!isAuthLoading && token) {
        load();
      }
      // Sem cleanup necessário
      return () => {};
    }, [isAuthLoading, token])
  );

  const ultimaLoja = data?.last_activity?.company?.name || 'Nenhuma';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={signOut}>
          <Text style={{ color: colors.accent, fontWeight: '700' }}>Sair</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, signOut]);

  return (
    <SafeAreaView style={styles.safeArea}>

      {loading && (
        <View style={styles.centerArea}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerArea}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={[styles.button,{marginTop:16}]} onPress={() => load()}>
            <ThemedText style={styles.buttonText}>Tentar Novamente</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#fff" />}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.greetingRow}>
            <ThemedText variant="h1" style={styles.title}>Olá, <Text style={styles.highlight}>{user?.name || 'Cliente'}</Text>!</ThemedText>
          </View>

            <Card>
              <ThemedText variant="h2" style={styles.cardTitle}>Seu QR Code de Fidelidade</ThemedText>
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
              <ThemedText variant="h2" style={styles.cardTitle}>Resumo de Pontos</ThemedText>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total de Pontos:</Text>
                <Text style={styles.infoValue}>{data?.total_points ?? 0}</Text>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Última loja visitada:</ThemedText>
                <ThemedText style={styles.infoValue}>{ultimaLoja}</ThemedText>
              </View>
            </Card>

            <Card>
              <Text style={[styles.cardTitle,{marginBottom:10}]}>Ações Rápidas</Text>
              <ActionButton title="Ver Extrato Completo" onPress={() => navigation.navigate('PointHistory')} />
              <ActionButton title="Explorar Lojas" onPress={() => navigation.navigate('Companies')} />
              <ActionButton title="Ver prêmios e recompensas" onPress={() => navigation.navigate('Rewards')} />
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
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  highlight: {
    color: colors.text
  },
  greetingRow: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: colors.error,
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
    backgroundColor: colors.surface,
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
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    backgroundColor: colors.text,
    borderRadius: 8,
  },
  qrCodePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodePlaceholderText: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default HomeScreen;
