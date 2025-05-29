import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const PROFILE_SIZE = width * 0.5;
const SHOT_SIZE = (width - 60) / 2; // Two images per row with spacing

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
  },

  // Header is in Header_1.tsx

  profileImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
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

  // Sample Shots
  sectionTitle: {
    marginTop: 30,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  shotsContainer: {
    marginTop: 12,
    paddingHorizontal: 20,
    gap: 12, // Space between rows
  },
  shotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shotImage: {
    width: SHOT_SIZE,
    height: SHOT_SIZE, // Square images
    borderRadius: 8,
  },

  // Record Video
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  recordButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Placeholder for a future grid
  placeholderGrid: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
  },
});