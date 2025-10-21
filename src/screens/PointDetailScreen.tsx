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
import ThemedText from '../components/ThemedText';
import { colors } from '../theme/colors';

type PointDetailScreenRouteProp = RouteProp<MainStackParamList, 'PointDetail'>;

type Props = { navigation: any };

const PointDetailScreen = ({ navigation }: Props) => {
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

    const transactionTitle = isCredit ? 'Pontos ganhos' : 'Resgate de prêmio';
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
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.container}
        contentContainerStyle={transactions.length === 0 ? styles.center : { paddingTop: 8 }}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>Nenhuma transação encontrada.</ThemedText>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  transactionItem: {
    backgroundColor: colors.surface,
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
    color: colors.text,
  },
  transactionSource: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    color: colors.textMuted,
  },

});

export default PointDetailScreen;

