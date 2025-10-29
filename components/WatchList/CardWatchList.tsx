import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";
import { s } from "react-native-size-matters";
import AppText from "../Text/AppText";
import MiniChart from "./MiniChart";

interface CardWatchListProps {
  name: string;
  company: string;
  price: string;
  percentage: number;
  chartData?: number[];
  onPress?: () => void;
}

const CardWatchList = memo(
  ({
    name,
    company,
    price,
    percentage,
    chartData,
    onPress,
  }: CardWatchListProps) => {
    const isPositive = percentage >= 0;
    const percentageColor = isPositive
      ? AppColors.positiveGreen
      : AppColors.negativeRed;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardCompanyInfo}>
              <AppText
                variant="titleMedium"
                // style={{ fontSize: s(14), fontWeight: "700" }}
              >
                {name}
              </AppText>
              <AppText numberOfLines={1} variant="caption">
                {company}
              </AppText>
            </View>
            <View style={styles.chartInfo}>
              {chartData && (
                <MiniChart
                  data={chartData}
                  isPositive={isPositive}
                  height={s(25)}
                />
              )}
            </View>
            <View style={styles.cardPriceInfo}>
              <AppText style={styles.cardPrice} variant="body">
                {price}
              </AppText>
              <AppText
                style={[
                  styles.cardPercentage,
                  {
                    backgroundColor: percentageColor,
                  },
                ]}
                variant="caption"
              >
                {percentage} %
              </AppText>
            </View>
          </Card.Content>
          <View style={{ marginTop: s(10) }}>
            <View style={styles.lineSeparator} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
);

CardWatchList.displayName = "CardWatchList";

export default CardWatchList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sharedPaddingHorizontal - s(10), // Căn thẳng với text trong SearchBar
  },
  card: {
    backgroundColor: AppColors.background,
  },
  cardContent: {
    flexDirection: "row",
    gap: s(5),
  },
  cardCompanyInfo: {
    flexDirection: "column",
    flex: 2,
  },
  cardPriceInfo: {
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-end",
  },
  chartInfo: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: s(5),
    gap: s(4),
  },
  cardPrice: {
    fontWeight: "700",
    marginBottom: s(2),
    textAlign: "right",
  },
  cardPercentage: {
    minWidth: s(50),
    color: AppColors.primaryText,
    fontWeight: "700",
    textAlign: "right",
    alignSelf: "flex-end",
    borderRadius: s(3),
    paddingHorizontal: s(4),
    paddingVertical: s(2),
    gap: s(2),
  },
  lineSeparator: {
    height: 0.5,
    backgroundColor: AppColors.separator,
    marginHorizontal: s(10),
  },
});
