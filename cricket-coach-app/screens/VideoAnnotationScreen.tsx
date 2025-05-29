import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  PanResponder,
  SafeAreaView,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

// Type definitions
interface DrawingAnnotation {
  id: number;
  type: 'pen' | 'marker';
  path: string;
  color: string;
  strokeWidth: number;
  opacity: number;
}

interface TextAnnotation {
  id: number;
  type: 'text';
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
}

type Annotation = DrawingAnnotation | TextAnnotation;
type ToolType = 'pen' | 'marker' | 'text' | null;

const { width, height } = Dimensions.get('window');

const VideoAnnotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // State management
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [showTextModal, setShowTextModal] = useState(false);
  const [textAnnotation, setTextAnnotation] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [hasChanges, setHasChanges] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  
  const pathRef = useRef('');
  const videoRef = useRef<Video>(null);

  const { title, videoSource } = params;

  const getVideoSource = () => {
    if (typeof videoSource === 'string' && videoSource.startsWith('http')) {
      return { uri: videoSource };
    }
    return require('../assets/videos/video.mp4');
  };

  // Drawing functionality
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => selectedTool === 'pen' || selectedTool === 'marker',
    onMoveShouldSetPanResponder: () => selectedTool === 'pen' || selectedTool === 'marker',
    
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      pathRef.current = `M${locationX},${locationY}`;
      setCurrentPath(pathRef.current);
    },
    
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      pathRef.current += ` L${locationX},${locationY}`;
      setCurrentPath(pathRef.current);
    },
    
    onPanResponderRelease: () => {
      if (pathRef.current && (selectedTool === 'pen' || selectedTool === 'marker')) {
        const newAnnotation: DrawingAnnotation = {
          id: Date.now(),
          type: selectedTool,
          path: pathRef.current,
          color: selectedTool === 'pen' ? '#FF3030' : '#FFD700',
          strokeWidth: selectedTool === 'pen' ? 3 : 8,
          opacity: selectedTool === 'pen' ? 1 : 0.7,
        };
        setAnnotations(prev => [...prev, newAnnotation]);
        setCurrentPath('');
        pathRef.current = '';
        setHasChanges(true);
      }
    },
  });

  // Text annotation handling
  const handleTextAnnotation = (evt: any) => {
    if (selectedTool === 'text') {
      const { locationX, locationY } = evt.nativeEvent;
      setTextPosition({ x: locationX, y: locationY });
      setShowTextModal(true);
    }
  };

  const addTextAnnotation = () => {
    if (textAnnotation.trim()) {
      const newAnnotation: TextAnnotation = {
        id: Date.now(),
        type: 'text',
        text: textAnnotation,
        x: textPosition.x,
        y: textPosition.y,
        color: '#FFFFFF',
        fontSize: 18,
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      setTextAnnotation('');
      setShowTextModal(false);
      setHasChanges(true);
    }
  };

  // Tool management
  const selectTool = (tool: ToolType) => {
    setSelectedTool(selectedTool === tool ? null : tool);
  };

  const clearAllAnnotations = () => {
    Alert.alert(
      'Clear Annotations',
      'Are you sure you want to clear all annotations?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            setAnnotations([]);
            setHasChanges(false);
            setSelectedTool(null);
          }
        }
      ]
    );
  };

  const undoLastAnnotation = () => {
    if (annotations.length > 0) {
      setAnnotations(prev => prev.slice(0, -1));
      setHasChanges(annotations.length > 1);
    }
  };

  // Save functionality
  const saveAnnotations = () => {
    Alert.alert(
      'Save Annotations',
      `Save ${annotations.length} annotations?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: () => {
            // Implement your save logic here
            console.log('Saving annotations:', annotations);
            setHasChanges(false);
            Alert.alert('Success', 'Annotations saved successfully!');
          }
        }
      ]
    );
  };

  // Video controls
  const toggleVideoPlayback = async () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const exitAnnotationMode = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved annotations. What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
          { text: 'Save & Exit', onPress: () => { saveAnnotations(); router.back(); } }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={exitAnnotationMode}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          Annotate: {title}
        </Text>
        
        <View style={styles.headerActions}>
          {hasChanges && (
            <TouchableOpacity style={styles.saveHeaderButton} onPress={saveAnnotations}>
              <Ionicons name="save" size={20} color="white" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.headerButton} onPress={toggleVideoPlayback}>
            <Ionicons 
              name={isVideoPlaying ? "pause" : "play"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Video Player with Annotation Overlay */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={getVideoSource()}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={true}
          onPlaybackStatusUpdate={(status) => {
            setVideoStatus(status);
            if (status.isLoaded) {
              setIsVideoPlaying(status.isPlaying || false);
            }
          }}
        />
        
        {/* Saved Annotations Layer */}
        <View style={styles.savedAnnotationsOverlay} pointerEvents="none">
          <Svg style={StyleSheet.absoluteFillObject}>
            {annotations.map((annotation) => {
              if (annotation.type === 'text') {
                return (
                  <SvgText
                    key={annotation.id}
                    x={annotation.x}
                    y={annotation.y}
                    fill={annotation.color}
                    fontSize={annotation.fontSize}
                    fontWeight="bold"
                    stroke="#000"
                    strokeWidth={1}
                  >
                    {annotation.text}
                  </SvgText>
                );
              } else {
                return (
                  <Path
                    key={annotation.id}
                    d={annotation.path}
                    stroke={annotation.color}
                    strokeWidth={annotation.strokeWidth}
                    strokeOpacity={annotation.opacity}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              }
            })}
          </Svg>
        </View>

        {/* Active Drawing Layer */}
        {selectedTool && (
          <View
            style={styles.drawingOverlay}
            {...panResponder.panHandlers}
            onTouchEnd={handleTextAnnotation}
          >
            <Svg style={StyleSheet.absoluteFillObject}>
              {currentPath && (
                <Path
                  d={currentPath}
                  stroke={selectedTool === 'pen' ? '#FF3030' : '#FFD700'}
                  strokeWidth={selectedTool === 'pen' ? 3 : 8}
                  strokeOpacity={selectedTool === 'pen' ? 1 : 0.7}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </Svg>
          </View>
        )}
      </View>

      {/* Tool Palette */}
      <View style={styles.toolPalette}>
        <View style={styles.toolsRow}>
          {/* Drawing Tools */}
          <TouchableOpacity
            style={[styles.toolButton, selectedTool === 'pen' && styles.selectedTool]}
            onPress={() => selectTool('pen')}
          >
            <Ionicons name="pencil" size={24} color={selectedTool === 'pen' ? '#000' : '#fff'} />
            <Text style={[styles.toolLabel, selectedTool === 'pen' && styles.selectedToolLabel]}>
              Pen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolButton, selectedTool === 'marker' && styles.selectedTool]}
            onPress={() => selectTool('marker')}
          >
            <Ionicons name="brush" size={24} color={selectedTool === 'marker' ? '#000' : '#fff'} />
            <Text style={[styles.toolLabel, selectedTool === 'marker' && styles.selectedToolLabel]}>
              Marker
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolButton, selectedTool === 'text' && styles.selectedTool]}
            onPress={() => selectTool('text')}
          >
            <Ionicons name="text" size={24} color={selectedTool === 'text' ? '#000' : '#fff'} />
            <Text style={[styles.toolLabel, selectedTool === 'text' && styles.selectedToolLabel]}>
              Text
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toolsRow}>
          {/* Action Tools */}
          <TouchableOpacity
            style={[styles.toolButton, styles.actionButton]}
            onPress={undoLastAnnotation}
            disabled={annotations.length === 0}
          >
            <Ionicons 
              name="arrow-undo" 
              size={24} 
              color={annotations.length === 0 ? '#666' : '#fff'} 
            />
            <Text style={[styles.toolLabel, annotations.length === 0 && styles.disabledLabel]}>
              Undo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolButton, styles.actionButton]}
            onPress={clearAllAnnotations}
            disabled={annotations.length === 0}
          >
            <Ionicons 
              name="trash" 
              size={24} 
              color={annotations.length === 0 ? '#666' : '#FF6B6B'} 
            />
            <Text style={[styles.toolLabel, { color: annotations.length === 0 ? '#666' : '#FF6B6B' }]}>
              Clear
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolButton, styles.actionButton]}
            onPress={saveAnnotations}
            disabled={!hasChanges}
          >
            <Ionicons 
              name="save" 
              size={24} 
              color={!hasChanges ? '#666' : '#4CAF50'} 
            />
            <Text style={[styles.toolLabel, { color: !hasChanges ? '#666' : '#4CAF50' }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
        </Text>
        {selectedTool && (
          <Text style={styles.statusText}>
            {selectedTool.toUpperCase()} selected • Tap to draw or add text
          </Text>
        )}
        {hasChanges && (
          <View style={styles.unsavedIndicator}>
            <Ionicons name="ellipse" size={8} color="#FF6B6B" />
            <Text style={styles.unsavedText}>Unsaved</Text>
          </View>
        )}
      </View>

      {/* Text Input Modal */}
      <Modal
        visible={showTextModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTextModal(false)}
      >
        <View style={styles.textModalOverlay}>
          <View style={styles.textModalContainer}>
            <Text style={styles.textModalTitle}>Add Text Annotation</Text>
            <TextInput
              style={styles.textInput}
              value={textAnnotation}
              onChangeText={setTextAnnotation}
              placeholder="Enter your annotation..."
              placeholderTextColor="#999"
              multiline={true}
              maxLength={100}
              autoFocus={true}
            />
            <Text style={styles.characterCount}>
              {textAnnotation.length}/100
            </Text>
            <View style={styles.textModalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowTextModal(false);
                  setTextAnnotation('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addTextAnnotation}
                disabled={!textAnnotation.trim()}
              >
                <Text style={[
                  styles.addButtonText, 
                  !textAnnotation.trim() && styles.disabledButtonText
                ]}>
                  Add Text
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveHeaderButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: '100%',
  },
  savedAnnotationsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  toolPalette: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  toolButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 70,
    backgroundColor: 'transparent',
  },
  selectedTool: {
    backgroundColor: '#FFD700',
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  toolLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  selectedToolLabel: {
    color: '#000',
  },
  disabledLabel: {
    color: '#666',
  },
  statusBar: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    color: '#ccc',
    fontSize: 12,
  },
  unsavedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unsavedText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginLeft: 4,
  },
  textModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textModalContainer: {
    backgroundColor: '#2a2a2a',
    padding: 24,
    borderRadius: 16,
    width: width * 0.85,
    maxWidth: 400,
  },
  textModalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#3a3a3a',
    color: 'white',
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  characterCount: {
    color: '#999',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 16,
  },
  textModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default VideoAnnotationScreen;