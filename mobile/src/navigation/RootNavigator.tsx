import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { MapScreen } from '../screens/MapScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
import { MyPageScreen } from '../screens/MyPageScreen';

const Tab = createBottomTabNavigator();

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: '지도',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🗺️</Text>,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: '캘린더',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarLabel: '친구',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: 'MY',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
