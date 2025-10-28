import { StockData } from "@/data/mockStocks";
import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
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
  const snapPoints = useMemo(() => ["92%"], []);

  // Hiển thị bottom sheet khi có stockData
  useEffect(() => {
    if (stockData) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [stockData]);

  // Hàm đóng Bottom Sheet
  // const handleClosePress = useCallback(() => {
  //   bottomSheetRef.current?.close();
  //   onClose();
  // }, [onClose]);

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
      {stockData && (
        <View style={styles.topOverlay}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={true}
            automaticallyAdjustContentInsets={true}
            data={[
              "Hello",
              "Hello",
              "Helalo",
              "Hello",
              "Hello",
              "Hello",
              "Hello",
              "Hello",
              "Hello",
            ]}
            renderItem={({ item }) => (
              <AppText variant="titleLarge">{item}</AppText>
            )}
          />
        </View>
      )}

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
          <View style={{ paddingHorizontal: sharedPaddingHorizontal }}>
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
          </View>
        )}
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {stockData && (
            <>
              {/* Phần thông tin giá */}
              <View style={{ paddingHorizontal: sharedPaddingHorizontal }}>
                <View style={styles.priceInfoSection}>
                  <View style={styles.priceInfoRow}>
                    <View style={styles.priceInfoItem}>
                      <View style={styles.priceWithPercentage}>
                        <AppText variant="titleMedium">
                          {stockData.closePrice}
                        </AppText>
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
                      </View>
                      <AppText variant="caption" style={{ fontWeight: "700" }}>
                        Khi đóng cửa
                      </AppText>
                      <AppText variant="caption">
                        {stockData.exchange} • {stockData.currency}
                      </AppText>
                    </View>

                    <View style={styles.priceInfoItem}>
                      <View style={styles.priceWithPercentage}>
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
                      <AppText variant="caption" style={{ fontWeight: "700" }}>
                        Ngoài giờ
                      </AppText>
                    </View>
                  </View>
                </View>
                <DividerComponent />
              </View>

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
                <DividerComponent />
              </View>

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
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Giá cao hôm nay
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.todayHigh}
                      </AppText>
                    </View>
                    <DividerComponent />

                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Giá thấp hôm nay
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.todayLow}
                      </AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Khối lượng
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.volume}
                      </AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Tỷ lệ giá/lợi nhuận
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.peRatio}
                      </AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        GT vốn hóa
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.marketCap}
                      </AppText>
                    </View>
                    <DividerComponent />
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
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Thấp trong 52 tuần
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.week52Low}
                      </AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Khối lượng TB
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.averageVolume}
                      </AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Lợi tức
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.dividendYield}
                      </AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        Beta
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.beta}
                      </AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText style={styles.detailLabel} variant="body">
                        EPS
                      </AppText>
                      <AppText style={styles.detailValue} variant="body">
                        {stockData.eps}
                      </AppText>
                    </View>
                    <DividerComponent />
                  </View>
                </View>

                <AppText style={styles.yahooLink} variant="caption">
                  Dữ liệu khác từ Yahoo Finance
                </AppText>
              </View>

              {/* <View style={{ height: s(100) }} /> */}
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
    zIndex: 1000,
    backgroundColor: AppColors.background,
    paddingHorizontal: sharedPaddingHorizontal,
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
    paddingVertical: s(5),
  },
  priceInfoRow: {
    flexDirection: "row",
  },
  priceInfoItem: {
    flex: 1,
  },
  priceWithPercentage: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
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
    paddingVertical: s(10),
  },
  chartPlaceholder: {
    width: "100%",
    aspectRatio: 1.5, // Giữ tỉ lệ hình vuông
    backgroundColor: AppColors.secondaryBackground,
    borderRadius: s(10),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: s(10),
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: s(4),
    marginBottom: s(8),
  },
  detailLabel: {
    color: AppColors.secondaryText,
    fontSize: s(11),
  },
  detailValue: {
    fontWeight: "600",
    fontSize: s(11),
  },
  yahooLink: {
    color: AppColors.accentBlue,
    marginTop: s(10),
  },
});
