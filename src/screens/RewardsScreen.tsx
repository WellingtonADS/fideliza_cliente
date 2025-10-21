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
import Toast from 'react-native-toast-message';
// import CustomHeader from '../components/CustomHeader';
import ThemedText from '../components/ThemedText';
import { colors } from '../theme/colors';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';

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
  // Removemos o header custom para evitar duplicidade; usamos uma top bar interna padronizada
  const [rewards, setRewards] = useState<RewardStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await getMyRewardsStatus();
      setRewards(response.data);
    } catch (err) {
  setError('Não foi possível carregar os prêmios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleRedeem = (reward: RewardStatus) => {
    const redeem = async () => {
      try {
        setLoading(true);
        await redeemReward(reward.id);
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Prêmio resgatado com sucesso!'
        });
        // Atualiza lista
        fetchRewards();
      } catch (error: any) {
        setLoading(false);
        const detail = error.response?.data?.detail || 'Não foi possível resgatar o prêmio.';
        Toast.show({
          type: 'error',
          text1: 'Erro ao resgatar',
          text2: detail
        });
      }
    };

    Alert.alert(
      'Confirmar Resgate',
  `Tem certeza de que deseja resgatar "${reward.name}" por ${reward.points_required} pontos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resgatar', onPress: redeem }
      ]
    );
  };

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
        data={rewards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card>
            <View>
              <ThemedText style={styles.rewardName}>{item.name}</ThemedText>
              <ThemedText style={styles.rewardDescription}>{item.description}</ThemedText>
            </View>
            <View style={styles.pointsContainer}>
              <ThemedText style={styles.pointsRequired}>{item.points_required} pts</ThemedText>
              <ActionButton
                title={item.redeemable ? 'Resgatar' : `${item.points_to_redeem} pts restantes`}
                onPress={() => handleRedeem(item)}
                style={item.redeemable ? styles.redeemButton : styles.redeemButtonDisabled}
                textStyle={styles.redeemButtonText}
              />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <ThemedText style={styles.emptyText}>Não há prêmios disponíveis no momento.</ThemedText>
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
  // header nativo do Navigator em uso
  // goBackButton: {
  //   marginLeft: 16,
  // },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: colors.text,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  // botões do header interno removidos
  card: {
    backgroundColor: colors.surface,
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
    color: colors.text,
  },
  rewardDescription: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsRequired: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 8,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  redeemButtonDisabled: {
    backgroundColor: colors.border,
  },
  redeemButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
    marginTop: 50,
  },
});

export default RewardsScreen;
