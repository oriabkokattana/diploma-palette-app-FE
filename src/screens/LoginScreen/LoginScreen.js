import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import {
  auth,
  db,
  doc,
  getDoc,
  signInWithEmailAndPassword,
} from '../../firebase/config';

const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFooterLinkPress = () => {
    navigation.navigate('Registration');
  };

  const onLoginPress = async () => {
    try {
      const resp = await signInWithEmailAndPassword(auth, email, password);
      const uid = resp.user.uid;
      const userRef = doc(db, 'users', uid);

      const firestoreDocument = await getDoc(userRef);
      if (firestoreDocument.exists()) {
        const user = firestoreDocument.data();
        navigation.navigate('Home', { user });
      } else {
        alert('User does not exist anymore.');
        return;
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        alert('You entered wrong password...');
      } else {
        alert('User not found...');
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='always'
      >
        <Image
          style={styles.logo}
          source={require('../../../assets/icon.png')}
        />
        <TextInput
          style={styles.input}
          placeholder='E-mail'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholderTextColor='#aaaaaa'
          secureTextEntry
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: !regex.test(email) ? 'lightgrey' : '#788eec' },
          ]}
          onPress={() => onLoginPress()}
          disabled={!regex.test(email)}
        >
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
