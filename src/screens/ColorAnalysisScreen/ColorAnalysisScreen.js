import React, { useState } from 'react';
import { View } from 'react-native';
import Color from 'color';
import { Button, Flex, Text, TextInput } from '@react-native-material/core';
import ColorSwatch from '../../components/ColorSwatch/ColorSwatch';
import { ScrollView } from 'react-native-gesture-handler';
import usePaletteActions from '../../hooks/usePaletteActions';
import Notification from '../../components/Notification/Notification';
import { generateAIPalettes } from '../../helpers/generateAIPalette';
import ColorPalette from '../../components/ColorPallete/ColorPallete';
import styles from './styles';

const getContrastStatus = (contrast) => {
  if (contrast < 2.5) {
    return 'very low';
  }

  if (contrast >= 2.5 && contrast < 4.5) {
    return 'low';
  }

  if (contrast >= 4.5 && contrast < 7.5) {
    return 'medium';
  }

  return 'high';
};

export default function ColorAnalysisScreen({ userId }) {
  const [mainColor, setMainColor] = useState('');
  const [contrastColor, setContrastColor] = useState('#FFFFFF');

  const [analytics, setAnalytics] = useState();

  const [complementaryColor, setComplementaryColor] = useState('');
  const [analogousColors, setAnalogousColors] = useState([]);
  const [splitComplementaryColors, setSplitComplementaryColors] = useState([]);

  const [contrastColors, setContrastColors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [aiPalletes, setAIPalettes] = useState([]);

  const { onCopy, notification } = usePaletteActions({});

  const analyzeColor = async () => {
    try {
      setLoading(true);

      const color = Color(mainColor, 'hex');
      setAnalytics({
        main: color,
        contrast: Color(contrastColor, 'hex'),
      });

      const hsl = color.hsl().object();

      // Calculate complementary color
      const complementary = Color({
        h: (hsl.h + 180) % 360,
        s: hsl.s,
        l: hsl.l,
      });
      setComplementaryColor(complementary.hex());

      // Calculate analogous colors
      const analogous1 = Color({
        h: (hsl.h - 30 + 360) % 360,
        s: hsl.s,
        l: hsl.l,
      });
      const analogous2 = Color({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l });
      setAnalogousColors([analogous1.hex(), analogous2.hex()]);

      // Calculate split-complementary colors
      const splitComplementary1 = Color({
        h: (hsl.h + 150) % 360,
        s: hsl.s,
        l: hsl.l,
      });
      const splitComplementary2 = Color({
        h: (hsl.h + 210) % 360,
        s: hsl.s,
        l: hsl.l,
      });
      setSplitComplementaryColors([
        splitComplementary1.hex(),
        splitComplementary2.hex(),
      ]);

      const contrastList = [];

      for (let i = 0; i < 6; i++) {
        const contrastingColor = Color({
          h: (hsl.h + i * 60) % 360,
          s: hsl.s,
          l: 100 - hsl.l,
        });
        contrastList.push(contrastingColor.hex());
      }

      setContrastColors(contrastList);

      const data = await generateAIPalettes(
        'diffusion',
        4,
        1.2,
        3,
        [
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
        ],
        [color.hex(), '-', '-', '-']
      );
      setAIPalettes(data);
    } catch (error) {
      alert('Wrong color! Enter a hex format...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Flex direction='row' justify='between' mb={20}>
          <TextInput
            style={styles.colorInput}
            label='Enter main color:'
            value={mainColor}
            onChangeText={setMainColor}
            variant='standard'
          />
          <ColorSwatch active={true} color={mainColor} />
        </Flex>

        <Flex direction='row' justify='between' mb={20}>
          <TextInput
            style={styles.colorInput}
            label='Enter contrast color:'
            value={contrastColor}
            onChangeText={setContrastColor}
            variant='standard'
          />
          <ColorSwatch active={true} color={contrastColor} />
        </Flex>

        <Button
          title='Analyze Color'
          onPress={analyzeColor}
          loading={loading}
        />

        {analytics && (
          <Flex
            wrap='wrap'
            justify='between'
            direction='row'
            style={styles.statisticsContainer}
            mt={30}
          >
            <Text variant='body2' style={styles.statItem}>
              <Text style={styles.boldText}>CMYK:</Text>{' '}
              {analytics.main.cmyk().round().string()}
            </Text>
            <Text variant='body2' style={styles.statItem}>
              <Text style={styles.boldText}>HSV:</Text>{' '}
              {analytics.main.hsv().round().string()}
            </Text>
            <View style={styles.divider} />
            <Text variant='body2' style={styles.statItem}>
              <Text style={styles.boldText}>HSL:</Text>{' '}
              {analytics.main.hsl().round().string()}
            </Text>
            <Text variant='body2' style={styles.statItem}>
              <Text style={styles.boldText}>Contrast:</Text>{' '}
              {analytics.main.contrast(Color(analytics.contrast)).toFixed(2)} (
              {getContrastStatus(
                analytics.main.contrast(Color(analytics.contrast))
              )}
              )
            </Text>
            <View style={styles.divider} />

            <Text variant='body2' style={styles.statItem}>
              <Text style={styles.boldText}>Complementary Color:</Text>
            </Text>
            <View style={styles.statItem}>
              <ColorSwatch
                active={true}
                color={complementaryColor}
                handlePress={() => onCopy(complementaryColor)}
              />
            </View>
            <View style={styles.divider} />

            <Text variant='body2'>
              <Text style={styles.boldText}>Analogous Colors:</Text>
            </Text>
            <Flex direction='row' style={styles.statItem}>
              {analogousColors.map((color, index) => (
                <ColorSwatch
                  key={index}
                  active={true}
                  color={color}
                  handlePress={() => onCopy(color)}
                />
              ))}
            </Flex>
            <View style={styles.divider} />

            <Text variant='body2' style={styles.statItem}>
              <Text style={styles.boldText}>Split-Complementary Colors:</Text>
            </Text>
            <Flex direction='row' style={styles.statItem}>
              {splitComplementaryColors.map((color, index) => (
                <ColorSwatch
                  key={index}
                  active={true}
                  color={color}
                  handlePress={() => onCopy(color)}
                />
              ))}
            </Flex>
            <View style={styles.divider} />

            <Text variant='body2' style={styles.statItem}>
              <Text style={styles.boldText}>Contrast Colors:</Text>
            </Text>
            <Flex direction='row' style={styles.statItem}>
              {contrastColors.map((color, index) => (
                <ColorSwatch
                  key={index}
                  active={true}
                  color={color}
                  handlePress={() => onCopy(color)}
                />
              ))}
            </Flex>
            <View style={styles.divider} />

            <Text variant='body2' style={styles.statItem}>
              <Text style={styles.boldText}>Suggested AI palettes:</Text>
            </Text>
            <Flex style={{ width: '100%' }}>
              {aiPalletes.map((item, index) => (
                <ColorPalette
                  key={`${item.score}-${index}}`}
                  canCreate={true}
                  colors={item.palette}
                  spacing={20}
                  userId={userId}
                />
              ))}
            </Flex>
          </Flex>
        )}
        {notification && (
          <Notification message={`Text Copied: ${notification}`} />
        )}
      </View>
    </ScrollView>
  );
}
