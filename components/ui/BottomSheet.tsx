// BottomSheet component (modal-based)
import React, { useState } from 'react';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, radius, colors } from '~/theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  title,
  height = Dimensions.get('window').height * 0.75,
}) => {
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.white,
      borderTopLeftRadius: radius.sheet,
      borderTopRightRadius: radius.sheet,
      maxHeight: height,
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.gray300,
      marginBottom: spacing.md,
      alignSelf: 'center',
    },
    content: {
      flex: 1,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={{ flex: 1 }} />
        <SafeAreaView style={styles.container}>
          <View style={styles.handle} />
          {title && (
            <View style={styles.header}>
              <View />
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};
