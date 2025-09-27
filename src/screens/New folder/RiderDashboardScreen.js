import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import API from '../api/client';
import { AuthContext } from '../context/AuthContext';

const RiderDashboardScreen = () => {
  const { user } = useContext(AuthContext);
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        if (!user?.id) {
          console.warn('User not logged in');
          return;
        }

        const res = await API.get(`/ride/history/${user.id}`);
        const data = res.data?.rides || [];

        setRideHistory(data); // ensure it's an array
      } catch (error) {
        console.error('Failed to fetch ride history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.rideItem}>
      <Text style={styles.rideText}>Pickup: {item.pickup?.name || 'N/A'}</Text>
      <Text style={styles.rideText}>Drop: {item.drop?.name || 'N/A'}</Text>
      <Text style={styles.rideText}>Fare: ₹{item.fare}</Text>
      <Text style={styles.rideText}>Status: {item.status}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {user?.name || 'Rider'}</Text>
      <Text style={styles.subheading}>Your Ride History</Text>
      <FlatList
        data={Array.isArray(rideHistory) ? rideHistory : []}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No rides found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 15,
  },
  rideItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  rideText: {
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RiderDashboardScreen;
