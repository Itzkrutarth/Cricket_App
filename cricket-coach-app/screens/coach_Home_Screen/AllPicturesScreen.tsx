import React from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import { styles } from '../../styles/AllPicturesStyles';
import Header from './Header_1';

const pictureData = [
  { id: '1', image: require('../../assets/images/cricket.jpg') },
  { id: '2', image: require('../../assets/images/cricket.jpg') },
  { id: '3', image: require('../../assets/images/cricket.jpg') },
  { id: '4', image: require('../../assets/images/cricket.jpg') },
  // Add more images here
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 30;

const AllPicturesScreen = () => {
  return (
    <View style={styles.container}>
     <Header title='All Pictures'/>
      <FlatList
        data={pictureData}
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

export default AllPicturesScreen;
