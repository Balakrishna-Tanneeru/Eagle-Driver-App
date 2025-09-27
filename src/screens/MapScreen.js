// src/screens/MapScreen.js (only the location update parts shown)
import * as Location from 'expo-location';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function MapScreen({ route }) {
  const [region, setRegion] = useState(null);
  const { updateLocation } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const locationIntervalRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission not granted');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const { latitude, longitude } = loc.coords;
      setRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });

      // send initial location
      try {
        await api.put('/driver/auth/location', { latitude, longitude });
      } catch (e) {
        console.warn('initial location update failed', e.message);
      }

      // start periodic update (every 8 seconds as example)
      locationIntervalRef.current = setInterval(async () => {
        try {
          const curr = await Location.getCurrentPositionAsync({});
          const payload = {
            latitude: curr.coords.latitude,
            longitude: curr.coords.longitude,
            speed: curr.coords.speed,
            heading: curr.coords.heading
          };
          // Use AuthContext helper or direct api call:
          await api.put('/driver/auth/location', payload);
        } catch (err) {
          console.warn('periodic location update err', err.message);
        }
      }, 8000);
    })();

    return () => {
      if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
    };
  }, []);

  if (!region) return <View style={styles.center}><Text>{error || 'Loading map...'}</Text></View>;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="You" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
