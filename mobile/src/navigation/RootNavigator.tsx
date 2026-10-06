import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { MapScreen } from '../screens/MapScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
import { MyPageScreen } from '../screens/MyPageScreen';
import { theme } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: styles.floatingTabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: '지도',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, color: focused ? theme.colors.primary : theme.colors.textMuted }}>
              🗺️
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: '캘린더',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, color: focused ? theme.colors.primary : theme.colors.textMuted }}>
              📅
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarLabel: '친구',
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'relative' }}>
              <Text style={{ fontSize: 22, color: focused ? theme.colors.primary : theme.colors.textMuted }}>
                👥
              </Text>
              <View style={styles.badgeCircle}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, color: focused ? theme.colors.primary : theme.colors.textMuted }}>
              👤
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderTopWidth: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 8,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  badgeCircle: {
    position: 'absolute',
    top: -3,
    right: -8,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
