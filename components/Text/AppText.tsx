import { AppColors } from "@/styles/Colors";
import React, { FC } from "react";
import { StyleSheet, TextProps, TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { s } from "react-native-size-matters";

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  variant?: "titleLarge" | "titleMedium" | "body" | "caption";
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
  titleLarge: {
    fontSize: s(22), // Tiêu đề chính (VD: "Chứng khoán")
    fontWeight: "700",
    color: AppColors.primaryText,
  },
  titleMedium: {
    fontSize: s(18), // Tiêu đề phụ, mục nhóm (VD: "Mã chứng khoán của tôi")
    fontWeight: "600",
    color: AppColors.primaryText,
  },
  body: {
    fontSize: s(15), // Dòng nội dung chính (VD: giá, tên mã, công ty)
    color: AppColors.primaryText,
  },
  caption: {
    fontSize: s(13), // Text phụ, chú thích nhỏ (VD: “Thị trường đã đóng”)
    color: AppColors.secondaryText,
  },
});
