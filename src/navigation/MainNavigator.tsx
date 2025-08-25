// src/navigation/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PointHistoryScreen from '../screens/PointHistoryScreen';
import RewardsScreen from '../screens/RewardsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

// Telas que ainda vamos criar. Usamos componentes temporários para evitar erros.
const PointDetailScreen = () => <View><Text>Detalhe dos Pontos</Text></View>;


// Define o tipo para os parâmetros de cada tela
export type MainStackParamList = {
  HomePage: undefined;
  PointHistoryScreen: undefined;
  RewardsScreen: undefined; 
  PointDetailScreen: { companyId: number };
  EditProfileScreen: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="HomePage" component={HomeScreen} />
      <MainStack.Screen name="PointHistoryScreen" component={PointHistoryScreen} />
      <MainStack.Screen name="RewardsScreen" component={RewardsScreen} />
      <MainStack.Screen name="PointDetailScreen" component={PointDetailScreen} />
      <MainStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
