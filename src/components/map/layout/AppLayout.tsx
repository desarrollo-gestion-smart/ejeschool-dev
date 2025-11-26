 import React from 'react';
  import { StyleSheet, View } from 'react-native';
   import { SafeAreaView } from 'react-native-safe-area-context';
 import TopBar from './TopBar';
  import useResponsive from '../../../types/useResponsive';

  type Props = {
    title?: string;
    children: React.ReactNode;
    renderTopBar?: React.ReactNode;
    // bottomContent?: (args: { collapsed: boolean; toggle: () => void }) => React.ReactNode;
  };

  export default function AppLayout({
    title,
    children,
    renderTopBar,
    // bottomContent,
  }: Props) {
    const {} = useResponsive();
    // const [collapsed, setCollapsed] = React.useState(false);
    return (
      <SafeAreaView style={styles.container}>
        {renderTopBar ?? <TopBar title={title} />}
        <View style={[styles.contentInner]}>{children}</View>
        
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent', position: 'relative' },
    content: { flex: 1 },
   contentInner: { flex: 1, backgroundColor: 'peachpuff' },
  });
