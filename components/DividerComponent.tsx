import { AppColors } from "@/styles/Colors";
import React from "react";
import { View } from "react-native";
import { s } from "react-native-size-matters";

const DividerComponent = () => {
  return (
    <View>
      <View
        style={{
          width: "100%",
          height: s(1),
          backgroundColor: AppColors.separator,
        }}
      />
    </View>
  );
};

export default DividerComponent;
