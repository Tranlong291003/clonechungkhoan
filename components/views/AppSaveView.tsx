import { IS_ANDROID } from "@/constants/constants";
import { AppColors } from "@/styles/Colors";
import { FC, ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Platform, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

interface AppSaveViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

const AppSaveView: FC<AppSaveViewProps> = ({ children, style }) => {
  const insets = useSafeAreaInsets();

  // Android giữ nguyên như cũ, chỉ chỉnh iOS
  if (Platform.OS === "android") {
    return (
      <View style={styles.safeArea}>
        <View style={[styles.container, style]}>{children}</View>
      </View>
    );
  }

  // Chỉ chỉnh iOS - bỏ qua bottom inset
  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          // Bỏ qua bottom inset trên iOS để Footer nằm sát với nội dung
          paddingBottom: 0,
        },
      ]}
    >
      <View style={[styles.container, style]}>{children}</View>
    </View>
  );
};

export default AppSaveView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
    // Android giữ nguyên paddingTop cho StatusBar
    paddingTop: IS_ANDROID ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});
