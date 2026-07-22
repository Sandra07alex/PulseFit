import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { Header, HeaderProps } from './Header';
import { ContentContainer } from './ContentContainer';

export interface AppShellProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerProps,
  scrollable = true,
  style,
}) => {
  return (
    <ScreenContainer style={style}>
      {headerProps && <Header {...headerProps} />}
      <ContentContainer scrollable={scrollable}>{children}</ContentContainer>
    </ScreenContainer>
  );
};
