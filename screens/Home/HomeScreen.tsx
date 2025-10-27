import Foodter from "@/components/Foodter/Foodter";
import Header from "@/components/Header/Header";
import SearchBar from "@/components/SearchBar";
import CardWatchList from "@/components/WatchList/CardWatchList";
import AppSaveView from "@/components/views/AppSaveView";
import { mockStocks } from "@/data/mockStocks";
import React from "react";
import { FlatList } from "react-native";

const HomeScreen = () => {
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
          />
        )}
      />
      <Foodter />
    </AppSaveView>
  );
};

export default HomeScreen;
