import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Header, HeaderProps } from './Header';
import { ContentContainer } from './ContentContainer';

export interface PageProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const Page: React.FC<PageProps> = ({
  children,
  headerProps,
  scrollable = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {headerProps && <Header {...headerProps} />}
      <ContentContainer scrollable={scrollable}>{children}</ContentContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
