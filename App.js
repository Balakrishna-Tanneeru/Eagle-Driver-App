import { DriverProvider } from "./src/context/DriverContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <DriverProvider>
      <AppNavigator />
    </DriverProvider>
  );
}
