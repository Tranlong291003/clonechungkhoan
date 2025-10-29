import BasicBottomSheet from "@/components/BottomSheet/BasicBottomSheet";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SearchBar from "@/components/SearchBar";
import CardWatchList from "@/components/WatchList/CardWatchList";
import AppSaveView from "@/components/views/AppSaveView";
import { mockStocks, StockData } from "@/data/mockStocks";
import React, { useState } from "react";
import { FlatList } from "react-native";

const HomeScreen = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);

  const handleCardPress = (item: StockData) => {
    setSelectedStock(item);
  };

  const handleCloseSheet = () => {
    setSelectedStock(null);
  };

  return (
    <AppSaveView>
      <Header />
      <FlatList
        ListHeaderComponent={<SearchBar />}
        data={mockStocks}
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
      />
      {!selectedStock && <Footer />}
      <BasicBottomSheet stockData={selectedStock} onClose={handleCloseSheet} />
    </AppSaveView>
  );
};

export default HomeScreen;
