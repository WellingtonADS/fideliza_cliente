import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getCompanies } from '../services/api';
import { CompanyDetails } from '../types/company';
import IconComponent from '../components/IconComponent';
import CustomHeader from '../components/CustomHeader';

type Props = NativeStackScreenProps<MainStackParamList, 'Companies'>;

const CompaniesScreen = ({ navigation }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader title="Lojas" showBack={true} />,
    });
  }, [navigation]);
  const [companies, setCompanies] = useState<CompanyDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError('Não foi possível carregar a lista de lojas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const renderCompanyCard = ({ item }: { item: CompanyDetails }) => (
    <View style={styles.card}>
      <Image
        style={styles.logo}
        source={{ uri: item.logo_url || 'https://placehold.co/100x100/1E1E3F/FFFFFF?text=Logo' }}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.companyName}>{item.name}</Text>
        <Text style={styles.companyCategory}>{item.category || 'Categoria não informada'}</Text>
        <Text style={styles.companyAddress}>{item.address || 'Endereço não informado'}</Text>
      </View>
    </View>
  );

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
        <IconComponent icon="companies" size={26} color="#FFFFFF" />
        <Text style={styles.headerText}>Lojas</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.closeButton}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCompanyCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Nenhuma loja parceira encontrada.</Text>
          </View>
        }
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
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#1E1E3F',
  },
  goBackButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#8282a3ff',
    borderRadius: 8,
  },
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
    alignItems: 'center',
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
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#1E1E3F',
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#4A4A6A', // Cor de fundo para o placeholder
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  companyCategory: {
    fontSize: 14,
    color: '#FDD835',
    marginBottom: 5,
    fontWeight: '600',
  },
  companyAddress: {
    fontSize: 14,
    color: '#B0B0B0',
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

export default CompaniesScreen;
