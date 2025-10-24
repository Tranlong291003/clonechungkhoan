import Header from "@/components/Header/Header";
import SearchBar from "@/components/SearchBar";
import AppSaveView from "@/components/views/AppSaveView";
import { AppColors } from "@/styles/Colors";
import React from "react";
import { StyleSheet } from "react-native";

const HomeScreen = () => {
  return (
    <AppSaveView>
      <Header />
      <SearchBar />
    </AppSaveView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {},
  text: {
    color: AppColors.secondaryText,
  },
});
