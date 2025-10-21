import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import HomeScreen from '../screens/HomeScreen';
import PointHistoryScreen from '../screens/PointHistoryScreen';
import RewardsScreen from '../screens/RewardsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PointDetailScreen from '../screens/PointDetailScreen';
import CompaniesScreen from '../screens/CompaniesScreen';
import DeeplinkScreen from '../screens/DeeplinkScreen';

// CORREÇÃO: Nomes das rotas padronizados para consistência
export type MainStackParamList = {
  Home: undefined;
  PointHistory: undefined;
  Rewards: undefined; 
  EditProfile: undefined;
  PointDetail: { companyId: number; companyName: string };
  Companies: undefined;
  Deeplink: { info?: string } | undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' as '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <MainStack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <MainStack.Screen name="PointHistory" component={PointHistoryScreen} options={{ title: 'Histórico de pontos' }} />
      <MainStack.Screen name="Rewards" component={RewardsScreen} options={{ title: 'Prêmios' }} />
      <MainStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar perfil' }} />
      <MainStack.Screen name="PointDetail" component={PointDetailScreen} options={{ title: 'Detalhes dos pontos' }} />
      <MainStack.Screen name="Companies" component={CompaniesScreen} options={{ title: 'Lojas' }} />
      <MainStack.Screen name="Deeplink" component={DeeplinkScreen} options={{ title: 'Deeplink' }} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
