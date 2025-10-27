import { StockData } from "@/data/mockStocks";
import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { s } from "react-native-size-matters";
import DividerComponent from "../DividerComponent";
import Foodter from "../Foodter/Foodter";
import MoreMenuButton from "../MoreMenuButton";
import AppText from "../Text/AppText";

interface BasicBottomSheetProps {
  stockData: StockData | null;
  onClose: () => void;
}

const BasicBottomSheet: React.FC<BasicBottomSheetProps> = ({
  stockData,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snapshot points - 90% màn hình
  const snapPoints = ["92%"];

  // Hiển thị bottom sheet khi có stockData
  useEffect(() => {
    if (stockData) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [stockData]);

  // Hàm đóng Bottom Sheet
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
  }, [onClose]);

  // Custom backdrop cho Bottom Sheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <>
      {/* Phần trên 10% - OVERLAY khi mở bottom sheet */}
      {stockData && <View style={styles.topOverlay}></View>}

      {/* Bottom Sheet - 90% màn hình */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // -1 = đóng, 0 = mở
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableOverDrag={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={true}
        enableDynamicSizing={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleComponent={null}
        backdropComponent={renderBackdrop}
        onClose={onClose}
      >
        {stockData && (
          <>
            <View style={styles.headerContainer}>
              <View style={styles.headerTitleContainer}>
                <AppText variant="titleLarge">{stockData.name}</AppText>
                <AppText variant="body" style={styles.headerCompanyText}>
                  {stockData.company}
                </AppText>
              </View>
              <View style={styles.headerIconContainer}>
                <MoreMenuButton
                  iconSize={24}
                  style={{ backgroundColor: AppColors.secondaryBackground }}
                />
                <IconButton
                  icon="close"
                  size={24}
                  onPress={onClose}
                  style={styles.closeButton}
                  iconColor={AppColors.iconSecondary}
                />
              </View>
            </View>
            <DividerComponent />
          </>
        )}
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {stockData && (
            <>
              {/* Phần thông tin giá */}
              <View style={styles.priceInfoSection}>
                <View style={styles.priceInfoRow}>
                  <View style={styles.priceInfoItem}>
                    <AppText variant="titleMedium">
                      {stockData.closePrice}
                    </AppText>
                    <AppText variant="caption">Khi đóng cửa</AppText>
                    <AppText
                      style={[
                        stockData.closePercentage >= 0
                          ? { color: AppColors.positiveGreen }
                          : { color: AppColors.negativeRed },
                      ]}
                      variant="body"
                    >
                      {stockData.closePercentage >= 0 ? "+" : ""}
                      {stockData.closePercentage}%
                    </AppText>
                    <AppText variant="caption">
                      {stockData.exchange} • {stockData.currency}
                    </AppText>
                  </View>

                  <View style={styles.priceInfoItem}>
                    <AppText variant="caption">Ngoài giờ</AppText>
                    <AppText variant="titleMedium">
                      {stockData.afterHoursPrice}
                    </AppText>
                    <AppText
                      style={[
                        stockData.afterHoursPercentage >= 0
                          ? { color: AppColors.positiveGreen }
                          : { color: AppColors.negativeRed },
                      ]}
                      variant="caption"
                    >
                      {stockData.afterHoursPercentage >= 0 ? "+" : ""}
                      {stockData.afterHoursPercentage}%
                    </AppText>
                  </View>
                </View>
              </View>

              <DividerComponent />

              {/* Phần biểu đồ vuông */}
              <View style={styles.chartSection}>
                <View style={styles.chartPlaceholder}>
                  <AppText
                    style={styles.chartPlaceholderText}
                    variant="caption"
                  >
                    Biểu đồ
                  </AppText>
                </View>
              </View>

              <DividerComponent />

              {/* Phần dữ liệu chi tiết */}
              <View style={styles.detailsSection}>
                <AppText variant="titleMedium" style={styles.sectionTitle}>
                  Chi tiết
                </AppText>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailsColumn}>
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Giá mở cửa hôm nay
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.todayOpen}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Giá cao hôm nay
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.todayHigh}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Giá thấp hôm nay
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.todayLow}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Khối lượng
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.volume}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Tỷ lệ giá/lợi nhuận
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.peRatio}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        GT vốn hóa
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.marketCap}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.detailsColumn}>
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Cao trong 52 tuần
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.week52High}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Thấp trong 52 tuần
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.week52Low}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Khối lượng TB
                      </AppText>
                      <AppText style={styles.detailValue} variant="caption">
                        {stockData.averageVolume}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Lợi tức
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.dividendYield}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Beta
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.beta}
                      </AppText>
                    </View>

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        EPS
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.eps}
                      </AppText>
                      <DividerComponent />
                    </View>
                    <DividerComponent />
                  </View>
                </View>

                <AppText style={styles.yahooLink} variant="caption">
                  Dữ liệu khác từ Yahoo Finance
                </AppText>
              </View>

              <View style={{ height: s(100) }} />
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
      {stockData && <Foodter />}
    </>
  );
};

export default BasicBottomSheet;

const styles = StyleSheet.create({
  // Phần trên 10% màn hình
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "8%",
    backgroundColor: AppColors.background,
  },
  bottomSheetBackground: {
    backgroundColor: AppColors.cardBackground,
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
  },
  scrollContent: {
    backgroundColor: AppColors.cardBackground,
    paddingBottom: s(20),
  },
  headerContainer: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: s(15),
    paddingBottom: s(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleContainer: {
    flexDirection: "row",
    gap: s(4),
    alignItems: "flex-end",
  },
  headerCompanyText: {
    color: AppColors.secondaryText,
  },
  headerIconContainer: {
    flexDirection: "row",
    gap: s(10),
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: AppColors.secondaryBackground,
    borderRadius: 9999,
  },
  // Phần thông tin giá
  priceInfoSection: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingVertical: s(20),
  },
  priceInfoRow: {
    flexDirection: "row",
    gap: s(30),
  },
  priceInfoItem: {
    flex: 1,
  },
  priceLabel: {
    color: AppColors.secondaryText,
    marginBottom: s(8),
  },
  priceValue: {
    fontSize: s(24),
    fontWeight: "700",
    color: AppColors.primaryText,
    marginBottom: s(4),
  },
  pricePercent: {
    fontSize: s(16),
    fontWeight: "600",
    marginBottom: s(4),
  },
  priceMeta: {
    color: AppColors.secondaryText,
    marginTop: s(4),
  },
  // Phần biểu đồ vuông
  chartSection: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingVertical: s(15),
  },
  chartPlaceholder: {
    width: "100%",
    aspectRatio: 1, // Giữ tỉ lệ hình vuông
    backgroundColor: AppColors.secondaryBackground,
    borderRadius: s(10),
    justifyContent: "center",
    alignItems: "center",
  },
  chartPlaceholderText: {
    color: AppColors.tertiaryText,
  },
  // Phần dữ liệu chi tiết
  detailsSection: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingVertical: s(15),
  },
  sectionTitle: {
    marginBottom: s(15),
  },
  detailsGrid: {
    flexDirection: "row",
    gap: s(20),
  },
  detailsColumn: {
    flex: 1,
  },
  detailItem: {
    gap: s(10),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    color: AppColors.secondaryText,
    marginBottom: s(4),
  },
  detailValue: {
    color: AppColors.primaryText,
    fontWeight: "600",
  },
  yahooLink: {
    color: AppColors.accentBlue,
    marginTop: s(20),
    textAlign: "center",
  },
});
