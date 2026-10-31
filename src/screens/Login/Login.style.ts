import {StyleSheet} from 'react-native';

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

export default styles;