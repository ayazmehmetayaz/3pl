import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setUserRole(parsedUser.roles?.[0]?.name || 'user');
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        const { user: userData, accessToken } = response.data;
        
        await AsyncStorage.setItem('authToken', accessToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
        setUserRole(userData.roles?.[0]?.name || 'user');
        setIsAuthenticated(true);
        
        return userData;
      } else {
        throw new Error(response.message || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.roles) return false;
    
    return user.roles.some(role => 
      role.permissions.includes(permission) || 
      role.permissions.includes('*')
    );
  };

  const hasRole = (roleName) => {
    return userRole === roleName;
  };

  const isAdmin = () => hasRole('admin');
  const isWarehouse = () => hasRole('warehouse') || hasRole('depo');
  const isDriver = () => hasRole('driver') || hasRole('şoför');
  const isHR = () => hasRole('hr') || hasRole('ik');
  const isAccounting = () => hasRole('accounting') || hasRole('muhasebe');

  const value = {
    user,
    isAuthenticated,
    isLoading,
    userRole,
    login,
    logout,
    hasPermission,
    hasRole,
    isAdmin,
    isWarehouse,
    isDriver,
    isHR,
    isAccounting,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};