import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

// Warehouse Screens
import WarehouseDashboardScreen from '../screens/warehouse/WarehouseDashboardScreen';
import InventoryScreen from '../screens/warehouse/InventoryScreen';
import PickListScreen from '../screens/warehouse/PickListScreen';
import CycleCountScreen from '../screens/warehouse/CycleCountScreen';
import ReceivingScreen from '../screens/warehouse/ReceivingScreen';

// Driver Screens
import DriverDashboardScreen from '../screens/driver/DriverDashboardScreen';
import DriverAssignmentsScreen from '../screens/driver/DriverAssignmentsScreen';
import DriverTrackingScreen from '../screens/driver/DriverTrackingScreen';
import DriverDeliveryScreen from '../screens/driver/DriverDeliveryScreen';

// HR Screens
import HRDashboardScreen from '../screens/hr/HRDashboardScreen';
import HRShiftsScreen from '../screens/hr/HRShiftsScreen';
import HRLeavesScreen from '../screens/hr/HRLeavesScreen';
import HRPayrollScreen from '../screens/hr/HRPayrollScreen';

// Accounting Screens
import AccountingDashboardScreen from '../screens/accounting/AccountingDashboardScreen';
import AccountingInvoicesScreen from '../screens/accounting/AccountingInvoicesScreen';
import AccountingPaymentsScreen from '../screens/accounting/AccountingPaymentsScreen';

// Common Screens
import ProfileScreen from '../screens/common/ProfileScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Admin Navigation
const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'AdminDashboard': iconName = 'dashboard'; break;
          case 'AdminUsers': iconName = 'people'; break;
          case 'AdminSettings': iconName = 'settings'; break;
          default: iconName = 'help';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#dc2626',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Tab.Screen name="AdminUsers" component={AdminUsersScreen} />
    <Tab.Screen name="AdminSettings" component={AdminSettingsScreen} />
  </Tab.Navigator>
);

// Warehouse Navigation
const WarehouseTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'WarehouseDashboard': iconName = 'warehouse'; break;
          case 'Inventory': iconName = 'inventory'; break;
          case 'PickList': iconName = 'list'; break;
          case 'CycleCount': iconName = 'calculate'; break;
          case 'Receiving': iconName = 'receipt'; break;
          default: iconName = 'help';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#059669',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="WarehouseDashboard" component={WarehouseDashboardScreen} />
    <Tab.Screen name="Inventory" component={InventoryScreen} />
    <Tab.Screen name="PickList" component={PickListScreen} />
    <Tab.Screen name="CycleCount" component={CycleCountScreen} />
    <Tab.Screen name="Receiving" component={ReceivingScreen} />
  </Tab.Navigator>
);

// Driver Navigation
const DriverTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'DriverDashboard': iconName = 'dashboard'; break;
          case 'DriverAssignments': iconName = 'assignment'; break;
          case 'DriverTracking': iconName = 'gps-fixed'; break;
          case 'DriverDelivery': iconName = 'local-shipping'; break;
          default: iconName = 'help';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1e3a8a',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="DriverDashboard" component={DriverDashboardScreen} />
    <Tab.Screen name="DriverAssignments" component={DriverAssignmentsScreen} />
    <Tab.Screen name="DriverTracking" component={DriverTrackingScreen} />
    <Tab.Screen name="DriverDelivery" component={DriverDeliveryScreen} />
  </Tab.Navigator>
);

// HR Navigation
const HRTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'HRDashboard': iconName = 'dashboard'; break;
          case 'HRShifts': iconName = 'schedule'; break;
          case 'HRLeaves': iconName = 'event-available'; break;
          case 'HRPayroll': iconName = 'account-balance-wallet'; break;
          default: iconName = 'help';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#7c3aed',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="HRDashboard" component={HRDashboardScreen} />
    <Tab.Screen name="HRShifts" component={HRShiftsScreen} />
    <Tab.Screen name="HRLeaves" component={HRLeavesScreen} />
    <Tab.Screen name="HRPayroll" component={HRPayrollScreen} />
  </Tab.Navigator>
);

// Accounting Navigation
const AccountingTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'AccountingDashboard': iconName = 'dashboard'; break;
          case 'AccountingInvoices': iconName = 'receipt'; break;
          case 'AccountingPayments': iconName = 'payment'; break;
          default: iconName = 'help';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#dc2626',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="AccountingDashboard" component={AccountingDashboardScreen} />
    <Tab.Screen name="AccountingInvoices" component={AccountingInvoicesScreen} />
    <Tab.Screen name="AccountingPayments" component={AccountingPaymentsScreen} />
  </Tab.Navigator>
);

// Role-based Navigator
const RoleBasedNavigator = ({ isAuthenticated, userRole }) => {
  if (!isAuthenticated) {
    return <AuthStack />;
  }

  // Admin Navigation
  if (userRole === 'admin') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    );
  }

  // Warehouse Navigation
  if (userRole === 'warehouse' || userRole === 'depo') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WarehouseTabs" component={WarehouseTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    );
  }

  // Driver Navigation
  if (userRole === 'driver' || userRole === 'şoför') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DriverTabs" component={DriverTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    );
  }

  // HR Navigation
  if (userRole === 'hr' || userRole === 'ik') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HRTabs" component={HRTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    );
  }

  // Accounting Navigation
  if (userRole === 'accounting' || userRole === 'muhasebe') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AccountingTabs" component={AccountingTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    );
  }

  // Default Navigation (Fallback)
  return <AuthStack />;
};

export default RoleBasedNavigator;
