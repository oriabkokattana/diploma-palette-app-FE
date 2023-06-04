import React, { useEffect, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Button, Text } from '@react-native-material/core';
import {
  collection,
  db,
  onSnapshot,
  orderBy,
  query,
  where,
} from '../../firebase/config';
import ColorPalette from '../../components/ColorPallete/ColorPallete';
import { useCustomTheme } from '../../contexts/themeContext';
import styles from './styles';

export default function SavedPalettesScreen({ userId, userName }) {
  const [search, setSearch] = useState('');
  const [palettes, setPalettes] = useState([]);
  const { resetTheme, theme } = useCustomTheme();

  const palettesRef = collection(db, 'palletes');

  useEffect(() => {
    const q = query(
      palettesRef,
      where('authorID', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const newPalettes = [];
        querySnapshot.forEach((doc) => {
          const palette = doc.data();
          palette.id = doc.id;
          newPalettes.push(palette);
        });
        setPalettes(newPalettes);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder='Find Palette'
            placeholderTextColor='#aaaaaa'
            onChangeText={setSearch}
            value={search}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
          />
        </View>
        <Button
          style={styles.resetButton}
          title='Reset Theme'
          variant='outlined'
          uppercase={false}
          onPress={resetTheme}
        />
        <Text variant='h4'>Palettes</Text>
        {palettes.length > 0 && (
          <View style={styles.listContainer}>
            {palettes
              .filter((palette) =>
                palette.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <React.Fragment key={item.colors.toString()}>
                  <Text
                    variant='body2'
                    style={{ marginLeft: 6 }}
                    color={theme.typography.body2.color}
                  >
                    Palette {item.name}
                  </Text>
                  <ColorPalette
                    canEdit
                    canCreate={true}
                    colors={item.colors}
                    spacing={20}
                    id={item.id}
                    name={item.name}
                    userId={userId}
                    userName={userName}
                  />
                </React.Fragment>
              ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
