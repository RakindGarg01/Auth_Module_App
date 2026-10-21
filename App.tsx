import RNBootSplash from 'react-native-bootsplash';
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer onReady={() => RNBootSplash.hide({fade: true})}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}