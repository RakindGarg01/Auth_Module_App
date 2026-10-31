import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import UserWalletScreen from '../screens/Wallet/UserWalletScreen';


export type RootStackParamList = {
  Home: {
    userName?: string;
    token?: string;
    userId?: string;
  } | undefined;
  Login: undefined;
  UserWallet: {
    token?: string;
    userId?: string;
  } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} options={{title: 'Login Screen'}} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UserWallet" component={UserWalletScreen} />
    </Stack.Navigator>
  );
}