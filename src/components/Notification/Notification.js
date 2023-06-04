import { Text, View } from 'react-native';
import styles from './styles';
import { Portal } from '@react-native-material/core';

export default function Notification({ message }) {
  return (
    <Portal>
      <View style={styles.container}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Portal>
  );
}
