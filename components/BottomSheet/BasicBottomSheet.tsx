import { mockStocks, StockData } from "@/data/mockStocks";
import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { s, vs } from "react-native-size-matters";
import Footer from "../Footer/Footer";
import CustomMoreMenu from "../MoreMenu/CustomMoreMenu";
import AppText from "../Text/AppText";
import MiniChart from "../WatchList/MiniChart";

interface BasicBottomSheetProps {
  stockData: StockData | null;
  onClose: () => void;
}

const BasicBottomSheet: React.FC<BasicBottomSheetProps> = ({
  stockData,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);
  const scrollOffset = useRef(0);

  // Nhân đôi data để tạo hiệu ứng scroll vô hạn
  const duplicatedStocks = useMemo(() => [...mockStocks, ...mockStocks], []);

  const snapPoints = useMemo(() => ["92%"], []);
  const isSelectedPositive = (stockData?.percentage ?? 0) >= 0;
  const selectedChangeColor = isSelectedPositive
    ? AppColors.positiveGreen
    : AppColors.negativeRed;

  // Hiển thị bottom sheet khi có stockData
  useEffect(() => {
    if (stockData) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [stockData]);

  // Auto scroll FlatList - smooth continuous scroll chỉ khi bottom sheet mở
  useEffect(() => {
    // Chỉ scroll khi có stockData (bottom sheet đang mở)
    if (!stockData || mockStocks.length === 0) {
      // Reset scroll offset khi đóng
      scrollOffset.current = 0;
      return;
    }

    const ITEM_WIDTH = s(120); // Độ rộng mỗi item + margin
    const HALF_WIDTH = mockStocks.length * ITEM_WIDTH; // Nửa danh sách (phần gốc)
    const SCROLL_SPEED = 1; // Tốc độ scroll (pixel mỗi lần) - điều chỉnh để scroll nhanh/chậm hơn

    const interval = setInterval(() => {
      scrollOffset.current += SCROLL_SPEED;

      // Reset về đầu phần thứ 2 khi scroll hết phần thứ 1 (tạo hiệu ứng vô hạn)
      if (scrollOffset.current >= HALF_WIDTH) {
        scrollOffset.current = 0;
        flatListRef.current?.scrollToOffset({
          offset: 0,
          animated: false, // Không animate khi reset
        });
      } else {
        flatListRef.current?.scrollToOffset({
          offset: scrollOffset.current,
          animated: true,
        });
      }
    }, 16); // ~60fps

    // Cleanup: dừng scroll khi component unmount hoặc stockData thay đổi
    return () => {
      clearInterval(interval);
    };
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
      {stockData && (
        <View style={styles.topOverlay}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={duplicatedStocks}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View key={item.name} style={styles.tickerCard}>
                <View style={styles.tickerInfo}>
                  <AppText variant="titleMedium">{item.name}</AppText>
                  <AppText
                    variant="caption"
                    style={{
                      color:
                        item.percentage >= 0
                          ? AppColors.positiveGreen
                          : AppColors.negativeRed,
                    }}
                  >
                    {item.percentage >= 0 ? "+" : ""}
                    {item.percentage}%
                  </AppText>
                  <AppText variant="caption" style={styles.tickerPrice}>
                    {item.price}
                  </AppText>
                </View>
                <View style={styles.tickerChart}>
                  <MiniChart
                    data={item.chartData || []}
                    isPositive={item.percentage >= 0}
                    height={s(25)}
                  />
                </View>
              </View>
            )}
          />
        </View>
      )}

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
          <View style={styles.sheetHeaderWrapper}>
            <View style={styles.headerContainer}>
              <View style={styles.headerTitleContainer}>
                <View style={styles.symbolBadge}>
                  <AppText variant="caption" style={styles.symbolBadgeText}>
                    {stockData.exchange}
                  </AppText>
                </View>
                <AppText variant="titleLarge">{stockData.name}</AppText>
                <AppText numberOfLines={2} variant="caption">
                  {stockData.company}
                </AppText>
              </View>
              <View style={styles.headerIconContainer}>
                <CustomMoreMenu
                  backgroundColor={AppColors.secondaryBackground}
                  items={[
                    {
                      key: "share-stock-code",
                      label: "Chia sẻ mã" + "\n" + "chứng khoán",
                      icon: "share-social-outline",
                      onPress: () => {},
                    },
                    {
                      key: "copy-stock-link",
                      label: "Sao chép liên kết",
                      icon: "link-outline",
                      onPress: () => {},
                    },
                    {
                      key: "manage-stock-code",
                      label: "Quản lý mã" + "\n" + "chứng khoán",
                      icon: "list-outline",
                      onPress: () => {},
                    },
                  ]}
                />
                <IconButton
                  icon="close"
                  onPress={onClose}
                  style={styles.closeButton}
                  iconColor={AppColors.iconSecondary}
                />
              </View>
            </View>
          </View>
        )}
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {stockData && (
            <>
              <View style={styles.priceSectionWrapper}>
                <View style={styles.priceInfoSection}>
                  <View style={styles.priceInfoRow}>
                    <View style={styles.priceInfoItem}>
                      <AppText variant="caption" style={styles.sectionLabel}>
                        Khi đóng cửa
                      </AppText>
                      <View style={styles.priceWithPercentage}>
                        <AppText variant="titleLarge">
                          {stockData.closePrice}
                        </AppText>
                        <AppText
                          style={[
                            styles.inlineChange,
                            stockData.closePercentage >= 0
                              ? styles.positiveText
                              : styles.negativeText,
                          ]}
                          variant="body"
                        >
                          {stockData.closePercentage >= 0 ? "+" : ""}
                          {stockData.closePercentage}%
                        </AppText>
                      </View>
                      <AppText variant="caption">
                        {stockData.exchange} • {stockData.currency}
                      </AppText>
                    </View>

                    <View style={styles.priceInfoItem}>
                      <AppText variant="caption" style={styles.sectionLabel}>
                        Ngoài giờ
                      </AppText>
                      <View style={styles.priceWithPercentage}>
                        <AppText variant="titleMedium">
                          {stockData.afterHoursPrice}
                        </AppText>
                        <AppText
                          style={[
                            styles.inlineChange,
                            stockData.afterHoursPercentage >= 0
                              ? styles.positiveText
                              : styles.negativeText,
                          ]}
                          variant="caption"
                        >
                          {stockData.afterHoursPercentage >= 0 ? "+" : ""}
                          {stockData.afterHoursPercentage}%
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.chartSection}>
                <View style={styles.chartPlaceholder}>
                  <View style={styles.chartHeader}>
                    <View>
                      <AppText variant="caption" style={styles.sectionLabel}>
                        Biểu đồ hiệu suất
                      </AppText>
                      <AppText variant="titleMedium">
                        {isSelectedPositive ? "Xu hướng tích cực" : "Đang điều chỉnh"}
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.heroChangeBadge,
                        { backgroundColor: `${selectedChangeColor}22` },
                      ]}
                    >
                      <AppText
                        variant="caption"
                        style={{ color: selectedChangeColor }}
                      >
                        {isSelectedPositive ? "+" : ""}
                        {stockData.percentage}%
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.heroChart}>
                    <MiniChart
                      data={stockData.chartData || []}
                      isPositive={isSelectedPositive}
                      height={s(120)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <AppText variant="titleMedium" style={styles.detailsTitle}>
                  Chi tiết
                </AppText>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailsColumn}>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Giá mở cửa hôm nay</AppText>
                      <AppText variant="body">{stockData.todayOpen}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Giá cao hôm nay</AppText>
                      <AppText variant="body">{stockData.todayHigh}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Giá thấp hôm nay</AppText>
                      <AppText variant="body">{stockData.todayLow}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Khối lượng</AppText>
                      <AppText variant="body">{stockData.volume}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Tỷ lệ giá/lợi nhuận</AppText>
                      <AppText variant="body">{stockData.peRatio}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">GT vốn hóa</AppText>
                      <AppText variant="body">{stockData.marketCap}</AppText>
                    </View>
                  </View>
                  <View style={styles.detailsColumn}>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Cao trong 52 tuần</AppText>
                      <AppText variant="body">{stockData.week52High}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Thấp trong 52 tuần</AppText>
                      <AppText variant="body">{stockData.week52Low}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Khối lượng TB</AppText>
                      <AppText variant="body">
                        {stockData.averageVolume}
                      </AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Lợi tức</AppText>
                      <AppText variant="body">
                        {stockData.dividendYield}
                      </AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Beta</AppText>
                      <AppText variant="body">{stockData.beta}</AppText>
                    </View>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">EPS</AppText>
                      <AppText variant="body">{stockData.eps}</AppText>
                    </View>
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
      {stockData && <Footer />}
    </>
  );
};

export default BasicBottomSheet;

const styles = StyleSheet.create({
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "9%",
    zIndex: 1000,
    backgroundColor: AppColors.backgroundElevated,
    paddingHorizontal: sharedPaddingHorizontal,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
  },
  tickerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),
    marginRight: s(10),
    paddingHorizontal: s(12),
    paddingVertical: s(8),
    backgroundColor: AppColors.cardBackground,
    borderRadius: s(18),
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tickerInfo: {
    minWidth: s(72),
  },
  tickerPrice: {
    color: AppColors.tertiaryText,
  },
  tickerChart: {
    width: s(76),
  },
  bottomSheetBackground: {
    backgroundColor: AppColors.cardBackground,
    borderTopLeftRadius: s(28),
    borderTopRightRadius: s(28),
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  scrollContent: {
    backgroundColor: AppColors.cardBackground,
    paddingBottom: s(96),
  },
  sheetHeaderWrapper: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: s(18),
    paddingBottom: s(12),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: s(12),
  },
  headerTitleContainer: {
    flex: 1,
    gap: s(5),
  },
  symbolBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: s(8),
    paddingVertical: s(3),
    backgroundColor: AppColors.searchBarBackground,
    borderRadius: s(999),
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  symbolBadgeText: {
    color: AppColors.accentBlue,
    fontSize: s(9),
  },
  headerIconContainer: {
    flexDirection: "row",
    gap: s(8),
    alignItems: "center",
    justifyContent: "flex-end",
  },
  closeButton: {
    backgroundColor: AppColors.secondaryBackground,
    borderRadius: 9999,
    height: s(34),
    width: s(34),
  },
  priceSectionWrapper: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: vs(16),
  },
  priceInfoSection: {
    padding: s(14),
    backgroundColor: AppColors.cardBackgroundSoft,
    borderRadius: s(18),
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  priceInfoRow: {
    flexDirection: "row",
    gap: s(12),
  },
  priceInfoItem: {
    flex: 1,
    gap: s(6),
  },
  priceWithPercentage: {
    gap: s(4),
  },
  inlineChange: {
    fontWeight: "800",
  },
  positiveText: {
    color: AppColors.positiveGreen,
  },
  negativeText: {
    color: AppColors.negativeRed,
  },
  sectionLabel: {
    color: AppColors.tertiaryText,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontSize: s(9),
  },
  chartSection: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: vs(14),
  },
  chartPlaceholder: {
    width: "100%",
    minHeight: s(210),
    backgroundColor: AppColors.cardBackgroundSoft,
    borderRadius: s(22),
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: s(16),
    justifyContent: "space-between",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: s(8),
  },
  heroChangeBadge: {
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    borderRadius: s(999),
  },
  heroChart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsSection: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: vs(18),
  },
  detailsTitle: {
    marginBottom: s(12),
  },
  detailsGrid: {
    flexDirection: "row",
    gap: s(12),
  },
  detailsColumn: {
    flex: 1,
    gap: s(10),
  },
  detailItem: {
    gap: s(5),
    padding: s(10),
    minHeight: s(66),
    backgroundColor: AppColors.backgroundElevated,
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: AppColors.separator,
  },
  yahooLink: {
    color: AppColors.accentBlue,
    marginTop: vs(16),
    textAlign: "center",
  },
});
