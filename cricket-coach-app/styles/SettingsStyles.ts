import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  title: {
    padding: 10,
    marginHorizontal: 16, // equal space left and right
    marginVertical: 10, // equal space top and bottom
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    alignSelf: "center", // centers item inside FlatList/Grid
  },
  placeholder: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
