// screens/PaymentScreen.js
import { Button, StyleSheet, Text, View } from 'react-native';

const PaymentScreen = ({ navigation, route }) => {
  const { origin = 'Not provided', destination = 'Not provided', fare = 0 } = route.params || {};

  const handlePayment = () => {
    // TODO: Integrate payment gateway here
    navigation.navigate('PaymentSuccess', {
      origin,
      destination,
      fare
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Payment</Text>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.text}>{origin}</Text>

        <Text style={styles.label}>To:</Text>
        <Text style={styles.text}>{destination}</Text>

        <Text style={styles.label}>Fare:</Text>
        <Text style={styles.text}>₹{Number(fare) || 0}</Text>
      </View>

      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
