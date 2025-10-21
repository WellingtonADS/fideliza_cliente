import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getCompanies } from '../services/api';
import { CompanyDetails } from '../types/company';
import ThemedText from '../components/ThemedText';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<MainStackParamList, 'Companies'>;

const CompaniesScreen = ({ navigation }: Props) => {
  // Removemos header duplicado e usamos top bar própria da tela
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
      {/* header nativo do Navigator em uso */}
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
    backgroundColor: colors.background,
  },
  // estilos do header interno removidos
  goBackButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
  },
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.border, // Cor de fundo para o placeholder
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  companyCategory: {
    fontSize: 14,
    color: colors.accent,
    marginBottom: 5,
    fontWeight: '600',
  },
  companyAddress: {
    fontSize: 14,
    color: colors.textMuted,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
    marginTop: 50,
  },
});

export default CompaniesScreen;
