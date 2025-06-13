import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Header from "@/screens/Students_Home_Screen/Header_1";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  type: 'session' | 'match' | 'workshop' | 'meeting';
}

const CalendarScreen = () => {
  const params = useLocalSearchParams();
  const [events, setEvents] = useState<Event[]>(params.events ? JSON.parse(params.events as string) : []);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'session': return '#4e73df';
      case 'match': return '#e74a3b';
      case 'workshop': return '#f6c23e';
      case 'meeting': return '#36b9cc';
      default: return '#858796';
    }
  };

  return (
    <View style={styles.container}>
         <Header title="Event Calendar" /> 
      
      <ScrollView style={styles.eventList}>
        {events.map(event => (
          <TouchableOpacity 
            key={event.id} 
            style={[styles.eventCard, { borderLeftColor: getEventColor(event.type) }]}
            onPress={() => setSelectedEvent(event)}
          >
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </Text>
            <Feather name="chevron-right" size={20} color="#999" style={styles.eventArrow} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedEvent && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={[styles.eventTypeIndicator, { backgroundColor: getEventColor(selectedEvent.type) }]} />
            <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
            <Text style={styles.modalText}>
              <Text style={styles.modalLabel}>Date: </Text>
              {new Date(selectedEvent.date).toLocaleDateString()}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.modalLabel}>Time: </Text>
              {selectedEvent.time}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.modalLabel}>Type: </Text>
              {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
            </Text>
            {selectedEvent.description && (
              <Text style={styles.modalDescription}>
                <Text style={styles.modalLabel}>Description: </Text>
                {selectedEvent.description}
              </Text>
            )}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedEvent(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  eventList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop:10,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  eventArrow: {
    position: 'absolute',
    right: 16,
    top: '60%',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
  },
  eventTypeIndicator: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4e73df',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalDescription: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4e73df',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CalendarScreen;