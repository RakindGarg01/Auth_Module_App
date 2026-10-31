import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import LoginScreen from './LoginScreen';
import {loginApi} from '../services/AuthApi';

jest.mock('../services/AuthApi');

const navigation = {replace: jest.fn()};
const setup = () =>
  render(<LoginScreen navigation={navigation as any} route={{} as any} />);

const fillAndSubmit = async (password = 'secret123') => {
  await fireEvent.changeText(screen.getByLabelText('Email'), 'a@b.com');
  await fireEvent.changeText(screen.getByLabelText('Password'), password);
  await fireEvent.press(screen.getByRole('button', {name: /log ?in/i}));
};

test('disables button until both fields are filled', async () => {
  await setup();
  const btn = screen.getByRole('button', {name: /log ?in/i});
  expect(btn).toBeDisabled();

  await fireEvent.changeText(screen.getByLabelText('Email'), 'a@b.com');
  await fireEvent.changeText(screen.getByLabelText('Password'), 'secret123');
  expect(btn).toBeEnabled();
});

test('navigates to Home on successful login', async () => {
  (loginApi as jest.Mock).mockResolvedValue({token: 't'});
  await setup();
  await fillAndSubmit();

  expect(loginApi).toHaveBeenCalledWith('a@b.com', 'secret123');
  await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('Home'));
});

test('shows the server error and does not navigate on failure', async () => {
  (loginApi as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));
  await setup();
  await fillAndSubmit('wrong');

  expect(await screen.findByText('Invalid credentials')).toBeTruthy();
  expect(navigation.replace).not.toHaveBeenCalled();
});