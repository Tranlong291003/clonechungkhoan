import BasicBottomSheet from "@/components/BottomSheet/BasicBottomSheet";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SearchBar from "@/components/SearchBar";
import AppText from "@/components/Text/AppText";
import CardWatchList from "@/components/WatchList/CardWatchList";
import AppSaveView from "@/components/views/AppSaveView";
import { mockStocks, StockData } from "@/data/mockStocks";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const HomeScreen = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCardPress = (item: StockData) => {
    setSelectedStock(item);
  };

  const handleCloseSheet = () => {
    setSelectedStock(null);
  };

  // Hàm chuyển sang mã chứng khoán tiếp theo
  const handleNextStock = () => {
    if (!selectedStock) return;
    const currentIndex = filteredStocks.findIndex(
      (stock) => stock.id === selectedStock.id
    );
    if (currentIndex < filteredStocks.length - 1) {
      setSelectedStock(filteredStocks[currentIndex + 1]);
    } else {
      // Quay về đầu danh sách
      setSelectedStock(filteredStocks[0]);
    }
  };

  // Hàm chuyển về mã chứng khoán trước đó
  const handlePreviousStock = () => {
    if (!selectedStock) return;
    const currentIndex = filteredStocks.findIndex(
      (stock) => stock.id === selectedStock.id
    );
    if (currentIndex > 0) {
      setSelectedStock(filteredStocks[currentIndex - 1]);
    } else {
      // Quay về cuối danh sách
      setSelectedStock(filteredStocks[filteredStocks.length - 1]);
    }
  };

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockStocks;
    } else
      return mockStocks.filter((stock) => {
        const Name = stock.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const Company = stock.company
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return Name || Company;
      });
  }, [searchQuery]);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <AppText variant="titleMedium">
        Không tìm thấy kết quả cho "{searchQuery}"
      </AppText>
      <AppText variant="caption">
        Thử tìm kiếm bằng mã cổ phiếu hoặc tên công ty
      </AppText>
    </View>
  );

  return (
    <AppSaveView>
      <Header />
      <FlatList
        ListHeaderComponent={
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        }
        data={filteredStocks}
        renderItem={({ item }) => (
          <CardWatchList
            name={item.name}
            company={item.company}
            price={item.price}
            percentage={item.percentage}
            chartData={item.chartData}
            onPress={() => handleCardPress(item)}
          />
        )}
        ListEmptyComponent={searchQuery ? renderEmptyComponent : null}
        keyboardShouldPersistTaps="handled"
      />

      {!selectedStock && <Footer />}
      <BasicBottomSheet
        stockData={selectedStock}
        onClose={handleCloseSheet}
        onNextStock={handleNextStock}
        onPreviousStock={handlePreviousStock}
      />
    </AppSaveView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
