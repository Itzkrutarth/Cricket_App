import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from './Header_1';
import { styles } from '@/styles/addStudentStyle';

type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  experience: string;
  birthDate: string;
  gender: string;
  photoUrl: string;
};

const initialFormData: StudentFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  role: '',
  experience: '',
  birthDate: '',
  gender: '',
  photoUrl: '',
};

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const roleOptions = [
  { label: 'Batsman', value: 'batsman' },
  { label: 'Bowler', value: 'bowler' },
  { label: 'All-rounder', value: 'all-rounder' },
  { label: 'Wicket Keeper', value: 'wicket-keeper' },
];

export default function AddStudent() {
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Dropdown state
  const [genderOpen, setGenderOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const updateField = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return false;
    }
    if (!formData.gender) {
      Alert.alert('Error', 'Please select a gender');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const randomPhotoId = Math.floor(Math.random() * 1000);
      const photoUrl = `https://picsum.photos/300/300?${randomPhotoId}`;
      const newStudent = {
        ...formData,
        photoUrl,
        name: `${formData.firstName} ${formData.lastName}`,
      };
      Alert.alert('Success', 'Student added successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateConfirm = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    updateField('birthDate', formattedDate);
    setShowDatePicker(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Header title="Add New Student" />

        <KeyboardAwareScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}
        >
          <View style={styles.form}>
            {/* First and Last Name */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(text) => updateField('firstName', text)}
                  placeholder="Enter first name"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(text) => updateField('lastName', text)}
                  placeholder="Enter last name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                placeholder="Enter email address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone Number */}
            <View style={styles.field}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) => updateField('phoneNumber', text)}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            {/* Address */}
            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={formData.address}
                onChangeText={(text) => updateField('address', text)}
                placeholder="Enter address"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Birth Date */}
            <View style={styles.field}>
              <Text style={styles.label}>Birth Date</Text>
              <TouchableOpacity
                style={styles.pickerInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.pickerText, !formData.birthDate && styles.placeholderText]}>
                  {formData.birthDate || 'Select birth date'}
                </Text>
                <Feather name="calendar" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Gender */}
            <View style={styles.field}>
              <Text style={styles.label}>Gender *</Text>
              <DropDownPicker
                open={genderOpen}
                setOpen={setGenderOpen}
                value={formData.gender}
                setValue={(callback) => {
                  const value = callback(formData.gender);
                  updateField('gender', value);
                }}
                items={genderOptions}
                placeholder="Select Gender"
                listMode="SCROLLVIEW"
                style={{
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  marginBottom: 12,
                }}
                dropDownContainerStyle={{
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 8,
                }}
                textStyle={{
                  color: '#333',
                  fontSize: 14,
                }}
                placeholderStyle={{
                  color: '#999',
                }}
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>

            {/* Role */}
            <View style={styles.field}>
              <Text style={styles.label}>Role in Cricket</Text>
              <DropDownPicker
                open={roleOpen}
                setOpen={setRoleOpen}
                value={formData.role}
                setValue={(callback) => {
                  const value = callback(formData.role);
                  updateField('role', value);
                }}
                items={roleOptions}
                placeholder="Select Role"
                listMode="SCROLLVIEW"
                style={{
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  marginBottom: 12,
                }}
                dropDownContainerStyle={{
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 8,
                }}
                textStyle={{
                  color: '#333',
                  fontSize: 14,
                }}
                placeholderStyle={{
                  color: '#999',
                }}
                zIndex={2000}
                zIndexInverse={1000}
              />
            </View>

            {/* Experience */}
            <View style={styles.field}>
              <Text style={styles.label}>Cricket Experience</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={formData.experience}
                onChangeText={(text) => updateField('experience', text)}
                placeholder="Describe cricket experience, achievements, etc."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Feather name="check" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>{loading ? 'Adding...' : 'Add Student'}</Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setShowDatePicker(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
