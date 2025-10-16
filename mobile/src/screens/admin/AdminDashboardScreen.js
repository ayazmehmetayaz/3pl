import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeOrders: 89,
    totalRevenue: 245678,
    systemHealth: 98.5
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statContent}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  const QuickAction = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
      <Icon name={icon} size={24} color="white" />
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Ayaz Lojistik ERP</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers}
          icon="people"
          color="#dc2626"
          onPress={() => navigation.navigate('AdminUsers')}
        />
        <StatCard
          title="Aktif Sipariş"
          value={stats.activeOrders}
          icon="shopping-cart"
          color="#059669"
          onPress={() => Alert.alert('Siparişler', 'Sipariş detaylarına gidiliyor')}
        />
        <StatCard
          title="Toplam Gelir"
          value={`${stats.totalRevenue.toLocaleString()} TL`}
          icon="attach-money"
          color="#7c3aed"
          onPress={() => Alert.alert('Gelir', 'Gelir raporlarına gidiliyor')}
        />
        <StatCard
          title="Sistem Sağlığı"
          value={`%${stats.systemHealth}`}
          icon="health-and-safety"
          color="#0891b2"
          onPress={() => Alert.alert('Sistem', 'Sistem durumu detayları')}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.actionsGrid}>
          <QuickAction
            title="Kullanıcı Ekle"
            icon="person-add"
            color="#dc2626"
            onPress={() => Alert.alert('Kullanıcı', 'Yeni kullanıcı ekleme formu')}
          />
          <QuickAction
            title="Sistem Ayarları"
            icon="settings"
            color="#059669"
            onPress={() => navigation.navigate('AdminSettings')}
          />
          <QuickAction
            title="Raporlar"
            icon="assessment"
            color="#7c3aed"
            onPress={() => Alert.alert('Raporlar', 'Sistem raporları')}
          />
          <QuickAction
            title="Yedekleme"
            icon="backup"
            color="#0891b2"
            onPress={() => Alert.alert('Yedekleme', 'Sistem yedekleme başlatılıyor')}
          />
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.activitiesContainer}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <Icon name="person-add" size={20} color="#059669" />
            <Text style={styles.activityText}>Yeni kullanıcı eklendi: Ahmet Yılmaz</Text>
            <Text style={styles.activityTime}>2 dk önce</Text>
          </View>
          <View style={styles.activityItem}>
            <Icon name="warning" size={20} color="#f59e0b" />
            <Text style={styles.activityText}>Sistem uyarısı: Yüksek CPU kullanımı</Text>
            <Text style={styles.activityTime}>15 dk önce</Text>
          </View>
          <View style={styles.activityItem}>
            <Icon name="backup" size={20} color="#0891b2" />
            <Text style={styles.activityText}>Günlük yedekleme tamamlandı</Text>
            <Text style={styles.activityTime}>1 saat önce</Text>
          </View>
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
    backgroundColor: '#dc2626',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    width: (width - 44) / 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1f2937',
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  activitiesContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default AdminDashboardScreen;
