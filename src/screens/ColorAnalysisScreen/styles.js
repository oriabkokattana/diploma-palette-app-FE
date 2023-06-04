import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  colorInput: {
    width: '50%',
  },
  statisticsContainer: {
    rowGap: 15,
  },
  statItem: {
    maxWidth: '49%',
    width: '49%',
    textAlign: 'left',
    gap: 10,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
  },
});
