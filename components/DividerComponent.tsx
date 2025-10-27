import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import React from "react";
import { View } from "react-native";

const DividerComponent = () => {
  return (
    <View>
      <View
        style={{
          height: 1,
          backgroundColor: AppColors.separator,
          marginHorizontal: sharedPaddingHorizontal,
        }}
      />
    </View>
  );
};

export default DividerComponent;
