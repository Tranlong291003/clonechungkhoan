import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";
import { s } from "react-native-size-matters";
import AppText from "../Text/AppText";

interface CardWatchListProps {
  name: string;
  company: string;
  price: string;
  percentage: number;
}

const CardWatchList = memo(
  ({ name, company, price, percentage }: CardWatchListProps) => {
    const isPositive = percentage >= 0;
    const percentageColor = isPositive
      ? AppColors.positiveGreen
      : AppColors.negativeRed;

    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardCompanyInfo}>
              <AppText variant="body" style={{ fontWeight: "700" }}>
                {name}
              </AppText>
              <AppText variant="caption">{company}</AppText>
            </View>
            <View style={styles.chartInfo}></View>
            <View style={styles.cardPriceInfo}>
              <AppText style={styles.cardPrice} variant="body">
                {price}
              </AppText>
              <AppText
                style={[
                  styles.cardPercentage,
                  { backgroundColor: percentageColor },
                ]}
                variant="caption"
              >
                {percentage}
              </AppText>
            </View>
          </Card.Content>
          <View style={{ marginTop: s(10) }}>
            <View style={styles.lineSeparator} />
          </View>
        </Card>
      </View>
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
    gap: s(2),
  },
  cardCompanyInfo: {
    flexDirection: "column",
    flex: 2,
  },
  cardPriceInfo: {
    flexDirection: "column",
    flex: 1,
  },
  chartInfo: {
    flex: 0.7,
    backgroundColor: "red",
  },
  cardPrice: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: s(2),
  },
  cardPercentage: {
    color: AppColors.primaryText,
    fontWeight: "700",
    textAlign: "right",
    alignSelf: "flex-end",
    borderRadius: s(3),
    paddingLeft: s(10),
    paddingRight: s(2),
    paddingTop: s(1),
    paddingBottom: s(1),
  },
  lineSeparator: {
    height: 0.5,
    backgroundColor: AppColors.separator,
    marginHorizontal: s(10),
  },
});
