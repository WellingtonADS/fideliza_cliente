// src/navigation/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';

// Telas que ainda vamos criar. Usamos componentes temporários para evitar erros.
const PointListScreen = () => <View><Text>Lista de Pontos</Text></View>;
const PointDetailScreen = () => <View><Text>Detalhe dos Pontos</Text></View>;
const EditProfileScreen = () => <View><Text>Editar Perfil</Text></View>;

// Define o tipo para os parâmetros de cada tela
export type MainStackParamList = {
  HomePage: undefined;
  PointListScreen: undefined;
  PointDetailScreen: { companyId: number }; // Exemplo de parâmetro
  EditProfileScreen: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="HomePage" component={HomeScreen} />
      <MainStack.Screen name="PointListScreen" component={PointListScreen} />
      <MainStack.Screen name="PointDetailScreen" component={PointDetailScreen} />
      <MainStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
