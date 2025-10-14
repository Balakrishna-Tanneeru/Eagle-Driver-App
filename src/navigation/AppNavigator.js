import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { DriverContext } from "../context/DriverContext";
import { log } from "../utils/logger";

// Auth Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// Driver Screens
import DashboardScreen from "../screens/DashboardScreen";
import PendingRidesScreen from "../screens/PendingRidesScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Extra Screens
import DriverRideScreen from "../screens/DriverRideScreen";
import MapScreen from "../screens/MapScreen";
import OngoingRideScreen from "../screens/OngoingRideScreen";
import RideDetailsScreen from "../screens/RideDetailsScreen";
import RideSuccessScreen from "../screens/RideSuccessScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DriverTabs() {
  log("🔄 Rendering DriverTabs");

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        let iconName;
        if (route.name === "Dashboard") iconName = "home";
        else if (route.name === "Rides") iconName = "car";
        else if (route.name === "Profile") iconName = "person";

        log(`🛠 Tab icon → ${route.name}`);

        return {
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
        };
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Rides" component={PendingRidesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { token, loading } = useContext(DriverContext);

  useEffect(() => {
    log("📡 AppNavigator mounted", { token, loading });
  }, [token, loading]);

  if (loading) {
    log("⏳ Still loading, showing spinner");
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  log("✅ Navigation flow decided");

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <>
            {log("🔒 No token → Auth flow")}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {log("🔑 Token exists → Driver flow")}
            <Stack.Screen name="DriverTabs" component={DriverTabs} />
            <Stack.Screen
              name="RideDetails"
              component={RideDetailsScreen}
              options={{ headerShown: true, title: "Ride Details" }}
            />
            <Stack.Screen
              name="OngoingRide"
              component={OngoingRideScreen}
              options={{ headerShown: true, title: "Ongoing Ride" }}
            />
            <Stack.Screen
              name="DriverRide"
              component={DriverRideScreen}
              options={{ headerShown: true, title: "Manage Ride" }}
            />
            <Stack.Screen
              name="RideSuccess"
              component={RideSuccessScreen}
              options={{ headerShown: true, title: "Ride Completed" }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ headerShown: true, title: "Map" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
