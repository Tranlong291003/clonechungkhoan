import { MD3DarkTheme } from "react-native-paper";
import { AppColors } from "./Colors";
// Dark theme configuration only
export const Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Background colors - theo ảnh menu có background tối hơn
    background: AppColors.background, // #000000 - đen thuần
    surface: "#1C1C1E", // Darker than cardBackground for menu
    surfaceVariant: AppColors.secondaryBackground, // #2C2C2C

    // Text colors - theo ảnh
    onBackground: AppColors.primaryText, // #FFFFFF - trắng
    onSurface: AppColors.primaryText, // #FFFFFF - trắng cho menu items
    onSurfaceVariant: AppColors.secondaryText, // #AAAAAA - xám nhạt cho subtitle

    // Primary colors
    primary: AppColors.accentBlue, // #0A84FF - xanh dương
    onPrimary: AppColors.primaryText,

    // Secondary colors
    secondary: AppColors.accentBlue,
    onSecondary: AppColors.primaryText,

    // Error colors
    error: AppColors.negativeRed, // #FF3B30 - đỏ
    onError: AppColors.primaryText,

    // Success colors
    success: AppColors.positiveGreen, // #34C759 - xanh lá
    onSuccess: AppColors.primaryText,

    // Outline colors
    outline: AppColors.separator, // #444444
    outlineVariant: AppColors.separator,

    // Custom colors for stock app - theo ảnh
    positiveChange: AppColors.positiveGreen, // #34C759 - xanh lá cho tăng giá
    negativeChange: AppColors.negativeRed, // #FF3B30 - đỏ cho giảm giá
    searchBarBackground: AppColors.searchBarBackground, // #1C1C1E
    selectedTabBackground: AppColors.selectedTabBackground, // #FFFFFF
    selectedTabText: AppColors.selectedTabText, // #1A1A1A
    yahooFinanceText: AppColors.yahooFinanceText, // #E5E5EA

    // Icon colors - theo ảnh
    iconPrimary: AppColors.iconPrimary, // #FFFFFF - trắng cho icon chính
    iconSecondary: AppColors.iconSecondary, // #AAAAAA - xám nhạt cho icon phụ
    iconAccent: AppColors.iconAccent, // #0A84FF - xanh dương cho icon accent
  },
};

export default Theme;
