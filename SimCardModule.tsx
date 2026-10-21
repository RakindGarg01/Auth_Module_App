//Default App
// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;
//Sim Card Info Module
import React, { useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NativeSimInfo, { type SimInfo } from './specs/NativeSimInfo';

const COLORS = ['#4F46E5', '#0F766E']; // card color per SIM position

function SimCard({ index, sim }: { index: number; sim?: SimInfo }) {
  // Empty slot: show a muted placeholder card
  if (!sim) {
    return (
      <View style={[styles.card, styles.emptyCard]}>
        <Text style={styles.slotLabel}>SIM {index + 1}</Text>
        <Text style={styles.emptyText}>No SIM detected</Text>
      </View>
    );
  }

  const operator = sim.carrier || sim.displayName || 'Unknown';

  return (
    <View style={[styles.card, { backgroundColor: COLORS[index % COLORS.length] }]}>
      <View style={styles.row}>
        <Text style={styles.slotLabel}>SIM {index + 1}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{operator.charAt(0).toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.operator}>{operator}</Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View>
          <Text style={styles.fieldLabel}>NUMBER</Text>
          <Text style={styles.fieldValue}>{sim.number || 'Not available'}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.fieldLabel}>COUNTRY</Text>
          <Text style={styles.fieldValue}>{sim.countryIso.toUpperCase() || '-'}</Text>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [sims, setSims] = useState<SimInfo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  const onPress = async () => {
    setError('');
    if (Platform.OS !== 'android') {
      setError('SIM info is Android-only');
      return;
    }
    try {
      const res = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
      ]);
      if (res['android.permission.READ_PHONE_STATE'] !== 'granted') {
        setError('Permission denied');
        return;
      }
      setSims(await NativeSimInfo.getSimInfo());
      setLoaded(true);
    } catch (e: any) {
      setError(e.message ?? String(e));
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1020" />
      <Text style={styles.title}>My SIM Cards</Text>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}>
        <Text style={styles.buttonText}>Get SIM info</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loaded && (
        <View style={styles.cards}>
          <SimCard index={0} sim={sims[0]} />
          <SimCard index={1} sim={sims[1]} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B1020' },
  content: { padding: 20, paddingTop: 64 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 20 },
  button: {
    backgroundColor: '#22D3EE',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#0B1020', fontSize: 16, fontWeight: '700' },
  error: { color: '#F87171', marginTop: 16 },
  cards: { marginTop: 24, gap: 16 },
  card: {
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },
  emptyCard: {
    backgroundColor: '#1A2138',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#3B4366',
  },
  emptyText: { color: '#6B7599', fontSize: 16, marginTop: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  right: { alignItems: 'flex-end' },
  slotLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '600', letterSpacing: 1 },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  operator: { color: '#fff', fontSize: 26, fontWeight: '700', marginTop: 14 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 16 },
  fieldLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: 1 },
  fieldValue: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 4 },
});