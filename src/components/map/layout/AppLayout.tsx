import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from './TopBar';
import MenuRoutes from './MenuRoutes';

  type Props = {
    title?: string;
    children: React.ReactNode;
    renderTopBar?: React.ReactNode;
    bottomContent?: (args: { collapsed: boolean; toggle: () => void }) => React.ReactNode;
    animated?: boolean;
  };

  export default function AppLayout({
    title,
    children,
    renderTopBar,
    bottomContent,
    animated = true,
  }: Props) {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <SafeAreaView style={styles.container}>
        {renderTopBar !== undefined ? renderTopBar : (title ? <TopBar title={title} /> : null)}
        <View style={styles.contentInner}>{children}</View>
        <View>
          <MenuRoutes collapsed={collapsed} animated={animated}>
            {bottomContent?.({
              collapsed,
              toggle: () => setCollapsed(v => !v),
            })}
          </MenuRoutes>
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent'  },
    contentInner: { flex: 1, backgroundColor: 'transparent' }, 
    
  });
