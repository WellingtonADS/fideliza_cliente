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
import IconComponent from '../components/IconComponent';
import Toast from 'react-native-toast-message';
import CustomHeader from '../components/CustomHeader';
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
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader title="Recompensas" showBack={true} />,
    });
  }, [navigation]);
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
      `Tem a certeza de que deseja resgatar "${reward.name}" por ${reward.points_required} pontos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resgatar', onPress: redeem }
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconComponent icon="rewards" size={26} color="#FFFFFF" />
        <Text style={styles.headerText}>Prêmios</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.closeButton}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card>
            <View>
              <Text style={styles.rewardName}>{item.name}</Text>
              <Text style={styles.rewardDescription}>{item.description}</Text>
            </View>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsRequired}>{item.points_required} pts</Text>
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
            <Text style={styles.emptyText}>Não há prémios disponíveis de momento.</Text>
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
    backgroundColor: '#0A0A2A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1E1E3F',
    justifyContent: 'space-between',
  },
  // goBackButton: {
  //   marginLeft: 16,
  // },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0A2A',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  goBackButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#8282a3ff',
    borderRadius: 8,
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
  emptyText: {
    color: '#B0B0B0',
    fontSize: 16,
    marginTop: 50,
  },
});

export default RewardsScreen;
