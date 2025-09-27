import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { getUserProfile } from '../api/user';
import { AuthContext } from '../context/AuthContext';

const RiderDashboardScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext); // 👈 Logout support

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData] = await Promise.all([
          getUserProfile(),
          // getUserRides(), // You can add this when needed
        ]);
        setProfile(profileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      {profile && (
        <View style={styles.profileContainer}>
          <Text style={styles.title}>Welcome, {profile.name}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>Phone: {profile.phone}</Text>
        </View>
      )}

      {/* Placeholder for future enhancements */}
      <View style={styles.section}>
        <Text style={styles.rideTitle}>Upcoming Features</Text>
        <Text>- View Ride History</Text>
        <Text>- Rate Drivers</Text>
        <Text>- Invite Friends</Text>
      </View>

      {/* Logout */}
      <Button title="Logout" onPress={logout} color="#d9534f" />
    </View>
  );
};

export default RiderDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  rideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
