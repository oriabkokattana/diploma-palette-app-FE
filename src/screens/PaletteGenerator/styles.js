import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  radioGroup: {
    flexDirection: 'column',
    gap: 5,
  },
  radioGroupItem: {
    width: 160,
    height: 50,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#48464B',
    borderRadius: 20,
  },
  palettesTitle: {
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  listContainer: {
    padding: 10,
  },
});
