import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { usePushNotifications } from './src/hooks/usePushNotifications';
import { useLocationTracking } from './src/hooks/useLocationTracking';
import LoadingSpinner from './src/components/LoadingSpinner';
import OfflineIndicator from './src/components/OfflineIndicator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isConnected } = useNetworkStatus();
  
  usePushNotifications();
  useLocationTracking();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
        backgroundColor="#1e3a8a" 
      />
      <NavigationContainer>
        <AppNavigator isAuthenticated={isAuthenticated} />
      </NavigationContainer>
      {!isConnected && <OfflineIndicator />}
      <Toast />
    </>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
