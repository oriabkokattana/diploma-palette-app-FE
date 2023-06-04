import React, { useEffect, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Text } from '@react-native-material/core';
import {
  collection,
  db,
  onSnapshot,
  orderBy,
  query,
} from '../../firebase/config';
import ColorPalette from '../../components/ColorPallete/ColorPallete';
import styles from './styles';

export default function TrendsScreen({ userId }) {
  const [search, setSearch] = useState('');
  const [palettes, setPalettes] = useState([]);

  const trendsRef = collection(db, 'trends');

  useEffect(() => {
    const q = query(
      trendsRef,
      orderBy('likes', 'desc'),
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
        <Text variant='h4'>Palettes</Text>
        {palettes.length > 0 && (
          <View style={styles.listContainer}>
            {palettes
              .filter(
                (palette) =>
                  palette.name.toLowerCase().includes(search.toLowerCase()) ||
                  palette.authorName
                    .toLowerCase()
                    .includes(search.toLowerCase())
              )
              .map((item) => (
                <React.Fragment key={`${item.authorID}-${item.name}`}>
                  <Text
                    variant='body2'
                    color={userId === item.authorID ? 'green' : undefined}
                    style={{ marginLeft: 6 }}
                  >
                    {item.authorName}: Palette {item.name}
                  </Text>
                  <ColorPalette
                    canLike={true}
                    canEdit={false}
                    canCreate={userId !== item.authorID}
                    colors={item.colors}
                    spacing={20}
                    id={item.id}
                    userId={userId}
                    name={item.name}
                    likes={item.likes}
                    likedBy={item.likedBy}
                    author={item.authorID}
                  />
                </React.Fragment>
              ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
