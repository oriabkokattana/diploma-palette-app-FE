import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Flex,
  Stack,
  TextInput,
  useTheme,
} from '@react-native-material/core';
import {
  Octicons,
  AntDesign,
  Entypo,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';
import { useClickOutside } from 'react-native-click-outside';
import styles from './styles';
import Notification from '../Notification/Notification';
import ColorSwatch from '../ColorSwatch/ColorSwatch';
import usePaletteActions from '../../hooks/usePaletteActions';

function ColorPalette({
  colors,
  onColorSelect,
  onColorRemove,
  onClear,
  userId,
  userName,
  canLike = false,
  canCreate = false,
  canEdit = false,
  spacing,
  id,
  name = '',
  activeColor,
  likes = 0,
  likedBy = [],
  author,
}) {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);
  const [palleteName, setPalleteName] = useState(name);
  const pressTimer = useRef();
  const paletteRef = useClickOutside(() => setIsPressed(false));
  const theme = useTheme();

  const {
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
  } = usePaletteActions({
    palleteName,
    userId,
    id,
    colors,
    name,
    author,
    userName,
    likedBy,
    likes,
  });

  const handlePressIn = () => {
    if (!canEdit) {
      const timer = setTimeout(() => {
        setIsPressed(true);
      }, 800);

      pressTimer.current = timer;
    }
  };

  const handlePressOut = () => {
    if (!canEdit) {
      clearTimeout(pressTimer.current);
    }
  };

  const handlePress = (idx) => {
    if (onColorSelect) {
      onColorSelect(idx);
    }
    onCopy(colors[idx]);
  };

  return (
    <Flex direction='column' style={{ marginBottom: spacing }}>
      <Flex direction='row'>
        <View
          style={[
            styles.paletteContainer,
            {
              borderColor: theme.palette.border?.main || '#3C84A1',
              width:
                canEdit || canLike
                  ? Dimensions.get('window').width - 134
                  : '100%',
            },
          ]}
          ref={paletteRef}
        >
          {colors.length > 0 ? (
            colors.map((color, index) => (
              <ColorSwatch
                key={color}
                color={color}
                active={activeColor === index}
                onColorRemove={
                  onColorRemove ? () => onColorRemove(index) : undefined
                }
                handlePress={() => handlePress(index)}
                handlePressIn={handlePressIn}
                handlePressOut={handlePressOut}
                isPressed={isPressed}
              />
            ))
          ) : (
            <Text style={styles.placeholderText}>
              Here will be your palette...
            </Text>
          )}
        </View>
        {canLike && (
          <View style={styles.likeContainer}>
            <TouchableOpacity style={styles.icon} onPress={onLike}>
              <AntDesign
                name='like1'
                size={32}
                color={likedBy.includes(userId) ? 'green' : 'grey'}
              />
            </TouchableOpacity>
            <Text style={styles.likeLabel}>{likes}</Text>
          </View>
        )}
        {canEdit && (
          <View style={styles.iconsContainer}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() =>
                navigation.jumpTo('Color Picker', {
                  palleteInfo: { id, colors, name },
                })
              }
            >
              <Feather name='edit' size={32} color='green' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={onDeletePallete}>
              <Octicons name='diff-removed' size={32} color='red' />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={onConvertAndShareCSVPalette}
            >
              <Entypo name='share' size={32} color='#3C84A1' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={() => onCopy()}>
              <MaterialCommunityIcons
                name='content-copy'
                size={32}
                color='#767181'
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={onPublish}>
              <MaterialIcons name='publish' size={32} color='#E57C23' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={onApplyTheme}>
              <Ionicons name='md-logo-flickr' size={32} color='#FF0060' />
            </TouchableOpacity>
          </View>
        )}
      </Flex>
      {canCreate && (
        <Flex direction='row' justify='space-between'>
          {onClear && (
            <Button
              style={styles.saveButton}
              variant='text'
              title='Clear Palette'
              uppercase={false}
              onPress={onClear}
            />
          )}
          <Button
            style={styles.saveButton}
            title='Save Palette'
            uppercase={false}
            disabled={!(colors.length > 0)}
            onPress={() => setConfirmation(true)}
          />
        </Flex>
      )}
      <Dialog visible={isConfirmation} onDismiss={() => setConfirmation(false)}>
        <DialogHeader title='Enter palette name' />
        <DialogContent>
          <Stack spacing={2}>
            <TextInput
              label='Poster-palette...'
              variant='outlined'
              value={palleteName}
              onChangeText={(text) => setPalleteName(text)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            title='Cancel'
            compact
            variant='text'
            onPress={() => setConfirmation(false)}
          />
          <Button
            title='Save'
            compact
            variant='text'
            disabled={!(palleteName.length > 0)}
            onPress={onSavePallete}
          />
        </DialogActions>
      </Dialog>
      {notification && (
        <Notification message={`Text Copied: ${notification}`} />
      )}
    </Flex>
  );
}

export default React.memo(ColorPalette);
