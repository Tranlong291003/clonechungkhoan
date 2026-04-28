import { MD3DarkTheme } from "react-native-paper";
import { AppColors } from "./Colors";

export const Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: AppColors.background,
    surface: AppColors.cardBackground,
    surfaceVariant: AppColors.secondaryBackground,

    onBackground: AppColors.primaryText,
    onSurface: AppColors.primaryText,
    onSurfaceVariant: AppColors.secondaryText,

    primary: AppColors.accentBlue,
    onPrimary: AppColors.primaryText,

    secondary: AppColors.accentPurple,
    onSecondary: AppColors.primaryText,

    error: AppColors.negativeRed,
    onError: AppColors.primaryText,

    success: AppColors.positiveGreen,
    onSuccess: AppColors.primaryText,

    outline: AppColors.border,
    outlineVariant: AppColors.separator,

    positiveChange: AppColors.positiveGreen,
    negativeChange: AppColors.negativeRed,
    searchBarBackground: AppColors.searchBarBackground,
    selectedTabBackground: AppColors.selectedTabBackground,
    selectedTabText: AppColors.selectedTabText,
    yahooFinanceText: AppColors.yahooFinanceText,

    iconPrimary: AppColors.iconPrimary,
    iconSecondary: AppColors.iconSecondary,
    iconAccent: AppColors.iconAccent,
  },
};

export default Theme;
