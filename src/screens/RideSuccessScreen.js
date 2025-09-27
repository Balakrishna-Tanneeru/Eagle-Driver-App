import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function RideSuccessScreen() {
  const route = useRoute();
  const { rideId, driverName, driverPhone, pickupLat, pickupLng, dropLat, dropLng } = route.params;

  const callDriver = () => {
    Linking.openURL(`tel:${driverPhone}`);
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pickupLat,
          longitude: pickupLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: pickupLat, longitude: pickupLng }} title="Pickup" />
        <Marker coordinate={{ latitude: dropLat, longitude: dropLng }} title="Drop" />
      </MapView>

      {/* Driver Card */}
      <LinearGradient
        colors={['#ffffffdd', '#f8f9faee']}
        style={styles.card}
      >
        <View style={styles.headerRow}>
          <Ionicons name="person-circle" size={50} color="#007BFF" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.title}>{driverName}</Text>
            <Text style={styles.phone}>{driverPhone}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.callButton} onPress={callDriver} activeOpacity={0.8}>
          <Ionicons name="call" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.callButtonText}>Call Driver</Text>
        </TouchableOpacity>

        <Text style={styles.rideId}>Ride ID: #{rideId}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  card: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    width: '92%',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  title: { fontSize: 22, fontWeight: '700', color: '#222' },
  phone: { fontSize: 16, color: '#666', marginTop: 4 },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center'
  },
  callButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  rideId: {
    marginTop: 15,
    fontSize: 15,
    color: 'gray',
    textAlign: 'center'
  }
});
