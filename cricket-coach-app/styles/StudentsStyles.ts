// styles/StudentsStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 20 * 3) / 2; // two cards per row, 20px gutters

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // leave room for the bottom buttons
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: cardWidth,
    borderRadius: 8,
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },

  buttonContainer: {
    padding: 20,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#f5f5f5',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D3557',
  },
});
