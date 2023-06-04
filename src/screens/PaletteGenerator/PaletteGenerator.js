import React, { useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Flex, Text, TextInput, Button } from '@react-native-material/core';
import ColorPalette from '../../components/ColorPallete/ColorPallete';
import { generateAIPalettes } from '../../helpers/generateAIPalette';
import styles from './styles';

export default function PaletteGenerator({ route, navigation, userId }) {
  const [mode, setMode] = useState('transformer');
  const [numColors, setNumColors] = useState('4');
  const [temperature, setTemperature] = useState('1.2');
  const [adjacency, setAdjacency] = useState([
    '0',
    '65',
    '45',
    '35',
    '65',
    '0',
    '35',
    '65',
    '45',
    '35',
    '0',
    '35',
    '35',
    '65',
    '35',
    '0',
  ]);
  const [palette, setPalette] = useState(['#000000', '-', '-', '-']);
  const [generatedPalettes, setGeneratedPalettes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({});
  const scrollViewRef = useRef(null);

  const handleReset = () => {
    setMode('transformer');
    setNumColors('4');
    setTemperature('1.2');
    setAdjacency([
      '0',
      '65',
      '45',
      '35',
      '65',
      '0',
      '35',
      '65',
      '45',
      '35',
      '0',
      '35',
      '35',
      '65',
      '35',
      '0',
    ]);
    setPalette(['#000000', '-', '-', '-']);
    setGeneratedPalettes([]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const data = await generateAIPalettes(
        mode,
        numColors,
        temperature,
        10,
        adjacency,
        palette
      );
      setGeneratedPalettes(data);
    } catch (error) {
      alert('You entered wrong form data...');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (
      numColors > 12 ||
      numColors < 2 ||
      temperature < 0 ||
      temperature > 2.4
    ) {
      alert('Please fill in all required fields.');
      return false;
    }

    if (!(adjacency.length > 1)) {
      alert('Please provide a valid adjacency matrix.');
      return false;
    }

    if (!(palette.length > 1)) {
      alert('Please provide a valid palette.');
      return false;
    }

    return true;
  };

  const onColorRemove = (paletteIdx) => {
    return (colorIdx) => {
      const { color, palette } = selected;
      const duplicate = JSON.parse(JSON.stringify(generatedPalettes));
      duplicate[paletteIdx].palette.splice(colorIdx, 1);
      if (paletteIdx === palette && color === colorIdx) {
        setSelected({});
      } else if (paletteIdx === palette && color > colorIdx) {
        setSelected({
          palette,
          color: color - 1,
        });
      }
      setGeneratedPalettes(duplicate);
    };
  };

  const onColorSelect = (paletteIdx) => {
    return (colorIdx) => {
      const { color, palette } = selected;
      if (paletteIdx === palette && colorIdx === color) {
        setSelected({});
      } else {
        setSelected({
          palette: paletteIdx,
          color: colorIdx,
        });
      }
    };
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current.scrollTo({
          y: 500,
          animated: true,
        })
      }
    >
      <View style={styles.container}>
        <Text variant='caption' style={{ marginLeft: 10 }}>
          Mode:
        </Text>
        <RadioButton.Group
          onValueChange={(value) => setMode(value)}
          value={mode}
        >
          <View style={styles.radioGroup}>
            <RadioButton.Item
              style={styles.radioGroupItem}
              labelVariant='bodyMedium'
              label='Transformer'
              value='transformer'
            />
            <RadioButton.Item
              style={styles.radioGroupItem}
              labelVariant='bodyMedium'
              label='Diffusion'
              value='diffusion'
            />
            <RadioButton.Item
              style={styles.radioGroupItem}
              labelVariant='bodyMedium'
              label='Random'
              value='random'
            />
          </View>
        </RadioButton.Group>
        <TextInput
          style={styles.input}
          label='Number of Colors (2 ≤ n ≤ 12):'
          value={numColors}
          onChangeText={(value) => setNumColors(value)}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder='Enter temperature'
          label='Temperature (0 ≤ n ≤ 2.4):'
          value={temperature}
          onChangeText={(value) => setTemperature(value)}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          label='Adjacency Matrix:'
          value={adjacency.join(',')}
          onChangeText={(value) => setAdjacency(value.split(','))}
        />
        <TextInput
          style={styles.input}
          label="Palette (hex codes or '-' if blank):"
          value={palette.join(',')}
          onChangeText={(value) => setPalette(value.split(','))}
        />
        <Flex direction='row' justify='space-between'>
          <Button
            variant='outlined'
            uppercase={false}
            onPress={handleReset}
            style={{ width: 140 }}
            title='Reset'
          />
          <Button
            loading={loading}
            uppercase={false}
            onPress={handleSubmit}
            style={{ width: 200 }}
            title='Generate Palettes'
          />
        </Flex>
        {generatedPalettes.length > 0 && (
          <>
            <Text variant='h4' style={styles.palettesTitle}>
              Generated Palettes
            </Text>
            <View style={styles.listContainer}>
              {generatedPalettes.map((item, index) => (
                <React.Fragment key={`${item.score}-${index}}`}>
                  <Text
                    variant='body2'
                    style={{ marginLeft: 'auto', marginRight: 6 }}
                  >
                    Score: {item.score.toFixed(2)}
                  </Text>
                  <ColorPalette
                    canCreate={true}
                    colors={item.palette}
                    spacing={20}
                    userId={userId}
                    onColorRemove={onColorRemove(index)}
                    onColorSelect={onColorSelect(index)}
                    activeColor={
                      selected.palette === index ? selected.color : undefined
                    }
                  />
                </React.Fragment>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
