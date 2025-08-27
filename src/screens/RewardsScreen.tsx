// src/screens/RewardsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getMyRewardsStatus, redeemReward } from '../services/api';

// Tipagem para os dados que a API /rewards/my-status retorna
interface RewardStatus {
  id: number;
  name: string;
  description: string;
  points_required: number;
  redeemable: boolean;
  points_to_redeem: number;
}

type Props = NativeStackScreenProps<MainStackParamList, 'Rewards'>;

const RewardsScreen = ({ navigation }: Props) => {
  const [rewards, setRewards] = useState<RewardStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await getMyRewardsStatus();
      setRewards(response.data);
    } catch (err) {
      setError('Não foi possível carregar os prémios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleRedeem = (reward: RewardStatus) => {
    Alert.alert(
      'Confirmar Resgate',
      `Tem a certeza de que deseja resgatar "${reward.name}" por ${reward.points_required} pontos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await redeemReward(reward.id);
              Alert.alert('Sucesso!', 'Prémio resgatado com sucesso.');
              fetchRewards(); // Atualiza a lista após o resgate
            } catch (err: any) {
              const detail = err.response?.data?.detail || 'Não foi possível resgatar o prémio.';
              Alert.alert('Erro', detail);
            }
          },
        },
      ]
    );
  };

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
        <Text style={styles.title}>Prémios Disponíveis</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.rewardName}>{item.name}</Text>
              <Text style={styles.rewardDescription}>{item.description}</Text>
            </View>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsRequired}>{item.points_required} pts</Text>
              <TouchableOpacity
                style={[styles.redeemButton, !item.redeemable && styles.redeemButtonDisabled]}
                disabled={!item.redeemable}
                onPress={() => handleRedeem(item)}
              >
                <Text style={styles.redeemButtonText}>
                  {item.redeemable ? 'Resgatar' : `${item.points_to_redeem} pts restantes`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Não há prémios disponíveis de momento.</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rewardName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    rewardDescription: {
        fontSize: 14,
        color: '#B0B0B0',
        marginTop: 4,
    },
    pointsContainer: {
        alignItems: 'flex-end',
    },
    pointsRequired: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FDD835',
        marginBottom: 8,
    },
    redeemButton: {
        backgroundColor: '#3D5CFF',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    redeemButtonDisabled: {
        backgroundColor: '#4A4A6A',
    },
    redeemButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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

export default RewardsScreen;
