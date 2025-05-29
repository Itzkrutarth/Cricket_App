import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  Alert,
  PanResponder,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

const AnnotationScreen = () => {
//   const router = useRouter();
//   const { title, videoSource } = useLocalSearchParams();

//   const [annotations, setAnnotations] = useState<any[]>([]);
//   const [selectedTool, setSelectedTool] = useState<string | null>(null);
//   const [text, setText] = useState('');
//   const [textCoords, setTextCoords] = useState({ x: 100, y: 100 });
//   const [currentPath, setCurrentPath] = useState<string>('');

//   const pathRef = useRef<string>('');

//   const getVideoSource = () => {
//     if (typeof videoSource === 'string' && videoSource.startsWith('http')) {
//       return { uri: videoSource };
//     }
//     return require('../assets/videos/video.mp4');
//   };

//   const saveAnnotations = () => {
//     Alert.alert('Saved!', `${annotations.length} annotations saved.`);
//     router.back();
//   };

//   const eraseLast = () => {
//     if (annotations.length > 0) {
//       setAnnotations(annotations.slice(0, -1));
//     }
//   };

//   const addShape = () => {
//     setAnnotations([
//       ...annotations,
//       { type: 'circle', cx: width / 2, cy: height / 2, r: 40 },
//     ]);
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => selectedTool === 'marker' || selectedTool === 'pen',
//       onPanResponderGrant: (evt, gestureState) => {
//         const x = gestureState.x0;
//         const y = gestureState.y0;
//         pathRef.current = `M ${x} ${y}`;
//         setCurrentPath(pathRef.current);
//       },
//       onPanResponderMove: (evt, gestureState) => {
//         const x = gestureState.moveX;
//         const y = gestureState.moveY;
//         pathRef.current += ` L ${x} ${y}`;
//         setCurrentPath(pathRef.current);
//       },
//       onPanResponderRelease: () => {
//         setAnnotations([...annotations, { type: 'path', path: pathRef.current }]);
//         setCurrentPath('');
//         pathRef.current = '';
//       },
//     })
//   ).current;

//   return (
//     <View style={{ flex: 1, backgroundColor: '#f5f5f5' }} {...panResponder.panHandlers}>
//       {/* Header */}
//       <View style={headerStyles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
//           <Ionicons name="arrow-back" size={24} color="blue" />
//         </TouchableOpacity>
//         <Text style={headerStyles.title}>{title}</Text>
//         <TouchableOpacity onPress={saveAnnotations} style={{ padding: 8 }}>
//           <Ionicons name="save" size={24} color="#4CAF50" />
//         </TouchableOpacity>
//       </View>

//       {/* Video */}
//       <View style={{ flex: 9, backgroundColor: '#f5f5f5' }}>
//         <Video
//           source={getVideoSource()}
//           style={{ width: width, height: height * 0.75 }}
//           useNativeControls
//           resizeMode={ResizeMode.CONTAIN}
//           shouldPlay
//         />
//       </View>

//       {/* SVG Layer */}
//       <Svg style={StyleSheet.absoluteFillObject}>
//         {annotations.map((ann, index) => {
//           if (ann.type === 'text') {
//             return (
//               <SvgText key={index} x={ann.x} y={ann.y} fontSize="18" fill="#000">
//                 {ann.text}
//               </SvgText>
//             );
//           } else if (ann.type === 'path') {
//             return (
//               <Path key={index} d={ann.path} stroke="#000" strokeWidth={2} fill="none" />
//             );
//           } else if (ann.type === 'circle') {
//             return (
//               <Circle
//                 key={index}
//                 cx={ann.cx}
//                 cy={ann.cy}
//                 r={ann.r}
//                 stroke="#000"
//                 strokeWidth={2}
//                 fill="none"
//               />
//             );
//           }
//         })}
//         {/* Preview of current drawing */}
//         {currentPath !== '' && (
//           <Path d={currentPath} stroke="black" strokeWidth={2} fill="none" />
//         )}
//       </Svg>

//       {/* Toolbar */}
//       <View style={toolbarStyles.toolbar}>
//         <TouchableOpacity onPress={() => setSelectedTool('text')}>
//           <Ionicons name="text" size={24} color="#000" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             if (text.trim()) {
//               setAnnotations([
//                 ...annotations,
//                 { type: 'text', text, x: textCoords.x, y: textCoords.y },
//               ]);
//               setText('');
//               setSelectedTool(null);
//             }
//           }}
//         >
//           <Ionicons name="add-circle" size={24} color="#000" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setSelectedTool('marker')}>
//           <MaterialCommunityIcons name="marker" size={24} color="#000" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setSelectedTool('pen')}>
//           <FontAwesome5 name="pen" size={20} color="#000" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={eraseLast}>
//           <Ionicons name="trash-bin" size={24} color="#FF4444" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={addShape}>
//           <Ionicons name="ellipse" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>

//       {/* Text Input */}
//       {selectedTool === 'text' && (
//         <View style={textInputStyles.textInputContainer}>
//           <TextInput
//             placeholder="Enter text"
//             value={text}
//             onChangeText={setText}
//             style={textInputStyles.textInput}
//             placeholderTextColor="#999"
//           />
//         </View>
//       )}
//     </View>
//   );
};

// const headerStyles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 50,
//     paddingHorizontal: 20,
//     paddingBottom: 10,
//     backgroundColor: '#fff',
//   },
//   title: {
//     color: 'blue',
//     fontSize: 18,
//     fontWeight: 'bold',
//     flex: 1,
//     textAlign: 'center',
//   },
// });

// const toolbarStyles = StyleSheet.create({
//   toolbar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//     backgroundColor: '#e0e0e0',
//   },
// });

// const textInputStyles = StyleSheet.create({
//   textInputContainer: {
//     backgroundColor: '#fff',
//     padding: 10,
//   },
//   textInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//   },
// });

export default AnnotationScreen;
