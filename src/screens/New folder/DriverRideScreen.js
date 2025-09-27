import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  acceptRide,
  cancelRideByDriver,
  completeRide,
  rejectRide,
  startRide
} from '../api/ride';

const DriverRideScreen = ({ route, navigation }) => {
  const { rideId } = route.params;

  const handleAction = async (actionFn, label) => {
    try {
      await actionFn(rideId);
      Alert.alert(`${label} Successful`, `Ride has been ${label.toLowerCase()}ed.`);
    } catch (err) {
      console.error(`${label} failed`, err);
      Alert.alert(`${label} Failed`, err?.response?.data?.error || err.message);
    }
  };

  const confirmBeforeAction = (actionFn, label, confirmMsg) => {
    Alert.alert(
      `${label} Ride`,
      confirmMsg,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => handleAction(actionFn, label),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.button}>
          <Button
            title="Accept Ride"
            onPress={() => handleAction(acceptRide, 'Accept')}
            color="#28a745"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Reject Ride"
            onPress={() =>
              confirmBeforeAction(rejectRide, 'Reject', 'Are you sure you want to reject this ride?')
            }
            color="#dc3545"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Start Ride"
            onPress={() => handleAction(startRide, 'Start')}
            color="#007bff"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Complete Ride"
            onPress={() => handleAction(completeRide, 'Complete')}
            color="#17a2b8"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Cancel Ride"
            onPress={() =>
              confirmBeforeAction(
                cancelRideByDriver,
                'Cancel',
                'Are you sure you want to cancel this ride?'
              )
            }
            color="#ffc107"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    marginVertical: 8,
  },
});

export default DriverRideScreen;
