import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm kiếm"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.inputStyle}
          iconColor={AppColors.secondaryText}
          placeholderTextColor={AppColors.secondaryText}
          cursorColor={AppColors.primaryText}
          selectionColor={AppColors.accentBlue}
        />
        <IconButton
          icon={require("@/assets/microphone.png")}
          size={20}
          iconColor={AppColors.secondaryText}
          style={styles.filterIcon}
          onPress={() => {
            // Handle filter action
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sharedPaddingHorizontal,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.searchBarBackground,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  searchbar: {
    flex: 1,
    backgroundColor: AppColors.searchBarBackground,
    elevation: 0,
    shadowOpacity: 0,
  },
  inputStyle: {
    color: AppColors.primaryText,
    fontSize: 16,
  },
  filterIcon: {
    margin: 0,
    padding: 8,
  },
});

export default SearchBar;
