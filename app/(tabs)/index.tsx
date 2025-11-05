import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import { useExpenses } from '@/contexts/ExpensesContext';

export default function BalanceScreen() {
  const router = useRouter();
  const { entries, isLoading } = useExpenses();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const hasEntries = entries.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Balance</Text>
      </View>

      {!hasEntries ? (
        <View style={styles.emptyState}>
          <Image
            source={require('@/assets/images/cm-empty-state.svg')}
            style={styles.emptyStateImage}
            contentFit="contain"
          />
          <Text style={styles.emptyStateTitle}>Nothing to see here</Text>
          <Text style={styles.emptyStateSubtitle}>Add your first expense or income</Text>
        </View>
      ) : (
        <ScrollView style={styles.entriesList} contentContainerStyle={styles.entriesListContent}>
          <Text style={styles.entriesPlaceholder}>Entries will be displayed here</Text>
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => router.push('/add-entry')}
        activeOpacity={0.8}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  header: {
    paddingTop:80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.black,
    fontFamily: 'Inter_700Bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: AppColors.black,
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: AppColors.greyDark,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  entriesList: {
    flex: 1,
  },
  entriesListContent: {
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: AppColors.greyDark,
    textAlign: 'center',
    marginTop: 100,
    fontFamily: 'Inter_400Regular',
  },
  plusButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppColors.black,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  plusButtonText: {
    color: AppColors.white,
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 32,
  },
});
