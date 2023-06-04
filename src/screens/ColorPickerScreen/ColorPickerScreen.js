import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { Button, Flex, TextInput } from '@react-native-material/core';
import ColorPalette from '../../components/ColorPallete/ColorPallete';
import styles from './styles';
import ColorSwatch from '../../components/ColorSwatch/ColorSwatch';
import Notification from '../../components/Notification/Notification';
import usePaletteActions from '../../hooks/usePaletteActions';
import Color from 'color';

export default function ColorPickerScreen({ userId, route }) {
  const palleteInfo = route.params?.palleteInfo || {};
  const [colorPallete, setColorPallete] = useState(palleteInfo.colors || []);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [colorInput, setColorInput] = useState('#000000');
  const [selectedColorIdx, setSelectedColorIdx] = useState();

  const { onCopy, notification } = usePaletteActions({});

  const onColorChange = (color) => {
    setCurrentColor(color);
    setColorInput(color);
  };

  const onCommitColor = () => {
    if (selectedColorIdx === undefined) {
      if (!colorPallete.includes(currentColor)) {
        setColorPallete([...colorPallete, currentColor]);
      }
    } else {
      const duplicate = [...colorPallete];
      duplicate[selectedColorIdx] = currentColor;
      setColorPallete(duplicate);
    }
  };

  const onColorRemove = (idx) => {
    const duplicate = [...colorPallete];
    duplicate.splice(idx, 1);
    if (selectedColorIdx === idx) {
      setSelectedColorIdx(undefined);
    } else if (selectedColorIdx > idx) {
      setSelectedColorIdx(selectedColorIdx - 1);
    }
    setColorPallete(duplicate);
  };

  const onColorSelect = (idx) => {
    if (idx === selectedColorIdx) {
      setSelectedColorIdx(undefined);
    } else {
      setSelectedColorIdx(idx);
    }
  };

  useEffect(() => {
    try {
      const parsedColor = Color(colorInput);
      hex = parsedColor.hex();
      setCurrentColor(hex);
    } catch (error) {}
  }, [colorInput]);

  useEffect(() => {
    setColorPallete(palleteInfo.colors || []);
  }, [route]);

  return (
    <ScrollView>
      <View style={styles.pickerContainer}>
        <ColorPicker
          color={currentColor}
          onColorChangeComplete={onColorChange}
          thumbSize={30}
          sliderSize={20}
          noSnap={true}
          row={false}
          palette={palleteInfo.colors}
        />
      </View>
      <View style={styles.palleteContainer}>
        <Flex direction='row' justify='between' items='center'>
          <TextInput
            style={styles.colorInput}
            label='Enter color:'
            value={colorInput}
            onChangeText={setColorInput}
            variant='standard'
          />
          <ColorSwatch
            active={true}
            color={currentColor}
            handlePress={() => onCopy(currentColor)}
          />
        </Flex>
        <Button
          title={
            selectedColorIdx === undefined
              ? 'Add color to palette'
              : 'Update selected color'
          }
          color='green'
          onPress={onCommitColor}
        />
        <ColorPalette
          canCreate
          colors={colorPallete}
          onColorRemove={onColorRemove}
          onColorSelect={onColorSelect}
          onClear={() => setColorPallete([])}
          userId={userId}
          id={palleteInfo.id}
          name={palleteInfo.name}
          activeColor={selectedColorIdx}
        />
        {notification && (
          <Notification message={`Text Copied: ${notification}`} />
        )}
      </View>
    </ScrollView>
  );
}
