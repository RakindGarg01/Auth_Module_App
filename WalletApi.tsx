
import {apiRequest} from './Client';

export const createWallet = (token: string) =>
  apiRequest('/wallets', token, 'POST', {currency: 'USD'});

export const getWallet = (token: string, userId: string) =>
  apiRequest(`/wallets/${userId}`, token);

export const getTransactions = (token: string, userId: string) =>
  apiRequest(`/wallets/${userId}`, token);

export const addMoney = (
  token: string,
  userId: string,
  amount: number,
) =>
  apiRequest(`/wallets/${userId}/transactions`, token, 'POST', {
    amount,
    type: 'CREDIT',
    description: 'Test deposit',
  });

  export const spendMoney = (
  token: string,
  userId: string,
  amount: number,
) =>
  apiRequest(`/wallets/${userId}/transactions`, token, 'POST', {
    amount,
    type: 'DEBIT',
    description: 'Test purchase',
  });