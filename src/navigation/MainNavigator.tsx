import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="PointHistory" component={PointHistoryScreen} />
      <MainStack.Screen name="Rewards" component={RewardsScreen} />
      <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
      <MainStack.Screen name="PointDetail" component={PointDetailScreen} />
      <MainStack.Screen name="Companies" component={CompaniesScreen} />
      <MainStack.Screen name="Deeplink" component={DeeplinkScreen} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
