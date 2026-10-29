import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Eye, EyeOff} from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';
import {loginApi} from '../api/AuthApi';

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
               const response = await loginApi(
                    email.trim().toLowerCase(),
                    password,
               );
               
               navigation.replace('Home', {
                    userName: response.user.name,
                    token: response.token,
                    userId: response.user.id,
               });

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

                    
               <Image
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
          </ScrollView>

     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
     safeArea: {flex: 1, backgroundColor: '#FFFFFF'},
     container: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24},
     logo: {
       width: 96,
       height: 96,
       borderRadius: 48,
       alignSelf: 'center',
       marginBottom: 32,
       backgroundColor: '#EEEEEE',
     },
     input: {
       borderWidth: 1,
       borderColor: '#CCCCCC',
       borderRadius: 8,
       paddingHorizontal: 12,
       paddingVertical: 12,
       fontSize: 16,
       color: '#111111',
       marginTop: 16,
     },
     passwordRow: {
       flexDirection: 'row',
       alignItems: 'center',
       borderWidth: 1,
       borderColor: '#CCCCCC',
       borderRadius: 8,
       paddingHorizontal: 12,
       marginTop: 16,
     },
     passwordInput: {
       flex: 1,
       paddingVertical: 12,
       fontSize: 16,
       color: '#111111',
     },
     label: {fontSize: 14, color: '#444444', marginTop: 10, marginBottom: 0},
     inputError: {borderColor: '#D32F2F'},
     error: {color: '#D32F2F', fontSize: 12, marginTop: 4},
     formError: {
       color: '#D32F2F',
       fontSize: 14,
       textAlign: 'center',
       marginTop: 24,
     },
     button: {
       backgroundColor: '#5F259F',
       paddingVertical: 14,
       borderRadius: 8,
       alignItems: 'center',
       marginTop: 32,
     },
     pressed: {opacity: 0.8},
     disabled: {backgroundColor: '#B9A3D3'},
     buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
   });
