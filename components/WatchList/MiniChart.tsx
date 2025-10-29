import { AppColors } from "@/styles/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

interface MiniChartProps {
  data: number[];
  isPositive: boolean;
  height?: number;
}

const MiniChart: React.FC<MiniChartProps> = ({
  data,
  isPositive,
  height = 100,
}) => {
  const color = isPositive ? AppColors.positiveGreen : AppColors.negativeRed;
  const width = 80;

  if (!data || data.length === 0) {
    return null;
  }

  // Tìm min và max để scale dữ liệu
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Tránh chia cho 0

  // Scale dữ liệu về 0-100
  const scaledData = data.map((value) => ((value - min) / range) * 100);

  // Tạo path cho đường line
  const points = scaledData.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (value / 100) * height;
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });

  const pathString = points.join(" ");

  // Tạo path cho area chart (thêm điểm cuối và điểm đầu để tạo hình kín)
  const areaPath = pathString + ` L ${width} ${height} L 0 ${height} Z`;

  // Baseline: kẻ một đường ngang nét đứt tại mức giá cuối cùng
  const lastScaled = scaledData[scaledData.length - 1] ?? 0;
  const baselineY = height - (lastScaled / 100) * height;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {/* Area fill */}
        <Path d={areaPath} fill="url(#gradient)" />
        {/* Line */}
        <Path
          d={pathString}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Baseline dashed under last price level */}
        <Path
          d={`M 0 ${baselineY} L ${width} ${baselineY}`}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity={0.6}
        />
      </Svg>
    </View>
  );
};

export default MiniChart;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
