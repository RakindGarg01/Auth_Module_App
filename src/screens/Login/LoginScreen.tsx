import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  Text,
  TextInput,
  Pressable,
  Image,
  StatusBar,
} from 'react-native';
import {Eye, EyeOff} from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/RootNavigator';
import {loginApi} from '../../api/AuthApi';
import styles from './Login.style';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value: string): string =>
     EMAIL_REGEX.test(value.trim()) ? '' : 'Enter a valid email address';


export default function LoginScreen({navigation}: Props) {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [showPassword, setShowPassword] = useState(false);
     const [emailTouched, setEmailTouched] = useState(false);
     const [loading, setLoading] = useState(false);
     const [formError, setFormError] = useState('');

     const isEmpty = !email.trim() || !password;

     const emailError = emailTouched ? validateEmail(email) : '';

     const handleLogin = async () => {
          setEmailTouched(true);
          if (validateEmail(email)) {
               return;
          }
          if (loading) {
               return;
          }
        
          setFormError('');
          setLoading(true);
          try {
               await loginApi(email.trim().toLowerCase(), password);
               navigation.replace('Home');
          } catch (e) {
               setFormError(e instanceof Error ? e.message : 'Something went wrong');
          } finally {
               setLoading(false);
          }
          };

  return (
    <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" />
          <ScrollView
               contentContainerStyle={styles.container}
               keyboardShouldPersistTaps="handled"
               keyboardDismissMode="on-drag">

                    
          {/* <View style={styles.container}> */}
               <Image
                    // source={{uri: 'https://res.cloudinary.com/g395ki0e/image/upload/f_auto,q_auto/Screenshot_2026-10-16_144517'}}
                    // source={{uri: 'https://res.cloudinary.com/g395ki0e/image/upload/v1792386764/Logo.png'}}
                    source={{uri: 'https://res.cloudinary.com/g395ki0e/image/upload/v1792389248/Screenshot_2026-10-19_112336.png'}}
                    style={styles.logo}
               />
               <Text style={styles.label}>Email</Text>

               <TextInput
                    style={[styles.input, !!emailError && styles.inputError]}
                    accessibilityLabel="Email"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => setEmailTouched(true)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
               />
               {!!emailError && <Text style={styles.error}>{emailError}</Text>}

               <Text style={styles.label}>Password</Text>
               <View style={[styles.passwordRow]}>
                    <TextInput
                         style={styles.passwordInput}
                         accessibilityLabel="Password"
                         value={password}
                         onChangeText={setPassword}
                         secureTextEntry={!showPassword}
                         autoCapitalize="none"
                         autoCorrect={false}
                    />
                    <Pressable
                         onPress={() => setShowPassword(prev => !prev)}
                         hitSlop={10}>
                         {showPassword ? 
                              ( <Eye size={22} color="#666666" /> )
                              :
                              ( <EyeOff size={22} color="#666666" /> )
                         }
                    </Pressable>
               </View>   

               {!!formError && <Text style={styles.error}>{formError}</Text>}

               <Pressable
                         accessibilityRole="button"
                         style={({pressed}) => [
                              styles.button, 
                              (pressed || loading) && styles.pressed,
                              isEmpty && styles.disabled,
                         ]}
                         onPress={handleLogin}
                         
                         disabled={loading || isEmpty}
                    >
                         
                    <Text style={styles.buttonText}>
                         {loading ? 'Logging in...' : 'Continue to Login'}
                    </Text>
               </Pressable>
          {/* </View> */}
          </ScrollView>

     </SafeAreaView>
  );
}