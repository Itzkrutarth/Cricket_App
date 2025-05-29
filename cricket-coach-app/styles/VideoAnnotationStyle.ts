// 3) AnnotationStyle.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  video: {
    width: width,
    height: height * 0.9,
  },
  toolbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  textInputContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    paddingHorizontal: 20,
  },
  textInput: {
    backgroundColor: '#eee',
    color: '#000',
    borderRadius: 10,
    padding: 10,
  },
});