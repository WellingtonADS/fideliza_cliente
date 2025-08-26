// src/screens/PointDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getPointTransactionsByCompany } from '../services/api';
import { PointTransaction } from '../types/points';

type PointDetailScreenRouteProp = RouteProp<MainStackParamList, 'PointDetail'>;

const PointDetailScreen = () => {
  const route = useRoute<PointDetailScreenRouteProp>();
  const { companyId } = route.params;

  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getPointTransactionsByCompany(companyId);
        setTransactions(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o histórico de transações.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [companyId]);

  const renderItem = ({ item }: { item: PointTransaction }) => {
    const isCredit = item.points_added > 0;
    const pointsText = isCredit ? `+${item.points_added}` : `${item.points_added}`;
    const date = new Date(item.timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.transactionItem}>
        <View>
          <Text style={styles.transactionType}>
            {item.transaction_type === 'reward_redeem' ? 'Resgate de Prémio' : 'Pontos Ganhos'}
          </Text>
          <Text style={styles.transactionDate}>{date}</Text>
        </View>
        <Text style={[styles.points, { color: isCredit ? '#28a745' : '#dc3545' }]}>
          {pointsText}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>Nenhuma transação encontrada.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PointDetailScreen;