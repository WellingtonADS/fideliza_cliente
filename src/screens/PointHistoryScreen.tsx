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
import IconComponent from '../components/IconComponent';
import ThemedText from '../components/ThemedText';
import { colors } from '../theme/colors';

// Tipagem para os dados que a API retorna
interface PointsByCompany {
  total_points: number;
  company: {
    id: number;
    name: string;
  };
}

type Props = NativeStackScreenProps<MainStackParamList, 'PointHistory'>;

const PointHistoryScreen = ({ navigation }: Props) => {
  const [pointsData, setPointsData] = useState<PointsByCompany[]>([]);
  const [loading, setLoading] = useState(true);

  // Header interno padronizado com TopBar
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
  <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
  <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={pointsData}
        keyExtractor={(item) => item.company.id.toString()}
        renderItem={({ item }) => (
          // ------ INÍCIO DA CORREÇÃO ------
          <TouchableOpacity
            style={styles.card}
            // Navega para a tela 'PointDetail' passando os dados da empresa
            onPress={() =>
              navigation.navigate('PointDetail', {
                companyId: item.company.id,
                companyName: item.company.name,
              })
            }
          >
            <ThemedText style={styles.companyName}>{item.company.name}</ThemedText>
            <ThemedText style={styles.pointsText}>
              Saldo de pontos: <Text style={styles.pointsValue}>{item.total_points}</Text>
            </ThemedText>
          </TouchableOpacity>
          // ------ FIM DA CORREÇÃO ------
        )}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <ThemedText style={styles.emptyText}>Você ainda não acumulou pontos.</ThemedText>
          </View>
        }
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  pointsValue: {
    fontWeight: 'bold',
    color: colors.accent,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
    marginTop: 50,
  },
});

export default PointHistoryScreen;