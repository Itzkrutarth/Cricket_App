import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    margin: 15,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#1D3557',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#1D3557',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  detailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D3557',
    marginBottom: 15,
    lineHeight: 24,
  },
  playButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});