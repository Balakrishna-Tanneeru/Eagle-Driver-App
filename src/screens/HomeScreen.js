/* ---------------------------------
   screens/HomeScreen.js
   ---------------------------------*/
import { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRides = async () => {
    try {
      const res = await client.get('/driver/rides');
      setRides(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRides();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.name || 'Driver'}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
          <Text style={{ color: '#007AFF' }}>Profile</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rides}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={{ padding: 20 }}>
            <Text>No rides yet. Pull to refresh.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.rideCard}
            onPress={() => navigation.navigate('CurrentRide', { rideId: item.id })}
          >
            <Text style={{ fontWeight: '700' }}>{item.pickupAddress} → {item.dropAddress}</Text>
            <Text>Passenger: {item.riderName || '—'}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={{ color: '#fff' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcome: { fontSize: 18, fontWeight: '600' },
  profileBtn: { padding: 8 },
  rideCard: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  logout: { position: 'absolute', right: 16, bottom: 30, backgroundColor: '#ff3b30', padding: 12, borderRadius: 24 },
});

export default HomeScreen;
