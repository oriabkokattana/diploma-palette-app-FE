import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  swatchContainer: {
    position: 'relative',
  },
  colorSwatch: {
    width: 70,
    height: 70,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 6,
      height: -5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowColor: '#3C84A1',
  },
  colorHint: {
    fontSize: 12,
    color: 'white',
    fontWeight: '700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowColor: 'black',
  },
  removeSwatchIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});
