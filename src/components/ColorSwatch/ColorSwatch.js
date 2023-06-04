import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from './styles';

export default function ColorSwatch({
  active,
  color,
  onColorRemove,
  handlePress,
  handlePressIn,
  handlePressOut,
  isPressed = false,
}) {
  return (
    <View style={styles.swatchContainer}>
      <TouchableOpacity
        disabled={!handlePress}
        style={[
          styles.colorSwatch,
          {
            backgroundColor: color,
            ...(active
              ? {
                  borderWidth: 2,
                  borderColor: 'grey',
                }
              : {}),
          },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.colorHint}>{color}</Text>
      </TouchableOpacity>
      {isPressed && onColorRemove && (
        <TouchableOpacity
          style={styles.removeSwatchIcon}
          onPress={onColorRemove}
        >
          <AntDesign name='closecircleo' size={24} color='red' />
        </TouchableOpacity>
      )}
    </View>
  );
}
