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
import DividerComponent from "../DividerComponent";
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
      {/* Phần trên 10% - OVERLAY khi mở bottom sheet */}
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
              <View key={item.name} style={{ marginRight: s(10) }}>
                <View style={{ flexDirection: "row", gap: s(10) }}>
                  <View style={{ flexDirection: "column" }}>
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
                    <AppText
                      variant="caption"
                      style={{ color: AppColors.secondaryText }}
                    >
                      {item.price}
                    </AppText>
                  </View>
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
                <AppText variant="caption">{stockData.company}</AppText>
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
                  <AppText variant="caption">Biểu đồ</AppText>
                </View>
                <DividerComponent />
              </View>

              {/* Phần dữ liệu chi tiết */}
              <View style={styles.detailsSection}>
                <AppText variant="titleMedium" style={{ marginBottom: s(15) }}>
                  Chi tiết
                </AppText>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailsColumn}>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Giá mở cửa hôm nay</AppText>
                      <AppText variant="body">{stockData.todayOpen}</AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Giá cao hôm nay</AppText>
                      <AppText variant="body">{stockData.todayHigh}</AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Giá thấp hôm nay</AppText>
                      <AppText variant="body">{stockData.todayLow}</AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Khối lượng</AppText>
                      <AppText variant="body">{stockData.volume}</AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Tỷ lệ giá/lợi nhuận</AppText>
                      <AppText variant="body">{stockData.peRatio}</AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">GT vốn hóa</AppText>
                      <AppText variant="body">{stockData.marketCap}</AppText>
                    </View>
                    <DividerComponent />
                  </View>
                  <View style={styles.detailsColumn}>
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Cao trong 52 tuần</AppText>
                      <AppText variant="body">{stockData.week52High}</AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Thấp trong 52 tuần</AppText>
                      <AppText variant="body">{stockData.week52Low}</AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Khối lượng TB</AppText>
                      <AppText variant="body">
                        {stockData.averageVolume}
                      </AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Lợi tức</AppText>
                      <AppText variant="body">
                        {stockData.dividendYield}
                      </AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">Beta</AppText>
                      <AppText variant="body">{stockData.beta}</AppText>
                    </View>
                    <DividerComponent />
                    <View style={styles.detailItem}>
                      <AppText variant="caption">EPS</AppText>
                      <AppText variant="body">{stockData.eps}</AppText>
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
      {stockData && <Footer />}
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
    paddingVertical: s(10),
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleContainer: {
    flexDirection: "row",
    gap: s(4),
    alignItems: "flex-end",
  },

  headerIconContainer: {
    flexDirection: "row",
    gap: s(10),
    alignItems: "center",
    justifyContent: "flex-end",
  },
  closeButton: {
    backgroundColor: AppColors.secondaryBackground,
    borderRadius: 9999,
    height: s(30),
    width: s(30),
  },
  // Phần thông tin giá
  priceInfoSection: {
    paddingVertical: vs(5),
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

  // Phần biểu đồ vuông
  chartSection: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingVertical: vs(10),
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

  // Phần dữ liệu chi tiết
  detailsSection: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingVertical: vs(15),
  },
  detailsGrid: {
    flexDirection: "row",
    gap: s(10),
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

  yahooLink: {
    color: AppColors.accentBlue,
    marginTop: vs(10),
  },
});
