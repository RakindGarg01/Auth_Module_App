import { StyleSheet } from "react-native";

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

export default styles;