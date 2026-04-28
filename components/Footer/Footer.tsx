import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import React from "react";
import { StyleSheet, View } from "react-native";
import { s } from "react-native-size-matters";
import AppText from "../Text/AppText";

const Footer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>
        <View style={styles.yahooContainer}>
          <AppText style={styles.yahooStrong} variant="caption">
            Yahoo!
          </AppText>
          <AppText variant="caption">Finance</AppText>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <AppText style={styles.statusText} variant="caption">
            Thị trường đã đóng
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: s(10),
    paddingBottom: s(18),
    backgroundColor: AppColors.background,
    borderTopWidth: 1,
    borderTopColor: AppColors.separator,
    justifyContent: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.cardBackground,
    borderRadius: s(18),
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: s(12),
    paddingVertical: s(10),
  },
  yahooContainer: {
    flexDirection: "row",
    gap: s(2),
  },
  yahooStrong: {
    color: AppColors.yahooFinanceText,
    fontWeight: "800",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(6),
    backgroundColor: AppColors.cardBackgroundSoft,
    borderRadius: s(999),
    paddingHorizontal: s(10),
    paddingVertical: s(6),
  },
  statusDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: AppColors.accentAmber,
  },
  statusText: {
    color: AppColors.secondaryText,
  },
});
