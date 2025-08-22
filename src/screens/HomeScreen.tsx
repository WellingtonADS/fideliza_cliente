// fideliza_cliente/src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getDashboardData } from '../services/api';
import { useAuth } from '../context/AuthContext';

// 1. Definir uma interface para a estrutura dos dados do dashboard
interface DashboardData {
  total_pontos: number;
  ultima_loja: string;
}

const HomeScreen = () => {
  const { user } = useAuth();
  // 2. Especificar os tipos de dados para os estados
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Pode ser string ou null

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardData();
        setData(response.data);
      } catch (err) {
        setError('Não foi possível carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {user?.name || 'Cliente'}!</Text>
      <Text>Total de Pontos: {data?.total_pontos || 0}</Text>
      <Text>Última Loja: {data?.ultima_loja || 'Nenhuma'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});

export default HomeScreen;