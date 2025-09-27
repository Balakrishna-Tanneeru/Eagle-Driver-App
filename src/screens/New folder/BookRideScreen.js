import * as Location from 'expo-location';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import API from '../api/client';
import { AuthContext } from '../context/AuthContext';

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // 🔁 Replace this with your actual Google API key

const BookRideScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [fare, setFare] = useState('');

  const dropRef = useRef();

  // Autofill current location on mount
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Allow location access for pickup autofill');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode?.length) {
          const place = geocode[0];
          const address = `${place.name}, ${place.street}, ${place.city}`;
          setPickup(address);
        }
      } catch (err) {
        console.error('Location fetch error:', err);
        Alert.alert('Error', 'Failed to fetch location');
      }
    })();
  }, []);

  const handleBook = async () => {
    const trimmedPickup = pickup.trim();
    const trimmedDrop = drop.trim();
    const numericFare = parseFloat(fare);

    if (!trimmedPickup || !trimmedDrop || !numericFare) {
      Alert.alert('Validation Error', 'All fields are required and fare must be numeric');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const res = await API.post('/ride/book', {
        riderId: user.id,
        pickup: { name: trimmedPickup },
        drop: { name: trimmedDrop },
        fare: numericFare,
      });
      Alert.alert('✅ Ride booked successfully');
      navigation.navigate('RiderDashboard');
    } catch (err) {
      console.error('Booking error:', err);
      Alert.alert('❌ Booking Failed', err?.response?.data?.error || err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <Text style={styles.label}>Pickup Location (auto-filled):</Text>
      <TextInput
        placeholder="Pickup Location"
        value={pickup}
        onChangeText={setPickup}
        style={styles.input}
      />

      <Text style={styles.label}>Drop Location:</Text>
      <GooglePlacesAutocomplete
        ref={dropRef}
        placeholder="Enter Drop Location"
        fetchDetails={true}
        onPress={(data, details = null) => {
          const address = details?.formatted_address || data.description;
          setDrop(address);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en',
        }}
        styles={{
          textInput: styles.input,
          container: { flex: 0 },
          listView: { maxHeight: 150 },
        }}
        enablePoweredByContainer={false}
      />

      <Text style={styles.label}>Fare:</Text>
      <TextInput
        placeholder="Fare"
        keyboardType="numeric"
        value={fare}
        onChangeText={setFare}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Book Ride" onPress={handleBook} color="#007bff" />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#999',
    marginBottom: 15,
    fontSize: 16,
    paddingVertical: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default BookRideScreen;
