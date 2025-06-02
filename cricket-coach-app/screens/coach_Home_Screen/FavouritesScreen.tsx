import React from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import { styles } from '../../styles/FavouritesStyles';
import Header from './Header_1';
const favouriteData = [
  { id: '1', image: require('../../assets/images/cricket.jpg') },
  { id: '2', image: require('../../assets/images/cricket.jpg') },
  { id: '3', image: require('../../assets/images/cricket.jpg') },
  { id: '4', image: require('../../assets/images/cricket.jpg') },
  // Add more favorite items as needed
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 30;

const FavouritesScreen = () => {
  return (
    <View style={styles.container}>
      <Header title='Favourites' />
      <FlatList
        data={favouriteData}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={[styles.item, { width: itemSize }]}>
            <Image source={item.image} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
};

export default FavouritesScreen;
