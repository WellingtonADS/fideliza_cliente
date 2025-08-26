// src/navigation/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PointHistoryScreen from '../screens/PointHistoryScreen';
import RewardsScreen from '../screens/RewardsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PointDetailScreen from '../screens/PointDetailScreen';


// Define o tipo para os parâmetros de cada tela
export type MainStackParamList = {
  HomePage: undefined;
  PointHistoryScreen: undefined;
  RewardsScreen: undefined; 
  PointDetailScreen: { companyId: number };
  EditProfileScreen: undefined;
  PointDetail: { companyId: number; companyName: string };
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="HomePage" component={HomeScreen} options={{ title: 'Home' }} />
      <MainStack.Screen name="PointHistoryScreen" component={PointHistoryScreen} options={{ title: 'Histórico de Pontos' }} />
      <MainStack.Screen name="RewardsScreen" component={RewardsScreen} options={{ title: 'Recompensas' }} />
      <MainStack.Screen name="PointDetailScreen" component={PointDetailScreen} options={{ title: 'Detalhes dos Pontos' }} />
      <MainStack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
      <MainStack.Screen name="PointDetail" component={PointDetailScreen} options={({ route }) => ({
          title: route.params?.companyName || 'Detalhes da Empresa',
        })} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
