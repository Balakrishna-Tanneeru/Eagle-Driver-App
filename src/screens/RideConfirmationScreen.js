// screens/RideConfirmationScreen.js
import axios from 'axios';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

const RideConfirmationScreen = ({ route, navigation }) => {
  const { pickup, drop, distance, time, fare } = route.params || {};

  const handleProceedToPayment = async () => {
    try {
      await axios.post('https://jsonplaceholder.typicode.com/posts', {
        userId: 1,
        pickup,
        drop,
        distance,
        time,
        fare,
        status: 'pending',
      });

      navigation.navigate('Payment', {
        origin: pickup,
        destination: drop,
        fare,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to store ride data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Ride</Text>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Pickup:</Text>
        <Text style={styles.value}>{pickup || 'N/A'}</Text>

        <Text style={styles.label}>Drop:</Text>
        <Text style={styles.value}>{drop || 'N/A'}</Text>

        <Text style={styles.label}>Distance:</Text>
        <Text style={styles.value}>{distance ?? 'N/A'} km</Text>

        <Text style={styles.label}>Estimated Time:</Text>
        <Text style={styles.value}>{time ?? 'N/A'} mins</Text>

        <Text style={styles.label}>Fare:</Text>
        <Text style={styles.value}>₹{fare ?? 'N/A'}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Proceed to Payment" onPress={handleProceedToPayment} />
      </View>
    </View>
  );
};

export default RideConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsBox: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
