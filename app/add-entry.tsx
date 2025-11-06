import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const descriptionInputRef = useRef<TextInput>(null);
  const amountInputRef = useRef<TextInput>(null);

  // Auto-focus amount input after page transition completes
  useFocusEffect(
    useCallback(() => {
      let timer: ReturnType<typeof setTimeout> | null = null;
      
      // Wait for page transition animation to complete before showing keyboard
      // Use a longer delay to ensure React Navigation transition (~350-400ms) is fully complete
      // This ensures keyboard slides from bottom, not from right with page transition
      timer = setTimeout(() => {
        // Use double requestAnimationFrame to ensure we're past all transition animations
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            amountInputRef.current?.focus();
            setIsAmountFocused(true);
          });
        });
      }, 600);
      
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, [])
  );

  // Blinking cursor effect
  useEffect(() => {
    if (isAmountFocused) {
      const cursorInterval = setInterval(() => {
        setIsCursorVisible((prev) => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [isAmountFocused]);

  const handleAmountChange = (text: string) => {
    // Allow numbers, comma, and period - convert period to comma
    let cleanedValue = text.replace(/[^0-9.,]/g, '');
    // Replace period with comma (use comma as decimal separator)
    cleanedValue = cleanedValue.replace(/\./g, ',');
    
    // Ensure only one decimal separator (comma)
    const parts = cleanedValue.split(',');
    if (parts.length > 2) {
      return; // Prevent multiple commas
    }
    
    // Limit to 2 digits after comma - prevent input if already at limit
    if (parts.length === 2 && parts[1].length > 2) {
      // If we already have 2 digits after comma, don't allow more
      // This prevents the jumping effect by not updating the value
      return;
    }
    
    let newAmount: string;
    
    // If empty, set to '0' as placeholder
    if (cleanedValue === '') {
      newAmount = '0';
    } else {
      // If current amount is "0" (placeholder) and user types a digit, replace "0"
      if (amount === '0' && cleanedValue !== '0' && cleanedValue !== '0,') {
        // If it starts with "0" followed by digits (like "01", "02"), remove leading zeros
        if (cleanedValue.match(/^0+[1-9]/)) {
          newAmount = cleanedValue.replace(/^0+/, '');
        } else if (cleanedValue.startsWith('0,')) {
          // Keep "0," as is
          newAmount = cleanedValue;
        } else {
          // For single digits or numbers starting with 1-9, use directly
          newAmount = cleanedValue;
        }
      } else {
        newAmount = cleanedValue;
      }
    }
    
    setAmount(newAmount);
  };

  const handleAmountFocus = () => {
    setIsAmountFocused(true);
    setIsCursorVisible(true);
  };

  const handleAmountBlur = () => {
    setIsAmountFocused(false);
    setIsCursorVisible(false);
  };

  const handleCurrencyPress = () => {
    // TODO: Navigate to currency selector screen when implemented
    // router.push('/currency-selector');
  };


  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
    descriptionInputRef.current?.blur();
    amountInputRef.current?.blur();
  };

  const handleSubmit = () => {
    // Convert comma to period for parsing (JavaScript parseFloat uses period)
    const amountForParsing = amount.replace(/,/g, '.');
    const numericAmount = parseFloat(amountForParsing);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
      enabled={false}>
      <View style={styles.containerContent}>
          {/* Header with Back Button */}
          <Pressable style={styles.header} onPress={handleDismissKeyboard}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={AppColors.black} />
        </TouchableOpacity>
      </Pressable>

      {/* Expense/Income Toggle */}
      <Pressable style={styles.toggleContainer} onPress={handleDismissKeyboard}>
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
      </Pressable>

      {/* Amount Input Area */}
      <Pressable style={styles.amountContainer} onPress={() => amountInputRef.current?.focus()}>
        <View style={styles.amountWrapper}>
          <TextInput
            ref={amountInputRef}
            style={[styles.amountText, amount === '0' ? styles.amountTextPlaceholder : styles.amountTextActive]}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            onFocus={handleAmountFocus}
            onBlur={handleAmountBlur}
            selectTextOnFocus={false}
            caretHidden={true}
            showSoftInputOnFocus={true}
            blurOnSubmit={false}
          />
          {isAmountFocused && (
            <View style={[styles.cursor, { opacity: isCursorVisible ? 1 : 0 }]} />
          )}
        </View>
      </Pressable>

      {/* Currency Selector */}
      <TouchableOpacity style={styles.currencySelector} onPress={handleCurrencyPress}>
        <Text style={styles.currencyText}>{currentCurrency}</Text>
        <IconSymbol name="chevron.down" size={16} color={AppColors.black} />
      </TouchableOpacity>

      {/* Description Input Area */}
      <View style={styles.descriptionContainer}>
        <TextInput
          ref={descriptionInputRef}
          style={styles.descriptionInput}
          placeholder="Type description"
          placeholderTextColor={AppColors.greyMedium}
          value={description}
          onChangeText={setDescription}
          returnKeyType="done"
          keyboardType="default"
          autoCapitalize="sentences"
          editable={true}
          textContentType="none"
          autoCorrect={true}
          blurOnSubmit={false}
        />
        <TouchableOpacity style={styles.addDescriptionButton}>
          <Text style={styles.addDescriptionButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: 60,
  },
  containerContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
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
    marginTop: 0,
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
    fontSize: 28,
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
    position: 'relative',
  },
  cursor: {
    width: 4,
    height: 100,
    backgroundColor: AppColors.black,
    position: 'absolute',
    right: -4,
  },
  amountText: {
    fontFamily: 'OrelegaOne_400Regular',
    fontSize: 80,
    textAlign: 'center',
    letterSpacing: -2,
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 16,
  },
  currencyText: {
    fontFamily: 'OrelegaOne_400Regular',
    fontSize: 20,
    color: AppColors.black,
    marginRight: 10,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.greyLight,
    borderRadius: 12,
    paddingRight: 16,
    minHeight: 88,
    marginHorizontal: 20,
    marginBottom: 20,
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
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addDescriptionButtonText: {
    fontSize: 20,
    color: AppColors.black,
    lineHeight: 22,
    fontWeight: '500',
  },
});
