import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {UserRound} from 'lucide-react-native';
import {
  ArrowUpRight,
  CreditCard,
  Gift,
  Headphones,
  ReceiptText,
  Wallet,
} from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type ServiceCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

function ServiceCard({title, description, icon, onPress}: ServiceCardProps) {
  const content = (
    <>
      <View style={[styles.iconContainer, !onPress && styles.disabledIcon]}>
        {icon}
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
      <View style={styles.cardArrow}>
        <ArrowUpRight size={18} color={onPress ? '#5F259F' : '#A6A1AC'} />
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({pressed}) => [
          styles.serviceCard,
          styles.activeCard,
          pressed && styles.pressed,
        ]}>
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: true}}
      disabled
      style={[styles.serviceCard, styles.disabledCard]}>
      {content}
      <Text style={styles.comingSoon}>Coming soon</Text>
    </Pressable>
  );
}

export default function HomeScreen({navigation, route}: Props) {
  const userName = route.params?.userName;
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.title}>Your services</Text>
          </View>
          <View style={styles.avatar}>
            {userName ? (
              <Text style={styles.avatarText}>
                {userName
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map(part => part[0]?.toUpperCase())
                  .join('')}
              </Text>
            ) : (
              <UserRound size={22} color="#5F259F" />
            )}
          </View>
        </View>

        <Text style={styles.subtitle}>
          Choose a service to get started.
        </Text>

        <View style={styles.services}>
          <ServiceCard
            title="User Wallet"
            description="View your wallet"
            icon={<Wallet size={24} color="#5F259F" />}
            onPress={() =>
              navigation.navigate('UserWallet', {
                token: route.params?.token,
                userId: route.params?.userId,
              })
            }
          />
          <ServiceCard
            title="Payments"
            description="Manage payments"
            icon={<CreditCard size={24} color="#A6A1AC" />}
          />
          <ServiceCard
            title="Transactions"
            description="Review activity"
            icon={<ReceiptText size={24} color="#A6A1AC" />}
          />
          <ServiceCard
            title="Rewards"
            description="Explore your rewards"
            icon={<Gift size={24} color="#A6A1AC" />}
          />
          <ServiceCard
            title="Support"
            description="Get help when needed"
            icon={<Headphones size={24} color="#A6A1AC" />}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          style={({pressed}) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F8F6FB'},
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {fontSize: 14, color: '#746E7C', marginBottom: 6},
  title: {fontSize: 28, fontWeight: '700', color: '#211B28'},
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEE6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {fontSize: 17, fontWeight: '700', color: '#5F259F'},
  subtitle: {fontSize: 15, color: '#746E7C', marginTop: 12, marginBottom: 24},
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  serviceCard: {
    width: '48%',
    minHeight: 174,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  activeCard: {backgroundColor: '#FFFFFF', borderColor: '#E8DDF2'},
  disabledCard: {backgroundColor: '#F1EFF3', borderColor: '#EBE9ED'},
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F3ECF9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  disabledIcon: {backgroundColor: '#E8E6EA'},
  serviceTitle: {fontSize: 16, fontWeight: '700', color: '#292330'},
  serviceDescription: {
    fontSize: 12,
    color: '#746E7C',
    marginTop: 5,
    paddingRight: 4,
  },
  cardArrow: {position: 'absolute', top: 16, right: 14},
  comingSoon: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8994',
    marginTop: 8,
  },
  logoutButton: {
    alignSelf: 'center',
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E1E9',
  },
  logoutText: {fontSize: 14, fontWeight: '600', color: '#5F259F'},
  pressed: {opacity: 0.75},
});
