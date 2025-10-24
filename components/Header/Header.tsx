import { formatNgayThang } from "@/helpers/date";
import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { s } from "react-native-size-matters";
import MoreMenuButton from "../MoreMenuButton";
import AppText from "../Text/AppText";

const Header = () => {
  return (
    <View style={styles.container}>
      <View>
        <AppText variant="titleLarge">Chứng khoán</AppText>
        <AppText style={styles.date} variant="titleLarge">
          {formatNgayThang(new Date())}
        </AppText>
      </View>
      <MoreMenuButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingBottom: s(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    color: AppColors.secondaryText,
  },
});
export default memo(Header);
