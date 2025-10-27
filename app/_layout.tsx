import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

import { Theme } from "@/styles/Theme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={Theme}>
        <ThemeProvider value={DarkTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" backgroundColor="#000000" />
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
