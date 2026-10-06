import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { LoginScreen } from './src/screens/LoginScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        {currentUser ? (
          <RootNavigator />
        ) : (
          <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
