import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/theme';

export default function AddEntryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Entry Screen</Text>
      <Text style={styles.subtext}>This screen will be implemented next</Text>
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
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: AppColors.black,
    fontFamily: 'Inter_600SemiBold',
  },
  subtext: {
    fontSize: 16,
    color: AppColors.greyDark,
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
});

