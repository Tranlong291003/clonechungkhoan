import { AppColors } from "@/styles/Colors";
import React, { memo, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Menu, useTheme } from "react-native-paper";

export interface MoreMenuItem {
  key: string;
  label: string;
  subtitle?: string;
  icon?: string;
  iconPosition?: "left" | "right";
  onPress?: () => void;
  disabled?: boolean;
  leadingIcon?: string;
  trailingIcon?: string;
}

interface MoreMenuButtonProps {
  items?: MoreMenuItem[];
  iconSize?: number;
  iconColor?: string;
  position?: "top" | "bottom";
  anchorPosition?: "top" | "bottom";
  contentStyle?: any;
  style?: any;
}

const defaultItems: MoreMenuItem[] = [
  {
    key: "edit",
    label: "Sửa DS theo dõi",
    trailingIcon: "pencil",
  },
  {
    key: "currency",
    label: "Hiển thị tiền tệ",
    leadingIcon: "check",
    trailingIcon: "currency-usd",
  },
  {
    key: "sort",
    label: "Sắp xếp danh sách",
    subtitle: "theo dõi theo\nThay đổi giá",
    leadingIcon: "arrow-right",
    trailingIcon: "sort",
  },
  {
    key: "watchlist",
    label: "Danh sách theo dõi",
    subtitle: "hiển thị\nThay đổi phần trăm",
    leadingIcon: "arrow-right",
    trailingIcon: "chart-line",
  },
];

const MoreMenuButton: React.FC<MoreMenuButtonProps> = ({
  items = defaultItems,
  iconSize = 24,
  iconColor,
  position = "top",
  anchorPosition = "top",
  contentStyle,
  style,
}) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);

  const handleItemPress = useCallback(
    (item: MoreMenuItem) => () => {
      if (item.disabled) return;
      closeMenu();
      item.onPress?.();
    },
    [closeMenu]
  );

  const menuIconColor = iconColor || AppColors.iconAccent;

  return (
    <View style={[styles.container, style]}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="dots-horizontal"
            size={iconSize}
            iconColor={menuIconColor}
            onPress={openMenu}
            accessibilityLabel="More options"
            style={styles.iconButton}
          />
        }
        contentStyle={[
          styles.menuContent,
          { backgroundColor: AppColors.cardBackground },
          contentStyle,
          position === "bottom" && styles.menuBottom,
        ]}
        anchorPosition={anchorPosition}
      >
        {items.map((item) => (
          <View key={item.key}>
            <Menu.Item
              title={item.label}
              titleStyle={[styles.menuTitle, { color: AppColors.primaryText }]}
              onPress={handleItemPress(item)}
              disabled={item.disabled}
              leadingIcon={item.leadingIcon}
              trailingIcon={item.trailingIcon}
              dense={false}
              style={[
                styles.menuItem,
                item.disabled && styles.menuItemDisabled,
              ]}
            />
            {item.subtitle && (
              <View style={styles.subtitleContainer}>
                <Menu.Item
                  title={item.subtitle}
                  titleStyle={[
                    styles.menuSubtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                  disabled
                  dense
                  style={styles.subtitleItem}
                />
              </View>
            )}
          </View>
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 9999,
  },
  iconButton: {
    margin: 0,
  },
  menuContent: {
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuBottom: {
    marginTop: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtitleContainer: {
    marginTop: 4,
  },
  subtitleItem: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
  },
  menuSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default memo(MoreMenuButton);
