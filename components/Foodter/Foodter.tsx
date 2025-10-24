import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import React from "react";
import { StyleSheet, View } from "react-native";
import { s } from "react-native-size-matters";
import AppText from "../Text/AppText";

const Foodter = () => {
  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>
        <View style={styles.yahooContainer}>
          <AppText style={styles.yahooText} variant="caption">
            Yahoo!
          </AppText>
          <AppText variant="caption">Finance</AppText>
        </View>
        <AppText variant="caption">Thị trường đã đóng</AppText>
      </View>
    </View>
  );
};

export default Foodter;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sharedPaddingHorizontal,
    height: s(60),
    backgroundColor: AppColors.secondaryBackground,
    justifyContent: "center",
    paddingBottom: s(20),
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yahooContainer: {
    flexDirection: "row",
  },
  yahooText: {
    fontWeight: "700",
  },
});
