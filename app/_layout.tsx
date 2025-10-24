import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

import { Theme } from "@/styles/Theme";

export default function RootLayout() {
  return (
    <PaperProvider theme={Theme}>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" backgroundColor="#000000" />
      </ThemeProvider>
    </PaperProvider>
  );
}
