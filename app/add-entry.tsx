import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { DEFAULT_CURRENCY } from '@/constants/currencies';
import { AppColors } from '@/constants/theme';
import { useExpenses } from '@/contexts/ExpensesContext';

export default function AddEntryScreen() {
  const router = useRouter();
  const { addEntry } = useExpenses();
  const [entryType, setEntryType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState(DEFAULT_CURRENCY);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  // Blinking cursor effect
  useEffect(() => {
    if (!isDescriptionFocused) {
      const cursorInterval = setInterval(() => {
        setIsCursorVisible((prev) => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [isDescriptionFocused]);

  const handleNumberPress = (num: string) => {
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else if (num === '.' && amount.includes('.')) {
      return;
    } else {
      setAmount((prev) => prev + num);
    }
  };

  const handleDeletePress = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount((prev) => prev.slice(0, -1));
    }
  };

  const handleCurrencyPress = () => {
    // TODO: Navigate to currency selector screen when implemented
    // router.push('/currency-selector');
  };

  const handleDescriptionFocus = () => {
    setIsDescriptionFocused(true);
    setIsCursorVisible(false);
    Keyboard.dismiss();
  };

  const handleDescriptionBlur = () => {
    setIsDescriptionFocused(false);
  };

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0 && description.trim()) {
      addEntry({
        type: entryType,
        amount: numericAmount,
        currency: currentCurrency,
        description: description.trim(),
      });
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={AppColors.black} />
        </TouchableOpacity>
      </View>

      {/* Expense/Income Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, entryType === 'expense' && styles.toggleButtonActive]}
          onPress={() => setEntryType('expense')}>
          <Text
            style={[
              styles.toggleButtonText,
              entryType === 'expense' && styles.toggleButtonTextActive,
            ]}>
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, entryType === 'income' && styles.toggleButtonActive]}
          onPress={() => setEntryType('income')}>
          <Text
            style={[
              styles.toggleButtonText,
              entryType === 'income' && styles.toggleButtonTextActive,
            ]}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Input Area */}
      <View style={styles.amountContainer}>
        <View style={styles.amountWrapper}>
          <Text style={[styles.amountText, amount === '0' ? styles.amountTextPlaceholder : styles.amountTextActive]}>
            {amount}
          </Text>
          {!isDescriptionFocused && (
            <View style={[styles.cursor, styles.cursorRight, { opacity: isCursorVisible ? 1 : 0 }]} />
          )}
        </View>
      </View>

      {/* Currency Selector */}
      <TouchableOpacity style={styles.currencySelector} onPress={handleCurrencyPress}>
        <Text style={styles.currencyText}>{currentCurrency}</Text>
        <IconSymbol name="chevron.down" size={16} color={AppColors.black} />
      </TouchableOpacity>

      {/* Description Input Area */}
      <View style={styles.descriptionContainer}>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Type description"
          placeholderTextColor={AppColors.greyDark}
          value={description}
          onChangeText={setDescription}
          onFocus={handleDescriptionFocus}
          onBlur={handleDescriptionBlur}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addDescriptionButton}>
          <Text style={styles.addDescriptionButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Numeric Keypad */}
      {!isDescriptionFocused && (
        <View style={styles.keypadContainer}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['.', '0', 'delete'],
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.keypadButton}
                  onPress={() => (key === 'delete' ? handleDeletePress() : handleNumberPress(key))}>
                  {key === 'delete' ? (
                    <IconSymbol name="delete.backward" size={28} color={AppColors.black} />
                  ) : (
                    <Text style={styles.keypadButtonText}>{key}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Submit Button - shown when description is focused */}
      {isDescriptionFocused && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add {entryType === 'expense' ? 'Expense' : 'Income'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 40,
    justifyContent: 'center',
    gap: 2,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: AppColors.white,
  },
  toggleButtonText: {
    fontFamily: 'OrelegaOne_400Regular',
    fontSize: 32,
    color: AppColors.greyMedium,
  },
  toggleButtonTextActive: {
    fontFamily: 'OrelegaOne_400Regular',
    color: AppColors.black,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 40,
    minHeight: 120,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cursor: {
    width: 4,
    height: 100,
    backgroundColor: AppColors.black,
  },
  cursorLeft: {
    marginRight: 4,
  },
  cursorRight: {
    marginLeft: 4,
  },
  amountText: {
    fontFamily: 'OrelegaOne_400Regular',
    fontSize: 100,
    textAlign: 'center',
    letterSpacing: -2,
  },
  amountTextPlaceholder: {
    color: AppColors.greyMedium,
  },
  amountTextActive: {
    color: AppColors.black,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.greyLight,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  currencyText: {
    fontFamily: 'InterTight_700Bold',
    fontSize: 16,
    color: AppColors.black,
    marginRight: 10,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.greyLight,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingRight: 12,
    minHeight: 56,
  },
  descriptionInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: AppColors.black,
    fontFamily: 'Inter_400Regular',
  },
  addDescriptionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addDescriptionButtonText: {
    fontSize: 20,
    color: AppColors.black,
    lineHeight: 24,
    fontWeight: '300',
  },
  keypadContainer: {
    backgroundColor: AppColors.greyLight,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 'auto',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  keypadButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: 10,
    marginHorizontal: 5,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  keypadButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 28,
    fontWeight: '400',
    color: AppColors.black,
  },
  submitButton: {
    backgroundColor: AppColors.black,
    borderRadius: 10,
    paddingVertical: 18,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: 'InterTight_700Bold',
    fontSize: 16,
    color: AppColors.white,
  },
});
