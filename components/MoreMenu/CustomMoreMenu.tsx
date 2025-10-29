import { IS_ANDROID } from "@/constants/constants";
import { AppColors } from "@/styles/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { s } from "react-native-size-matters";

export interface MenuItemType {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}

interface CustomMoreMenuProps {
  items: MenuItemType[];
  backgroundColor?: string;
  iconColor?: string;
  iconSize?: number;
}

const CustomMoreMenu = ({
  items,
  backgroundColor,
  iconColor = "#569DDC",
  iconSize = 24,
}: CustomMoreMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);

  const openMenu = useCallback(() => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        const position = {
          top: IS_ANDROID ? pageY : pageY + height + 8,
          right: 20,
        };
        console.log("Menu position:", position);
        setMenuPosition(position);
        setVisible(true);
      });
    }
  }, []);

  const closeMenu = useCallback(() => setVisible(false), []);

  const handleItemPress = useCallback(
    (item: MenuItemType) => () => {
      if (item.disabled) return;
      closeMenu();
      setTimeout(() => {
        item.onPress();
      }, 100);
    },
    [closeMenu]
  );

  return (
    <>
      <View
        ref={buttonRef}
        style={[
          styles.container,
          { backgroundColor: backgroundColor || AppColors.cardBackground },
        ]}
      >
        <TouchableOpacity
          onPress={openMenu}
          style={styles.button}
          activeOpacity={0.7}
          accessibilityLabel="More options"
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={iconSize}
            color={iconColor}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.menuContainer,
                  {
                    top: menuPosition.top,
                    right: menuPosition.right,
                    backgroundColor: AppColors.cardBackground,
                  },
                ]}
              >
                {items.map((item, index) => (
                  <View key={item.key}>
                    <TouchableOpacity
                      onPress={handleItemPress(item)}
                      disabled={item.disabled}
                      style={[
                        styles.menuItem,
                        item.disabled && styles.menuItemDisabled,
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.menuText,
                          { color: AppColors.primaryText },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.icon && (
                        <Ionicons
                          name={item.icon}
                          size={20}
                          color={AppColors.primaryText}
                          style={styles.icon}
                        />
                      )}
                    </TouchableOpacity>
                    {index < items.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default memo(CustomMoreMenu);

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    height: s(30),
    width: s(30),
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    minWidth: 200,
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  menuItemDisabled: {
    opacity: 0.4,
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.separator,
    marginHorizontal: 12,
  },
});
