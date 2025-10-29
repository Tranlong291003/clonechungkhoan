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
      <View>
        <AppText variant="titleLarge">Chứng khoán</AppText>
        <AppText
          style={{ color: AppColors.secondaryText }}
          variant="titleLarge"
        >
          {formatNgayThang(new Date())}
        </AppText>
      </View>
      <CustomMoreMenu
        items={menuItems}
        backgroundColor={AppColors.secondaryBackground}
      />
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
});
export default memo(Header);
