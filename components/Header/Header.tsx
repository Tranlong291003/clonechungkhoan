import { formatNgayThang } from "@/helpers/date";
import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import React, { memo } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { s } from "react-native-size-matters";
import CustomMoreMenu, { MenuItemType } from "../MoreMenu/CustomMoreMenu";
import AppText from "../Text/AppText";

const Header = () => {
  const menuItems: MenuItemType[] = [
    {
      key: "settings",
      label: "Cài đặt",
      icon: "settings-outline",
      onPress: () => Alert.alert("Cài đặt", "Chức năng đang phát triển"),
    },
    {
      key: "notifications",
      label: "Thông báo",
      icon: "notifications-outline",
      onPress: () => Alert.alert("Thông báo", "Chức năng đang phát triển"),
    },
    {
      key: "help",
      label: "Trợ giúp",
      icon: "help-circle-outline",
      onPress: () => Alert.alert("Trợ giúp", "Chức năng đang phát triển"),
    },
    {
      key: "about",
      label: "Về chúng tôi",
      icon: "information-circle-outline",
      onPress: () => Alert.alert("Về chúng tôi", "App Chứng khoán v1.0"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <View style={styles.marketBadge}>
          <View style={styles.liveDot} />
          <AppText style={styles.badgeText} variant="caption">
            Watchlist trực tiếp
          </AppText>
        </View>
        <AppText variant="display">Chứng khoán</AppText>
        <AppText style={styles.dateText} variant="caption">
          {formatNgayThang(new Date())}
        </AppText>
      </View>
      <CustomMoreMenu
        items={menuItems}
        backgroundColor={AppColors.cardBackgroundSoft}
        iconColor={AppColors.iconAccent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: s(8),
    paddingBottom: s(18),
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleGroup: {
    gap: s(5),
  },
  marketBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: s(6),
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    borderRadius: 999,
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.18)",
  },
  liveDot: {
    width: s(6),
    height: s(6),
    borderRadius: 999,
    backgroundColor: AppColors.positiveGreen,
  },
  badgeText: {
    color: AppColors.accentBlue,
  },
  dateText: {
    color: AppColors.secondaryText,
  },
});
export default memo(Header);
