// styles/StudentDetailStyles.ts
import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

const IMAGE_SIZE = width * 0.5;

 export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5',},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#1D3557',
  },

  profileImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    alignSelf: 'center',
    marginTop: 24,
  },
  name: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2937',
  },
  subTitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
  },

  placeholderGrid: {
    marginTop: 32,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 16,
    borderRadius: 8,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
});