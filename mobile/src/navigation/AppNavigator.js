import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

// WMS Screens
import WarehouseScreen from '../screens/wms/WarehouseScreen';
import InventoryScreen from '../screens/wms/InventoryScreen';
import PickListScreen from '../screens/wms/PickListScreen';
import CycleCountScreen from '../screens/wms/CycleCountScreen';

// TMS Screens
import TransportScreen from '../screens/tms/TransportScreen';
import ShipmentScreen from '../screens/tms/ShipmentScreen';
import VehicleScreen from '../screens/tms/VehicleScreen';
import DeliveryScreen from '../screens/tms/DeliveryScreen';

// HR Screens
import HRScreen from '../screens/hr/HRScreen';
import ShiftScreen from '../screens/hr/ShiftScreen';
import LeaveScreen from '../screens/hr/LeaveScreen';
import PayrollScreen from '../screens/hr/PayrollScreen';

// Reporting Screens
import ReportsScreen from '../screens/reports/ReportsScreen';
import AnalyticsScreen from '../screens/reports/AnalyticsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = 'dashboard';
        } else if (route.name === 'WMS') {
          iconName = 'warehouse';
        } else if (route.name === 'TMS') {
          iconName = 'local-shipping';
        } else if (route.name === 'HR') {
          iconName = 'people';
        } else if (route.name === 'Reports') {
          iconName = 'assessment';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1e3a8a',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="WMS" component={WarehouseScreen} />
    <Tab.Screen name="TMS" component={TransportScreen} />
    <Tab.Screen name="HR" component={HRScreen} />
    <Tab.Screen name="Reports" component={ReportsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const WMSStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="WarehouseMain" component={WarehouseScreen} />
    <Stack.Screen name="Inventory" component={InventoryScreen} />
    <Stack.Screen name="PickList" component={PickListScreen} />
    <Stack.Screen name="CycleCount" component={CycleCountScreen} />
  </Stack.Navigator>
);

const TMSStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TransportMain" component={TransportScreen} />
    <Stack.Screen name="Shipment" component={ShipmentScreen} />
    <Stack.Screen name="Vehicle" component={VehicleScreen} />
    <Stack.Screen name="Delivery" component={DeliveryScreen} />
  </Stack.Navigator>
);

const HRStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HRMain" component={HRScreen} />
    <Stack.Screen name="Shift" component={ShiftScreen} />
    <Stack.Screen name="Leave" component={LeaveScreen} />
    <Stack.Screen name="Payroll" component={PayrollScreen} />
  </Stack.Navigator>
);

const ReportsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ReportsMain" component={ReportsScreen} />
    <Stack.Screen name="Analytics" component={AnalyticsScreen} />
  </Stack.Navigator>
);

const AppNavigator = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <AuthStack />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="WMSStack" component={WMSStack} />
      <Stack.Screen name="TMSStack" component={TMSStack} />
      <Stack.Screen name="HRStack" component={HRStack} />
      <Stack.Screen name="ReportsStack" component={ReportsStack} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
