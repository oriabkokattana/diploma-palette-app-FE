import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  paletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1,
    justifyContent: 'space-between',
    // columnGap: 10,
    rowGap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 94,
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 15,
    marginLeft: 20,
    width: 74,
    height: '100%',
  },
  likeLabel: {
    fontSize: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifySelf: 'flex-end',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
    marginLeft: 20,
    width: 74,
  },
  icon: {
    width: 32,
    height: 32,
  },
  placeholderText: {
    fontSize: 16,
    color: '#2e2e2d',
    opacity: 0.7,
  },
  saveButton: {
    marginTop: 20,
    width: 160,
    alignSelf: 'center',
  },
});
