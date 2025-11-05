import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppColors } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('Splash screen mounted');
    const timer = setTimeout(() => {
      console.log('Navigating to tabs');
      router.replace('/(tabs)');
    }, 3000); // 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/cm-logo.svg')}
        style={styles.logo}
        contentFit="contain"
        onError={(error) => {
          console.log('Image load error:', error);
        }}
        onLoad={() => {
          console.log('Image loaded successfully');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

