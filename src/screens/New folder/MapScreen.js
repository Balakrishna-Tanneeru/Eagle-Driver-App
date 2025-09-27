// src/screens/MapScreen.js
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { AnimatedRegion, Marker, Polyline } from 'react-native-maps';

import { AuthContext } from '../context/AuthContext';
import { bookRide as bookRideAPI } from '../services/rideService';

// TODO: Replace with environment variable in production
const GOOGLE_API_KEY = 'AIzaSyDP4l2DazPca6qzyweJmb9z1rLo2Sfmj-o';

const haversine = (start, end) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371e3;

  const φ1 = toRad(start.latitude);
  const φ2 = toRad(end.latitude);
  const Δφ = toRad(end.latitude - start.latitude);
  const Δλ = toRad(end.longitude - start.longitude);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [dropAddress, setDropAddress] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [fare, setFare] = useState(0);
  const [driverMarkers, setDriverMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const coord = { latitude, longitude };
      setLocation(coord);
      setRegion({ ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 });

      const addresses = await Location.reverseGeocodeAsync(coord);
      if (addresses?.length > 0) {
        const a = addresses[0];
        const fullAddress = `${a.name || ''}, ${a.street || ''}, ${a.city || ''}, ${a.postalCode || ''}`;
        setPickupAddress(fullAddress);
      }

      const initialDrivers = [
        { latitude: coord.latitude + 0.001, longitude: coord.longitude + 0.001 },
        { latitude: coord.latitude - 0.001, longitude: coord.longitude - 0.001 },
      ];

      setDriverMarkers(initialDrivers.map((pos) => ({
        coordinate: new AnimatedRegion({
          latitude: pos.latitude,
          longitude: pos.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }),
      })));
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      driverMarkers.forEach((driver) => {
        const newLat = driver.coordinate.__getValue().latitude + (Math.random() - 0.5) / 1000;
        const newLng = driver.coordinate.__getValue().longitude + (Math.random() - 0.5) / 1000;

        driver.coordinate.timing({
          latitude: newLat,
          longitude: newLng,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [driverMarkers]);

  const handleDestinationSelect = (data, details) => {
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    const dest = { latitude: lat, longitude: lng };
    setDestinationCoords(dest);
    setDropAddress(details.formatted_address);

    if (location) {
      const distMeters = haversine(location, dest);
      const distKm = (distMeters / 1000).toFixed(2);
      const timeMinutes = ((distKm / 25) * 60).toFixed(0);
      const estFare = (20 + distKm * 10).toFixed(0);

      setDistance(distKm);
      setTime(timeMinutes);
      setFare(estFare);
    }
  };

  const handleBookRide = async () => {
    if (!destinationCoords || !location || !user?.id) {
      Alert.alert('Missing Info', 'Ensure you are logged in and locations are selected.');
      return;
    }

    const payload = {
      userId: user.id,
      pickup: {
        lat: location.latitude,
        lng: location.longitude,
        address: pickupAddress || 'Current Location',
      },
      drop: {
        lat: destinationCoords.latitude,
        lng: destinationCoords.longitude,
        address: dropAddress,
      },
      fare: parseFloat(fare),
      distance: parseFloat(distance),
      time: parseInt(time),
    };

    try {
      const ride = await bookRideAPI(payload);
      navigation.navigate('PaymentSuccessScreen', { ride });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to book ride');
    }
  };

  if (!region) {
    return (
      <View style={styles.centered}>
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
      >
        {location && <Marker coordinate={location} title="You are here" />}
        {destinationCoords && <Marker coordinate={destinationCoords} title="Drop Location" pinColor="blue" />}
        {destinationCoords && (
          <Polyline
            coordinates={[location, destinationCoords]}
            strokeColor="#1E90FF"
            strokeWidth={4}
          />
        )}
        {driverMarkers.map((driver, index) => (
          <Marker.Animated
            key={index}
            coordinate={driver.coordinate}
            title={`Driver ${index + 1}`}
            image={require('../../assets/driver_icon.png')}
          />
        ))}
      </MapView>

      <View style={styles.controls}>
        <Text style={styles.pickup}>📍 Pickup: {pickupAddress || 'Loading...'}</Text>

        <GooglePlacesAutocomplete
          placeholder="Enter drop location"
          fetchDetails
          onPress={handleDestinationSelect}
          query={{ key: GOOGLE_API_KEY, language: 'en' }}
          styles={{
            textInput: styles.input,
            container: { flex: 0 },
          }}
        />

        <Text style={styles.info}>
          📏 {distance} km   ⏱ {time} mins   💰 ₹{fare}
        </Text>

        <Button title="Book Ride" onPress={handleBookRide} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 30,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  info: {
    marginBottom: 10,
    textAlign: 'center',
  },
  pickup: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
