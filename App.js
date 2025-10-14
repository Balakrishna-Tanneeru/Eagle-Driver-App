import { useEffect } from "react";
import { DriverProvider } from "./src/context/DriverContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    console.log("✅ App component mounted");

    return () => {
      console.log("❌ App component unmounted");
    };
  }, []);

  console.log("🔄 App rendering...");

  return (
    <DriverProvider>
      {console.log("🚀 Rendering AppNavigator inside DriverProvider")}
      <AppNavigator />
    </DriverProvider>
  );
}
