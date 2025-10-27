import { StockData } from "@/data/mockStocks";
import { AppColors } from "@/styles/Colors";
import { sharedPaddingHorizontal } from "@/styles/sharedStyles";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { s } from "react-native-size-matters";
import Foodter from "../Foodter/Foodter";

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
      {stockData && <View style={styles.topOverlay} />}

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
        <BottomSheetView style={styles.bottomSheetContent}>
          {stockData && (
            <>
              <View style={styles.emptyContent} />
            </>
          )}
        </BottomSheetView>
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
    // zIndex: 1000,
  },
  topOverlayCloseButton: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: s(50),
    paddingRight: s(20),
  },
  bottomSheetBackground: {
    backgroundColor: AppColors.cardBackground,
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
  },
  indicator: {
    backgroundColor: AppColors.separator,
    width: s(40),
    height: s(4),
  },
  bottomSheetContent: {
    flex: 1,
  },
  fixedHeader: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: s(15),
    paddingBottom: s(20),
    backgroundColor: AppColors.cardBackground,
  },
  headerCloseContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: s(20),
  },
  closeButton: {
    width: s(35),
    height: s(35),
    borderRadius: s(17.5),
    backgroundColor: AppColors.secondaryBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: AppColors.primaryText,
    fontSize: s(18),
    fontWeight: "400",
  },
  stockInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stockInfoLeft: {
    flex: 1,
  },
  stockName: {
    color: AppColors.primaryText,
    fontSize: s(32),
    fontWeight: "700",
    marginBottom: s(5),
  },
  stockCompany: {
    color: AppColors.secondaryText,
    fontSize: s(14),
  },
  priceInfoContainer: {
    alignItems: "flex-end",
  },
  price: {
    color: AppColors.primaryText,
    fontSize: s(22),
    fontWeight: "700",
    marginBottom: s(5),
  },
  percentage: {
    fontSize: s(16),
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: s(10),
    paddingBottom: s(30),
  },
  detailsContainer: {
    gap: 0,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: s(15),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
  },
  label: {
    color: AppColors.secondaryText,
    fontSize: s(15),
  },
  value: {
    color: AppColors.primaryText,
    fontSize: s(15),
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.separator,
    marginVertical: s(10),
  },
  emptyContent: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
