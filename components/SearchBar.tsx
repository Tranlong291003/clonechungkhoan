import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { s } from "react-native-size-matters";
import AppText from "./Text/AppText";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <AppText variant="titleMedium">Danh sách theo dõi</AppText>
        <View style={styles.countBadge}>
          <Ionicons name="sparkles" size={s(12)} color={AppColors.accentBlue} />
          <AppText style={styles.countText} variant="caption">
            Live
          </AppText>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm mã, công ty hoặc sàn giao dịch"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.inputStyle}
          iconColor={AppColors.secondaryText}
          placeholderTextColor={AppColors.secondaryText}
          cursorColor={AppColors.primaryText}
          selectionColor={AppColors.accentBlue}
        />
        <View style={styles.voiceButton}>
          <Ionicons name="mic-outline" size={s(17)} color={AppColors.iconAccent} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sharedPaddingHorizontal,
    marginBottom: s(12),
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: s(12),
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(5),
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: s(999),
    backgroundColor: AppColors.cardBackground,
    paddingHorizontal: s(10),
    paddingVertical: s(5),
  },
  countText: {
    color: AppColors.accentBlue,
    fontWeight: "800",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.searchBarBackground,
    borderRadius: s(18),
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: s(5),
  },
  searchbar: {
    flex: 1,
    backgroundColor: AppColors.searchBarBackground,
    elevation: 0,
    shadowOpacity: 0,
  },
  inputStyle: {
    color: AppColors.primaryText,
    fontSize: s(13),
    minHeight: s(42),
  },
  voiceButton: {
    width: s(36),
    height: s(36),
    borderRadius: s(13),
    backgroundColor: AppColors.cardBackgroundSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(3),
  },
});

export default SearchBar;
