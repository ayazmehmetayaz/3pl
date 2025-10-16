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
import { useAuth } from '../../context/AuthContext';
import { warehouseAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatsCard from '../../components/StatsCard';
import QuickActions from '../../components/QuickActions';
import RecentActivity from '../../components/RecentActivity';

const WarehouseDashboardScreen = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery('warehouse-dashboard', warehouseAPI.getDashboard, {
    refetchInterval: 30000, // 30 seconds
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'inventory':
        // Navigate to inventory screen
        break;
      case 'pick-list':
        // Navigate to pick list screen
        break;
      case 'cycle-count':
        // Navigate to cycle count screen
        break;
      case 'receiving':
        // Navigate to receiving screen
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
          Hoş geldin, {user?.firstName || 'Depocu'}!
        </Text>
        <Text style={styles.roleText}>Depo Operasyonu</Text>
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
        <Text style={styles.sectionTitle}>Depo Durumu</Text>
        <View style={styles.statsGrid}>
          <StatsCard
            title="Toplam Stok"
            value={dashboardData?.totalInventory || 0}
            icon="📦"
            color="#059669"
          />
          <StatsCard
            title="Düşük Stok"
            value={dashboardData?.lowStockItems || 0}
            icon="⚠️"
            color="#dc2626"
          />
          <StatsCard
            title="Bekleyen Toplama"
            value={dashboardData?.pendingPicks || 0}
            icon="⏳"
            color="#d97706"
          />
          <StatsCard
            title="Aktif Sayım"
            value={dashboardData?.activeCounts || 0}
            icon="🔢"
            color="#7c3aed"
          />
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <QuickActions 
          actions={[
            { id: 'inventory', title: 'Stok Yönetimi', icon: '📦', color: '#059669' },
            { id: 'pick-list', title: 'Toplama Listesi', icon: '📋', color: '#1e3a8a' },
            { id: 'cycle-count', title: 'Stok Sayımı', icon: '🔢', color: '#7c3aed' },
            { id: 'receiving', title: 'Mal Kabul', icon: '📥', color: '#dc2626' },
          ]}
          onAction={handleQuickAction}
        />
      </View>

      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        <RecentActivity />
      </View>

      <View style={styles.warehouseInfoContainer}>
        <Text style={styles.sectionTitle}>Depo Bilgileri</Text>
        <View style={styles.warehouseCard}>
          <Text style={styles.warehouseName}>Ana Depo - İstanbul</Text>
          <Text style={styles.warehouseStatus}>🟢 Aktif</Text>
          <Text style={styles.warehouseCapacity}>Kapasite: %75 Dolu</Text>
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
    backgroundColor: '#059669',
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: '#d1fae5',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#a7f3d0',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
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
  warehouseInfoContainer: {
    padding: 20,
    paddingTop: 0,
  },
  warehouseCard: {
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
  warehouseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  warehouseStatus: {
    fontSize: 16,
    color: '#059669',
    marginBottom: 4,
  },
  warehouseCapacity: {
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
    backgroundColor: '#059669',
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

export default WarehouseDashboardScreen;
