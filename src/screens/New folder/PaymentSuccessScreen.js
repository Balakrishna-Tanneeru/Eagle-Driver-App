// screens/PaymentSuccessScreen.js
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, StyleSheet, Text, View } from 'react-native';

const PaymentSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const ride = route.params?.ride;

  const handleDone = () => {
    navigation.navigate('Map');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Payment Successful!</Text>
      <Text style={styles.subtitle}>Your ride is confirmed.</Text>

      {ride ? (
        <View style={styles.rideDetails}>
          <Text>📍 Pickup: {ride.pickup?.address || 'N/A'}</Text>
          <Text>📌 Drop: {ride.drop?.address || 'N/A'}</Text>
          <Text>🛣 Distance: {ride.distance ?? 'N/A'} km</Text>
          <Text>⏱ Time: {ride.time ?? 'N/A'} mins</Text>
          <Text>💰 Fare: ₹{ride.fare ?? 'N/A'}</Text>
        </View>
      ) : (
        <Text style={styles.missingText}>No ride details available.</Text>
      )}

      <Button title="Done" onPress={handleDone} accessibilityLabel="Go back to map screen" />
    </View>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f9ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#0f5132',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#155724',
  },
  rideDetails: {
    marginBottom: 30,
    backgroundColor: '#e9f7ef',
    padding: 15,
    borderRadius: 10,
  },
  missingText: {
    textAlign: 'center',
    color: '#6c757d',
    marginBottom: 30,
  },
});
