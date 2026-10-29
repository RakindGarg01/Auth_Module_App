import React ,  {useCallback, useEffect, useState} from 'react';
import {getWallet, addMoney, spendMoney} from '../api/WalletApi';
import { Alert , ActivityIndicator, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Plus, ReceiptText, Wallet } from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'UserWallet'>;

type Transaction = {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
};

const ACTIONS = [
  {title: 'Add money', icon: Plus, color: '#5F259F'},
  {title: 'Spend money', icon: ArrowUpRight, color: '#F3ECF9'},
  {title: 'Withdraw money', icon: ArrowDownLeft, color: '#F3ECF9'},
];

export default function UserWalletScreen({navigation , route }: Props) {
  
  const token = route.params?.token;
  const userId = route.params?.userId;

  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState('USD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [amountInput, setAmountInput] = useState('');
  const [selectedAction, setSelectedAction] = useState<'add' | 'spend' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadWallet = useCallback(async () => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    try {
      const walletResponse = await getWallet(token, userId);

      const wallet =
        walletResponse &&
        typeof walletResponse === 'object' &&
        'wallet' in walletResponse
          ? walletResponse.wallet
          : walletResponse;

      if (wallet && typeof wallet === 'object') {
        const data = wallet as Record<string, unknown>;
        const value = data.balance ?? data.availableBalance ?? data.available_balance;

        if (typeof value === 'number' && Number.isFinite(value)) {
          setBalance(value);
        } else if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
          setBalance(Number(value));
        }

        if (typeof data.currency === 'string') {
          setCurrency(data.currency.toUpperCase());
        }
      }

      const response = walletResponse as {
        transactions?: Transaction[];
        data?: Transaction[] | {transactions?: Transaction[]};
      };
      const walletData =
        wallet && typeof wallet === 'object'
          ? (wallet as {transactions?: Transaction[]})
          : undefined;
      const responseData = response?.data;

      if (Array.isArray(response)) {
        setTransactions(response);
      } else if (Array.isArray(response?.transactions)) {
        setTransactions(response.transactions);
      } else if (Array.isArray(walletData?.transactions)) {
        setTransactions(walletData.transactions);
      } else if (Array.isArray(responseData)) {
        setTransactions(responseData);
      } else if (responseData && Array.isArray(responseData.transactions)) {
        setTransactions(responseData.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      Alert.alert(
        'Wallet error',
        error instanceof Error ? error.message : 'Could not load wallet.',
        
      );
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const formatAmount = (amount: number) => {
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
    };

    const symbol = symbols[currency] ?? `${currency} `;

    return `${symbol}${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const openAmountDialog = (nextAction: 'add' | 'spend') => {
    if (!token || !userId) {
      Alert.alert('Error', 'Missing login information. Please log in again.');
      return;
    }

    setAmountInput('');
    setSelectedAction(nextAction);
  };

  const closeAmountDialog = () => {
    if (!submitting) {
      setSelectedAction(null);
      setAmountInput('');
    }
  };

  const handleSubmitAmount = async () => {
    const numericAmount = Number(amountInput.trim());
    const transactionAction = selectedAction;

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid amount greater than zero.');
      return;
    }

    if (!token || !userId || !transactionAction) {
      Alert.alert('Error', 'Missing login information. Please log in again.');
      return;
    }

    setSubmitting(true);
    try {
      if (transactionAction === 'add') {
        await addMoney(token, userId, numericAmount);
      } else {
        await spendMoney(token, userId, numericAmount);
      }
      setSelectedAction(null);
      setAmountInput('');
      await loadWallet();
      Alert.alert(
        'Success',
        transactionAction === 'add'
          ? 'Money added successfully.'
          : 'Payment completed successfully.',
      );
    } catch (error) {
      Alert.alert(
        'Transaction failed',
        error instanceof Error ? error.message : 'Could not complete the transaction.',
      );
    } finally {
      setSubmitting(false);
    }
  };

return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeft size={20} color="#292330" />
        </Pressable>

        <Text style={styles.pageTitle}>My Wallet</Text>
        <Text style={styles.pageSubtitle}>
          Your money, all in one place.
        </Text>

        <View style={styles.balanceCard}>
          <View style={styles.balanceCardHeader}>
            <View style={styles.balanceLabelRow}>
              <Wallet size={18} color="#E5D5F4" />
              <Text style={styles.balanceLabel}>Available balance</Text>
            </View>
            <Text style={styles.walletTag}>WALLET</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#FFFFFF" style={styles.loader} />
          ) : (
            <Text style={styles.balance}>
              {balance === null ? '--' : formatAmount(balance)}
            </Text>
          )}

          <Text style={styles.balanceHint}>Wallet balance</Text>
        </View>

        <View style={styles.actions}>
          {ACTIONS.map(item => {
            const Icon = item.icon;

            return (
              <Pressable
                key={item.title}
                onPress={
                  item.title === 'Add money'
                    ? () => openAmountDialog('add')
                    : item.title === 'Spend money'
                      ? () => openAmountDialog('spend')
                      : () =>
                          Alert.alert(
                            item.title,
                            'This feature is not available yet.',
                          )
                }
                style={styles.actionButton}>
                <View
                  style={[
                    styles.actionIcon,
                    {backgroundColor: item.color},
                  ]}>
                  <Icon
                    size={21}
                    color={item.title === 'Add money' ? '#FFFFFF' : '#5F259F'}
                  />
                </View>
                <Text style={styles.actionLabel}>{item.title}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Transaction history</Text>
          <Text style={styles.recentLabel}>Recent</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#5F259F" style={styles.historyLoader} />
        ) : transactions.length === 0 ? (
          <View style={styles.emptyHistory}>
            <ReceiptText size={28} color="#8E8994" />
            <Text style={styles.emptyHistoryTitle}>No transactions yet</Text>
            <Text style={styles.emptyHistoryDescription}>
              Your wallet activity will appear here.
            </Text>
          </View>
        ) : (
          transactions.map((transaction, index) => {
            const isCredit = transaction.type?.toUpperCase() === 'CREDIT';
            const rawAmount = Number(transaction.amount);
            const amount = Number.isFinite(rawAmount) ? rawAmount : 0;

            return (
              <View
                key={transaction.id ?? index}
                style={styles.transactionRow}>
                <View style={styles.transactionIcon}>
                  {isCredit ? (
                    <ArrowDownLeft size={20} color="#16804A" />
                  ) : (
                    <ArrowUpRight size={20} color="#5F259F" />
                  )}
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>
                    {transaction.description || transaction.type || 'Transaction'}
                  </Text>
                  <Text style={styles.transactionType}>
                    {transaction.type || 'Transaction'}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    {color: isCredit ? '#16804A' : '#292330'},
                  ]}>
                  {isCredit ? '+' : '-'}{formatAmount(amount)}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        transparent
        visible={selectedAction !== null}
        animationType="fade"
        onRequestClose={closeAmountDialog}>
        <View style={styles.modalBackdrop}>
          <View style={styles.amountDialog}>
            <Text style={styles.amountDialogTitle}>
              {selectedAction === 'add' ? 'Add money' : 'Spend money'}
            </Text>
            <Text style={styles.amountDialogDescription}>
              Enter the amount in {currency}.
            </Text>
            <TextInput
              accessibilityLabel="Amount"
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#8E8994"
              editable={!submitting}
              style={styles.amountInput}
            />
            <View style={styles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                onPress={closeAmountDialog}
                disabled={submitting}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleSubmitAmount}
                disabled={submitting}
                style={styles.confirmButton}>
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {selectedAction === 'add' ? 'Add money' : 'Pay'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F8F6FB'},
  container: {paddingHorizontal: 24, paddingTop: 12, paddingBottom: 32},
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pageTitle: {fontSize: 28, fontWeight: '700', color: '#211B28'},
  pageSubtitle: {fontSize: 14, color: '#746E7C', marginTop: 5},
  balanceCard: {
    backgroundColor: '#5F259F',
    borderRadius: 22,
    padding: 22,
    marginTop: 24,
  },
  balanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabelRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  balanceLabel: {fontSize: 14, color: '#E5D5F4'},
  walletTag: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#E5D5F4',
    borderWidth: 1,
    borderColor: '#9B70C2',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  balance: {fontSize: 34, fontWeight: '700', color: '#FFFFFF', marginTop: 25},
  loader: {marginTop: 25, alignSelf: 'flex-start'},
  balanceHint: {fontSize: 12, color: '#E5D5F4', marginTop: 3},
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 30,
  },
  actionButton: {alignItems: 'center', width: '31%'},
  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38313F',
    textAlign: 'center',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {fontSize: 18, fontWeight: '700', color: '#292330'},
  recentLabel: {fontSize: 12, color: '#8E8994'},
  historyLoader: {marginTop: 30},
  emptyHistory: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  emptyHistoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38313F',
    marginTop: 12,
  },
  emptyHistoryDescription: {fontSize: 12, color: '#8E8994', marginTop: 5},
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F3ECF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {flex: 1, marginLeft: 12},
  transactionTitle: {fontSize: 14, fontWeight: '600', color: '#292330'},
  transactionType: {fontSize: 12, color: '#8E8994', marginTop: 4},
  transactionAmount: {fontSize: 14, fontWeight: '700'},
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 12, 28, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  amountDialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
  },
  amountDialogTitle: {fontSize: 20, fontWeight: '700', color: '#292330'},
  amountDialogDescription: {fontSize: 14, color: '#746E7C', marginTop: 8},
  amountInput: {
    borderWidth: 1,
    borderColor: '#D8D2DF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 20,
    fontSize: 18,
    color: '#292330',
  },
  dialogActions: {flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 22},
  cancelButton: {paddingHorizontal: 16, paddingVertical: 12},
  cancelButtonText: {fontSize: 14, fontWeight: '600', color: '#5F259F'},
  confirmButton: {
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5F259F',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  confirmButtonText: {fontSize: 14, fontWeight: '600', color: '#FFFFFF'},
});