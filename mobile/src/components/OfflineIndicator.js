import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useOffline } from '../context/OfflineContext';

const OfflineIndicator = () => {
  const {
    isOnline,
    syncInProgress,
    pendingOperations,
    offlineData,
    forceSync,
    clearOfflineData
  } = useOffline();

  const [slideAnim] = useState(new Animated.Value(-100));
  const [showOfflineData, setShowOfflineData] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      // Slide in when offline
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out when online
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOnline]);

  const handleSyncPress = async () => {
    if (!isOnline) {
      Alert.alert(
        'Offline',
        'Bağlantı kurulduğunda otomatik olarak senkronize edilecektir.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    try {
      await forceSync();
      Alert.alert('Başarılı', 'Veriler senkronize edildi.');
    } catch (error) {
      Alert.alert('Hata', 'Senkronizasyon başarısız: ' + error.message);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Offline Verileri Temizle',
      'Tüm offline veriler silinecek. Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearOfflineData();
              Alert.alert('Başarılı', 'Offline veriler temizlendi.');
            } catch (error) {
              Alert.alert('Hata', 'Veriler temizlenirken hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const renderOfflineDataItem = ({ item }) => (
    <View style={styles.offlineItem}>
      <Icon name="cloud-off" size={20} color="#666" />
      <View style={styles.offlineItemContent}>
        <Text style={styles.offlineItemTitle}>{item.operation_type}</Text>
        <Text style={styles.offlineItemSubtitle}>
          {new Date(item.timestamp).toLocaleString('tr-TR')}
        </Text>
      </View>
    </View>
  );

  const getOfflineDataCount = () => {
    return Object.values(offlineData).reduce((total, items) => total + items.length, 0);
  };

  if (isOnline && pendingOperations === 0) {
    return null;
  }

  return (
    <>
      <Animated.View 
        style={[
          styles.container,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.content}>
          <View style={styles.statusContainer}>
            <Icon 
              name={isOnline ? "cloud-done" : "cloud-off"} 
              size={20} 
              color={isOnline ? "#4CAF50" : "#FF9800"} 
            />
            <Text style={styles.statusText}>
              {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
            </Text>
            {pendingOperations > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingOperations}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.syncButton} 
            onPress={handleSyncPress}
            disabled={syncInProgress}
          >
            {syncInProgress ? (
              <ActivityIndicator size="small" color="#2196F3" />
            ) : (
              <Icon name="sync" size={20} color="#2196F3" />
            )}
          </TouchableOpacity>

          {!isOnline && (
            <TouchableOpacity 
              style={styles.dataButton}
              onPress={() => setShowOfflineData(true)}
            >
              <Icon name="storage" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Offline Data Modal */}
      <Modal
        visible={showOfflineData}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Offline Veriler</Text>
            <TouchableOpacity 
              onPress={() => setShowOfflineData(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Toplam {getOfflineDataCount()} offline işlem bekliyor
            </Text>

            <FlatList
              data={[
                ...offlineData.receipts.map(item => ({ ...item, type: 'Mal Kabul' })),
                ...offlineData.shipments.map(item => ({ ...item, type: 'Sevkiyat' })),
                ...offlineData.deliveries.map(item => ({ ...item, type: 'Teslimat' })),
                ...offlineData.inventory.map(item => ({ ...item, type: 'Envanter' }))
              ]}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={renderOfflineDataItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="cloud-done" size={48} color="#4CAF50" />
                  <Text style={styles.emptyText}>Offline veri bulunmuyor</Text>
                </View>
              }
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={handleClearData}
              >
                <Icon name="delete" size={20} color="#F44336" />
                <Text style={styles.clearButtonText}>Temizle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 40, // Account for status bar
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  badge: {
    backgroundColor: '#FF5722',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  syncButton: {
    padding: 8,
    marginLeft: 8,
  },
  dataButton: {
    padding: 8,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  offlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  offlineItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  offlineItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  offlineItemSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  modalActions: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  clearButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#F44336',
  },
});

export default OfflineIndicator;
