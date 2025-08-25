// src/screens/PointHistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getMyPointsByCompany } from '../services/api';

// Tipagem para os dados que a API retorna
interface PointsByCompany {
  total_points: number;
  company: {
    id: number;
    name: string;
  };
}

type Props = NativeStackScreenProps<MainStackParamList, 'PointHistoryScreen'>;

const PointHistoryScreen = ({ navigation }: Props) => {
  const [pointsData, setPointsData] = useState<PointsByCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true);
        const response = await getMyPointsByCompany();
        setPointsData(response.data);
      } catch (err) {
        setError('Não foi possível carregar o seu extrato de pontos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Extrato de Pontos</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={pointsData}
        keyExtractor={(item) => item.company.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.companyName}>{item.company.name}</Text>
            <Text style={styles.pointsText}>
              Saldo de Pontos: <Text style={styles.pointsValue}>{item.total_points}</Text>
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Você ainda não acumulou pontos.</Text>
          </View>
        }
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    backgroundColor: '#1E1E3F',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  pointsValue: {
    fontWeight: 'bold',
    color: '#FDD835',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#B0B0B0',
    fontSize: 16,
    marginTop: 50,
  },
});

export default PointHistoryScreen;
