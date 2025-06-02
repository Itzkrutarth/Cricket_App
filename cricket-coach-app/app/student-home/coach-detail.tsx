import React from 'react';
import { View, Text, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from '../../screens/coach_Home_Screen/Header_1';
import { styles } from '../../styles/CoachesStyle';

export default function CoachDetailsScreen() {
  const { id, name, photoUrl } = useLocalSearchParams<{
    id: string;
    name: string;
    photoUrl: string;
  }>();

  if (!id || !name || !photoUrl) {
    return (
      <View style={styles.container}>
        <Header title="Coach Details" />
        <Text style={styles.name}>Coach not found</Text>
      </View>
    );
  }

  return 
//     <View style={styles.container}>
//       <Header title={name} />
//       <View style={styles.detailsContainer}>
//         <Image source={{ uri: photoUrl }} style={styles.image} />
//         <Text style={styles.name}>ID: {id}</Text>
//         <Text style={styles.name}>Name: {name}</Text>
//       </View>
//     </View>
//   );
}