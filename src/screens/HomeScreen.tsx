// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { getDashboardData } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Etapa 1: Interface atualizada para corresponder à API real
interface DashboardData {
  total_points: number;
  last_activity: {
    awarded_by: {
      name: string;
    };
  } | null; // A atividade pode ser nula se não houver nenhuma
  qr_code_base64?: string; // O QR code é opcional, pois não está a vir da API ainda
}

const HomeScreen = () => {
  const { user, signOut } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDashboardData();
        setData(response.data);
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

    // Etapa 2: Lógica para extrair os dados da estrutura aninhada
    const ultimaLoja = data.last_activity ? data.last_activity.awarded_by.name : 'Nenhuma';

    return (
      <>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Seu QR Code de Fidelidade</Text>
          <View style={styles.qrCodeContainer}>
            {/* Etapa 3: Exibir o QR Code apenas se ele existir na resposta da API */}
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
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {user?.name || 'Cliente'}!</Text>
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
    padding: 20,
    alignItems: 'center',
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
});

export default HomeScreen;