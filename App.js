import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { decode, encode } from 'base-64';
import { ActivityIndicator, Flex } from '@react-native-material/core';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { Provider as PaperProvider } from 'react-native-paper';
import { LoginScreen, HomeScreen, RegistrationScreen } from './src/screens';
import {
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
} from './src/firebase/config';
import { ThemeProvider } from './src/contexts/themeContext';

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef)
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            alert(error);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <Flex justify='center' items='center' fill>
        <ActivityIndicator size='large' />
      </Flex>
    );
  }

  return (
    <ClickOutsideProvider>
      <ThemeProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {user ? (
                <Stack.Screen name='Home'>
                  {(props) => <HomeScreen {...props} user={user} />}
                </Stack.Screen>
              ) : (
                <>
                  <Stack.Screen name='Login' component={LoginScreen} />
                  <Stack.Screen
                    name='Registration'
                    component={RegistrationScreen}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </ThemeProvider>
    </ClickOutsideProvider>
  );
}
