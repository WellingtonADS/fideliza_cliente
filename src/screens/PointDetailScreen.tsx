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
import Icon from 'react-native-vector-icons/MaterialIcons';

type PointDetailScreenRouteProp = RouteProp<MainStackParamList, 'PointDetail'>;

const PointDetailScreen = () => {
  const route = useRoute<PointDetailScreenRouteProp>();
  const { companyId } = route.params;

  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
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
    const isCredit = item.points > 0;
    const pointsText = isCredit ? `+${item.points}` : `${item.points}`;
    const date = new Date(item.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const time = new Date(item.created_at).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const transactionTitle = isCredit ? 'Pontos Ganhos' : 'Resgate de Prémio';
    const transactionSource = item.awarded_by ? `Por: ${item.awarded_by.name}` : '';

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{transactionTitle}</Text>
          {!!transactionSource && (
            <Text style={styles.transactionSource}>{transactionSource}</Text>
          )}
          <Text style={styles.transactionDate}>
            {date} às {time}
          </Text>
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
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <Icon name="receipt" size={30} color="#FFFFFF" />
        <Text style={styles.headerText}>Detalhes dos Pontos</Text>
      </View>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.container}
        contentContainerStyle={transactions.length === 0 ? styles.center : { paddingTop: 8 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E3F',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: '#FFFFFF',
  },
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  transactionDetails: {
    flex: 1,
    marginRight: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionSource: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#6c757d',
  },
});

export default PointDetailScreen;