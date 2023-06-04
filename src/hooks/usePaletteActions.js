import { useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { unparse } from 'papaparse';
import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from '../firebase/config';
import { useCustomTheme } from '../contexts/themeContext';

export default function usePaletteActions({
  palleteName,
  userId,
  id,
  colors,
  name,
  author,
  userName,
  likedBy,
  likes,
}) {
  const notificationTimer = useRef();
  const [notification, setNotification] = useState('');
  const [isConfirmation, setConfirmation] = useState(false);

  const { updateTheme } = useCustomTheme();

  const palletesRef = collection(db, 'palletes');
  const trendsRef = collection(db, 'trends');

  const onSavePallete = async () => {
    try {
      const timestamp = serverTimestamp();
      const data = {
        name: palleteName,
        authorID: userId,
        createdAt: timestamp,
        colors,
      };
      if (!id) {
        await addDoc(palletesRef, data);
      } else {
        await setDoc(doc(palletesRef, id), data);
      }
    } catch (error) {
      console.log(error);
    }

    Keyboard.dismiss();
    setConfirmation(false);
  };

  const onDeletePallete = async () => {
    await deleteDoc(doc(db, 'palletes', id));
  };

  const onConvertAndShareCSVPalette = async () => {
    try {
      const csvData = unparse([colors]);
      const filePath = `${FileSystem.cacheDirectory}palette-${name}.csv`;
      await FileSystem.writeAsStringAsync(filePath, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share the CSV file
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: `Share Palette ${name}`,
      });
    } catch (error) {
      alert(error);
    }
  };

  const onCopy = async (color) => {
    setNotification(undefined);
    clearTimeout(notificationTimer.current);
    // const copiedText = await Clipboard.getStringAsync();
    // if (copiedText === color) {
    //   return;
    // }
    if (color) {
      await Clipboard.setStringAsync(color);
      setNotification(color);
    } else {
      await Clipboard.setStringAsync(colors.join(', '));
      setNotification(colors.join(', '));
    }

    // Hide the notification after a certain duration
    const timer = setTimeout(() => {
      setNotification(undefined);
    }, 2000);

    notificationTimer.current = timer;
  };

  const onPublish = async () => {
    try {
      const timestamp = serverTimestamp();
      const data = {
        name: palleteName,
        authorID: userId,
        authorName: userName,
        createdAt: timestamp,
        likes,
        colors,
        likedBy,
      };
      await setDoc(
        doc(trendsRef, `${userId}-${name}-${colors.join('-')}`),
        data
      );
    } catch (error) {
      console.log(error);
    }

    setConfirmation(false);
  };

  const onLike = async () => {
    try {
      const data = {};
      if (likedBy.includes(userId)) {
        data.likes = likes - 1;
        data.likedBy = likedBy.filter((id) => id !== userId);
      } else {
        data.likes = likes + 1;
        data.likedBy = [...likedBy, userId];
      }
      await setDoc(
        doc(trendsRef, `${author}-${name}-${colors.join('-')}`),
        data,
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }

    setConfirmation(false);
  };

  const onApplyTheme = () => {
    updateTheme(...colors);
  };

  return {
    onConvertAndShareCSVPalette,
    onCopy,
    onDeletePallete,
    onLike,
    onPublish,
    onSavePallete,
    onApplyTheme,
    setConfirmation,
    notification,
    isConfirmation,
  };
}
