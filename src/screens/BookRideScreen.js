// BookRideScreen.js
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { requestRide } from '../api/ride';
import createRideRequestDTO from '../utils/RideRequestDTO';

const GOOGLE_API_KEY = 'AIzaSyDP4l2DazPca6qzyweJmb9z1rLo2Sfmj-o';

const BookRideScreen = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [initialRegion, setInitialRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropQuery, setDropQuery] = useState('');
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = parseFloat(location.coords.latitude);
      const lng = parseFloat(location.coords.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        Alert.alert('Invalid Coordinates', 'Could not get current location');
        return;
      }

      const region = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setPickupLocation({ latitude: lat, longitude: lng });
      reverseGeocode(lat, lng, true);
      setInitialRegion(region);
      setLoading(false);
    })();
  }, []);

  const reverseGeocode = async (lat, lng, isPickup) => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      console.warn('[reverseGeocode] Skipped due to invalid coordinates:', { lat, lng });
      return;
    }

    try {
      setIsGeocoding(true);
      const coords = { latitude: parsedLat, longitude: parsedLng };
      const addresses = await Location.reverseGeocodeAsync(coords);

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        const fullAddress = [
          address.name,
          address.street,
          address.subregion,
          address.region,
          address.postalCode,
          address.country,
        ].filter(Boolean).join(', ');

        isPickup ? setPickupAddress(fullAddress) : setDropAddress(fullAddress);
      } else {
        isPickup ? setPickupAddress('Unknown Pickup') : setDropAddress('Unknown Drop');
      }
    } catch (error) {
      console.error('[reverseGeocode] Failed:', error);
      isPickup ? setPickupAddress('Unknown Pickup') : setDropAddress('Unknown Drop');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Invalid Coordinates', 'Map tap returned invalid location');
      return;
    }

    if (!pickupLocation) {
      setPickupLocation({ latitude: lat, longitude: lng });
      reverseGeocode(lat, lng, true);
      Alert.alert('Pickup location set');
    } else if (!dropLocation) {
      setDropLocation({ latitude: lat, longitude: lng });
      reverseGeocode(lat, lng, false);
      Alert.alert('Drop location set');
    } else {
      setPickupLocation({ latitude: lat, longitude: lng });
      setDropLocation(null);
      reverseGeocode(lat, lng, true);
      setDropAddress('');
      Alert.alert('Resetting locations. Tap again to set drop.');
    }
  };

  const handleBookRide = async () => {
    if (!pickupLocation || !dropLocation || !pickupAddress || !dropAddress) {
      Alert.alert('Please set pickup and drop locations with valid addresses.');
      return;
    }

    const distance = getDistanceFromLatLonInKm(
      pickupLocation.latitude,
      pickupLocation.longitude,
      dropLocation.latitude,
      dropLocation.longitude
    ).toFixed(2);

    const fare = calculateFare(distance);

    const rideRequest = {
      ...createRideRequestDTO({
        pickupLat: pickupLocation.latitude,
        pickupLng: pickupLocation.longitude,
        pickupAddress,
        dropAddress,
        distance,
        fare,
      }),
      dropLat: dropLocation.latitude,
      dropLng: dropLocation.longitude,
    };

    try {
      const response = await requestRide(rideRequest);
      console.log('[requestRide] Response:', response);

      if (response.rideId) {
        navigation.navigate('RideSuccess', {
          rideId: response.rideId,
          driverName: response.driverName,
          driverPhone: response.driverPhone,
          pickupLat: pickupLocation.latitude,
          pickupLng: pickupLocation.longitude,
          dropLat: dropLocation.latitude,
          dropLng: dropLocation.longitude,
        });

        setPickupLocation(null);
        setDropLocation(null);
        setPickupAddress('');
        setDropAddress('');
        setDropQuery('');
        setDropSuggestions([]);
      } else {
        Alert.alert('Ride Booking Failed', response.message || 'Try again');
      }
    } catch (error) {
      console.error('[requestRide] Error:', error);
      Alert.alert('Booking Failed', 'Please check your network and try again.');
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateFare = (distanceInKm) => {
    const baseFare = 20;
    const perKmRate = 10;
    return Math.round(baseFare + distanceInKm * perKmRate);
  };

  const fetchPlaceSuggestions = async (inputText) => {
    setDropQuery(inputText);
    if (inputText.length < 3) {
      setDropSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputText}&key=${GOOGLE_API_KEY}&components=country:in`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        setDropSuggestions(data.predictions);
      } else {
        console.warn('Place autocomplete failed:', data.status);
        setDropSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching place autocomplete:', error);
    }
  };

  const handleSuggestionPress = async (placeId, description) => {
    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
      const res = await fetch(detailsUrl);
      const details = await res.json();
      const { lat, lng } = details.result.geometry.location;
      setDropLocation({ latitude: lat, longitude: lng });
      setDropAddress(description);
      setDropQuery(description);
      setDropSuggestions([]);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  if (loading || !initialRegion) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        {pickupLocation && (
          <Marker coordinate={pickupLocation} pinColor="green" title="Pickup" />
        )}
        {dropLocation && (
          <Marker coordinate={dropLocation} pinColor="red" title="Drop" />
        )}
      </MapView>

      <View style={styles.infoPanel}>
        <Text style={styles.addressLabel}>Pickup:</Text>
        <Text style={styles.addressValue}>{pickupAddress || 'Not set'}</Text>

        <Text style={styles.addressLabel}>Drop:</Text>
        <TextInput
          style={styles.input}
          value={dropQuery}
          onChangeText={fetchPlaceSuggestions}
          placeholder="Search drop location"
        />
        {dropSuggestions.length > 0 && (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={dropSuggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item.place_id, item.description)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {dropAddress ? (
          <Text style={styles.addressValue}>Selected: {dropAddress}</Text>
        ) : null}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isGeocoding ? 'Resolving Address...' : 'Book Ride'}
          onPress={handleBookRide}
          disabled={
            !pickupLocation ||
            !dropLocation ||
            !pickupAddress ||
            !dropAddress ||
            isGeocoding
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default BookRideScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 250,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPanel: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  addressLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  addressValue: {
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  suggestionItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
