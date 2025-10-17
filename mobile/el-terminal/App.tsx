import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import ScanScreen from './src/screens/ScanScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Store
import { useAuthStore } from './src/store/authStore';
import { useOfflineStore } from './src/store/offlineStore';

// Utils
import { initializeDatabase } from './src/utils/database';
import { checkNetworkStatus } from './src/utils/network';
import LoadingSpinner from './src/components/LoadingSpinner';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

export default function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const { user, login, logout, isAuthenticated } = useAuthStore();
  const { isOnline, syncData } = useOfflineStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await initializeDatabase();
      
      // Check network status
      await checkNetworkStatus();
      
      // Auto login if user exists
      const savedUser = await useAuthStore.getState().getSavedUser();
      if (savedUser) {
        await login(savedUser.email, savedUser.password);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('App initialization error:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          style={styles.loadingGradient}
        >
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={styles.logoContainer}
          >
            <Icon name="inventory" size={80} color="#ffffff" />
          </Animatable.View>
          <Text style={styles.loadingText}>Ayaz 3PL</Text>
          <Text style={styles.loadingSubtext}>El Terminali</Text>
          <LoadingSpinner size="large" color="#ffffff" />
        </LinearGradient>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      
      {/* Network Status Indicator */}
      {!isOnline && (
        <View style={styles.offlineIndicator}>
          <Icon name="wifi-off" size={16} color="#ffffff" />
          <Text style={styles.offlineText}>Offline Mode</Text>
        </View>
      )}

      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              switch (route.name) {
                case 'Dashboard':
                  iconName = 'dashboard';
                  break;
                case 'Scan':
                  iconName = 'qr-code-scanner';
                  break;
                case 'Inventory':
                  iconName = 'inventory';
                  break;
                case 'Orders':
                  iconName = 'assignment';
                  break;
                case 'Settings':
                  iconName = 'settings';
                  break;
                default:
                  iconName = 'help';
              }

              return (
                <View style={[
                  styles.tabIconContainer,
                  focused && styles.tabIconContainerActive
                ]}>
                  <Icon 
                    name={iconName} 
                    size={focused ? size + 2 : size} 
                    color={color}
                  />
                </View>
              );
            },
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#9ca3af',
            tabBarStyle: {
              backgroundColor: '#1e40af',
              borderTopWidth: 0,
              height: 70,
              paddingBottom: 10,
              paddingTop: 10,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
            headerStyle: {
              backgroundColor: '#1e40af',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
          })}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{
              title: 'Ana Sayfa',
              headerTitle: 'Ayaz 3PL - El Terminali',
            }}
          />
          <Tab.Screen 
            name="Scan" 
            component={ScanScreen}
            options={{
              title: 'QR Tarama',
              headerTitle: 'Barkod/QR Tarama',
            }}
          />
          <Tab.Screen 
            name="Inventory" 
            component={InventoryScreen}
            options={{
              title: 'Stok',
              headerTitle: 'Stok Yönetimi',
            }}
          />
          <Tab.Screen 
            name="Orders" 
            component={OrdersScreen}
            options={{
              title: 'Siparişler',
              headerTitle: 'Sipariş Yönetimi',
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              title: 'Ayarlar',
              headerTitle: 'Sistem Ayarları',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

// Login Screen Component
function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState('warehouse@ayaz3pl.com');
  const [password, setPassword] = useState('123456');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'E-posta ve şifre gerekli');
      return;
    }

    setIsLoggingIn(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Giriş Hatası', 'Kullanıcı adı veya şifre hatalı');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1e40af', '#3b82f6', '#60a5fa']}
      style={styles.loginContainer}
    >
      <SafeAreaView style={styles.loginSafeArea}>
        <Animatable.View
          animation="fadeInUp"
          style={styles.loginCard}
        >
          <View style={styles.loginHeader}>
            <Icon name="inventory" size={60} color="#1e40af" />
            <Text style={styles.loginTitle}>Ayaz 3PL</Text>
            <Text style={styles.loginSubtitle}>El Terminali</Text>
          </View>

          <View style={styles.loginForm}>
            <Text style={styles.loginLabel}>E-posta</Text>
            <Text style={styles.loginInput}>
              {email}
            </Text>

            <Text style={styles.loginLabel}>Şifre</Text>
            <Text style={styles.loginInput}>
              {password}
            </Text>

            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
            >
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoggingIn}
              >
                <LinearGradient
                  colors={['#1e40af', '#3b82f6']}
                  style={styles.loginButtonGradient}
                >
                  <Icon name="login" size={20} color="#ffffff" />
                  <Text style={styles.loginButtonText}>
                    {isLoggingIn ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          </View>

          <View style={styles.loginFooter}>
            <Text style={styles.loginFooterText}>
              Demo Hesap: warehouse@ayaz3pl.com
            </Text>
          </View>
        </Animatable.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  loadingSubtext: {
    fontSize: 18,
    color: '#e5e7eb',
    marginBottom: 30,
  },
  offlineIndicator: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabIconContainer: {
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  loginContainer: {
    flex: 1,
  },
  loginSafeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 10,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 5,
  },
  loginForm: {
    marginBottom: 20,
  },
  loginLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 15,
  },
  loginInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  loginButton: {
    marginTop: 25,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginFooter: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginFooterText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
