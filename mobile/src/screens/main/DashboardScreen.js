import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useQuery } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { dashboardAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatsCard from '../../components/StatsCard';
import QuickActions from '../../components/QuickActions';
import RecentActivity from '../../components/RecentActivity';

const DashboardScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery('dashboard', dashboardAPI.getDashboard, {
    refetchInterval: 30000, // 30 seconds
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'warehouse':
        navigation.navigate('WMSStack');
        break;
      case 'transport':
        navigation.navigate('TMSStack');
        break;
      case 'hr':
        navigation.navigate('HRStack');
        break;
      case 'reports':
        navigation.navigate('ReportsStack');
        break;
      default:
        Alert.alert('Bilgi', 'Bu özellik yakında eklenecek');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Veriler yüklenirken hata oluştu</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Hoş geldin, {user?.firstName || 'Kullanıcı'}!
        </Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Genel Durum</Text>
        <View style={styles.statsGrid}>
          <StatsCard
            title="Toplam Sipariş"
            value={dashboardData?.totalOrders || 0}
            icon="📦"
            color="#1e3a8a"
          />
          <StatsCard
            title="Aktif Sevkiyat"
            value={dashboardData?.inTransitShipments || 0}
            icon="🚛"
            color="#059669"
          />
          <StatsCard
            title="Bekleyen Sipariş"
            value={dashboardData?.pendingOrders || 0}
            icon="⏳"
            color="#d97706"
          />
          <StatsCard
            title="Düşük Stok"
            value={dashboardData?.lowStockItems || 0}
            icon="⚠️"
            color="#dc2626"
          />
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <QuickActions onAction={handleQuickAction} />
      </View>

      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        <RecentActivity />
      </View>

      <View style={styles.weatherContainer}>
        <Text style={styles.sectionTitle}>Hava Durumu</Text>
        <View style={styles.weatherCard}>
          <Text style={styles.weatherText}>🌤️ 22°C - Güneşli</Text>
          <Text style={styles.weatherLocation}>İstanbul, Türkiye</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  activityContainer: {
    padding: 20,
    paddingTop: 0,
  },
  weatherContainer: {
    padding: 20,
    paddingTop: 0,
  },
  weatherCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  weatherLocation: {
    fontSize: 14,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
