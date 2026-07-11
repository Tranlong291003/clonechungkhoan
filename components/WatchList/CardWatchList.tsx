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
    const percentageBackground = isPositive
      ? "rgba(34, 197, 94, 0.14)"
      : "rgba(244, 63, 94, 0.14)";
    const formattedPercentage = `${isPositive ? "+" : ""}${percentage}%`;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardCompanyInfo}>
              <View style={styles.symbolBadge}>
                <AppText variant="caption" style={styles.symbolText}>
                  {name.slice(0, 2)}
                </AppText>
              </View>
              <View style={styles.companyText}>
                <AppText variant="titleMedium">{name}</AppText>
                <AppText numberOfLines={1} variant="caption">
                  {company}
                </AppText>
              </View>
            </View>
            <View style={styles.chartInfo}>
              {chartData && (
                <MiniChart
                  data={chartData}
                  isPositive={isPositive}
                  height={s(36)}
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
                    backgroundColor: percentageBackground,
                    color: percentageColor,
                    borderColor: percentageColor,
                  },
                ]}
                variant="caption"
              >
                {formattedPercentage}
              </AppText>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }
);

CardWatchList.displayName = "CardWatchList";

export default CardWatchList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sharedPaddingHorizontal,
    marginBottom: s(10),
  },
  card: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: AppColors.border,
    elevation: 0,
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),
    paddingHorizontal: s(14),
    paddingVertical: s(14),
  },
  cardCompanyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),
    flex: 2,
  },
  symbolBadge: {
    height: s(40),
    width: s(40),
    borderRadius: s(14),
    backgroundColor: AppColors.cardBackgroundSoft,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  symbolText: {
    color: AppColors.accentBlue,
    fontWeight: "800",
  },
  companyText: {
    flex: 1,
  },
  cardPriceInfo: {
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-end",
  },
  chartInfo: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    gap: s(4),
  },
  cardPrice: {
    fontWeight: "700",
    marginBottom: s(6),
    textAlign: "right",
  },
  cardPercentage: {
    minWidth: s(58),
    fontWeight: "700",
    textAlign: "center",
    alignSelf: "flex-end",
    borderRadius: s(999),
    borderWidth: 1,
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    gap: s(2),
  },
});
