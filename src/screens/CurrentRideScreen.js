/* ---------------------------------
   screens/CurrentRideScreen.js
   ---------------------------------*/
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import client from '../api/client';

const CurrentRideScreen = ({ route, navigation }) => {
  const { rideId } = route.params || {};
  const [ride, setRide] = useState(null);

  const loadRide = async () => {
    try {
      const res = await client.get(`/driver/rides/${rideId}`);
      setRide(res.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not load ride details');
    }
  };

  useEffect(() => {
    loadRide();
  }, []);

  const updateStatus = async (status) => {
    try {
      await client.post(`/driver/rides/${rideId}/status`, { status });
      Alert.alert('Success', `Status updated to ${status}`);
      loadRide();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not update status');
    }
  };

  if (!ride) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading ride...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride #{ride.id}</Text>
      <Text>Pickup: {ride.pickupAddress}</Text>
      <Text>Drop: {ride.dropAddress}</Text>
      <Text>Passenger: {ride.riderName}</Text>
      <Text>Status: {ride.status}</Text>

      <View style={{ height: 18 }} />
      <TouchableOpacity style={styles.btn} onPress={() => updateStatus('arrived')}>
        <Text style={styles.btnText}>Mark Arrived</Text>
      </TouchableOpacity>
      <View style={{ height: 8 }} />
      <TouchableOpacity style={styles.btn} onPress={() => updateStatus('picked_up')}>
        <Text style={styles.btnText}>Mark Picked Up</Text>
      </TouchableOpacity>
      <View style={{ height: 8 }} />
      <TouchableOpacity style={[styles.btn, { backgroundColor: '#34C759' }]} onPress={() => updateStatus('completed')}>
        <Text style={styles.btnText}>Complete Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  btn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});

export default CurrentRideScreen;