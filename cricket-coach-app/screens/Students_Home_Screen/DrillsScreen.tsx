import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from './Header_1';
import { styles } from '../../styles/DrillsStyles';

type Drill = {
  id: string;
  name: string;
  iconUrl: string;
};

const initialDrills: Drill[] = [
  { id: '1', name: 'Lunge with intent drill', iconUrl: 'https://picsum.photos/300/300?1' },
  { id: '2', name: 'Cut shot drill', iconUrl: 'https://picsum.photos/300/300?2' },
  { id: '3', name: 'Pull shot drill', iconUrl: 'https://picsum.photos/300/300?3' },
  { id: '4', name: 'Scoop drill', iconUrl: 'https://picsum.photos/300/300?4' },
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 30;

export default function DrillsScreen() {
  const [drills, setDrills] = useState<Drill[]>(initialDrills);
  const router = useRouter();

  const addDrill = () => {
    const nextId = (drills.length + 1).toString();
    setDrills(curr => [
      ...curr,
      {
        id: nextId,
        name: `New Drill ${nextId}`,
        iconUrl: `https://picsum.photos/300/300?${nextId}`,
      },
    ]);
  };

  const removeDrill = () => {
    setDrills(curr => curr.slice(0, -1));
  };

  const openDetails = (drill: Drill) => {
    router.push({
      pathname: './drill_details',
      params: {
        id: drill.id,
        name: drill.name,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Drills" />
      <FlatList
        data={drills}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { width: itemSize }]}
            onPress={() => openDetails(item)}
            accessibilityLabel={`View ${item.name}`}
            accessibilityRole="button"
          >
            <Image source={{ uri: item.iconUrl }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={addDrill} style={styles.button}>
          <Feather name="plus" size={20} color="#1D3557" />
          <Text style={styles.buttonText}>Add Drill</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={removeDrill} style={styles.button}>
          <Feather name="minus" size={20} color="#1D3557" />
          <Text style={styles.buttonText}>Remove Drill</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}