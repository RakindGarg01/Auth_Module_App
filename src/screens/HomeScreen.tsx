import React from 'react';
import {View, Text, Pressable, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>

        <Pressable
          style={({pressed}) => [styles.button, pressed && styles.pressed]}
          onPress={() => navigation.replace('Login')}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#FFFFFF'},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {fontSize: 24, fontWeight: '700', color: '#111111', marginBottom: 32},
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  pressed: {opacity: 0.8},
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
});