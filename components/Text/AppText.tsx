import { AppColors } from "@/styles/Colors";
import React, { FC } from "react";
import { StyleSheet, TextProps, TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { s } from "react-native-size-matters";

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  variant?: "display" | "titleLarge" | "titleMedium" | "body" | "caption";
}

const AppText: FC<AppTextProps> = ({
  children,
  style,
  variant = "body",
  ...rest
}) => {
  return (
    <Text {...rest} style={[styles[variant], style]}>
      {children}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  display: {
    fontSize: s(34),
    fontWeight: "900",
    letterSpacing: -1,
    color: AppColors.primaryText,
  },
  titleLarge: {
    fontSize: s(28),
    fontWeight: "800",
    letterSpacing: -0.6,
    color: AppColors.primaryText,
  },
  titleMedium: {
    fontSize: s(16),
    fontWeight: "700",
    letterSpacing: -0.2,
    color: AppColors.primaryText,
  },
  body: {
    fontSize: s(13),
    fontWeight: "600",
    color: AppColors.primaryText,
  },
  caption: {
    fontSize: s(11),
    color: AppColors.secondaryText,
    fontWeight: "600",
  },
});
