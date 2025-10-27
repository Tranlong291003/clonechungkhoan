import Foodter from "@/components/Foodter/Foodter";
import Header from "@/components/Header/Header";
import AppText from "@/components/Text/AppText";
import AppSaveView from "@/components/views/AppSaveView";
import React from "react";
import { View } from "react-native";

const HomeScreen = () => {
  return (
    <AppSaveView>
      <Header />
      <View>
        <AppText>EmptyStateScreen</AppText>
      </View>
      <Foodter />
    </AppSaveView>
  );
};

export default HomeScreen;
