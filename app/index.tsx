import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconPill, PrimaryButton } from '../components/PrimaryButton';
import { usePilot } from '../lib/pilot-store';
import { colors, radius, shadows } from '../lib/theme';

export default function PilotEntry() {
  const { report, startPilot, tier, user } = usePilot();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const { width } = useWindowDimensions();
  const isWide = width >= 880;

  const nameValid = fullName.trim().length >= 2;
  const phoneDigits = normalizePhoneDigits(phone);
  const phoneValid = isValidPilotPhone(phone);
  const gradeValid = grade !== null;
  const ageValid = age !== null && age >= 12 && age <= 17;

  const canStart = useMemo(() => nameValid && phoneValid && gradeValid && ageValid, [ageValid, gradeValid, nameValid, phoneValid]);

  if (user && report) return <Redirect href="/results" />;
  if (user && tier) return <Redirect href="/diagnostic" />;
  if (user) return <Redirect href={'/test-select' as never} />;

  async function handleStart() {
    setAttemptedSubmit(true);
    if (!canStart || isSubmitting) return;
    if (age === null || grade === null) return;
    setIsSubmitting(true);
    await startPilot({
      fullName: fullName.trim(),
      phone: formatPilotPhone(phoneDigits),
      age,
      grade,
    });
  }

  const availableAges = grade === null ? [] : getAgesForGrade(grade);

  function handleGradeSelect(nextGrade: number) {
    const nextAges = getAgesForGrade(nextGrade);
    setGrade(nextGrade);
    if (age === null || !nextAges.includes(age)) setAge(null);
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.primary }}>
      <LinearGradient colors={colors.gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, padding: 22 }}
          >
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                width: '100%',
                maxWidth: 1100,
                justifyContent: 'center',
                gap: 24,
                flexDirection: isWide ? 'row' : 'column',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1, width: '100%', gap: 26 }}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText} selectable>
                    UM
                  </Text>
                  <View style={styles.logoRing} />
                </View>

                <View style={{ gap: 12 }}>
                  <Text style={{ color: colors.paper, fontSize: isWide ? 48 : 40, fontWeight: '900', letterSpacing: 0 }} selectable>
                    Ursa Major
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.82)', fontSize: 18, lineHeight: 27, maxWidth: 560 }} selectable>
                    Пилотная диагностика для школьников.
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  <IconPill icon="user" label="Школьник" />
                  <IconPill icon="message-circle" label="Без SMS" />
                  <IconPill icon="bar-chart-2" label="Basic + PRO" />
                </View>
              </View>

              <View style={styles.formCard}>
                <View style={{ gap: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: 0 }} selectable>
                    Начать диагностику
                  </Text>
                </View>

                <Field
                  helper={nameValid ? 'Готово' : 'Минимум 2 символа'}
                  icon="user"
                  label="ФИО или имя"
                  placeholder="Например, Айдана"
                  showStatus={attemptedSubmit || fullName.length > 0}
                  status={nameValid ? 'valid' : 'invalid'}
                  value={fullName}
                  onChangeText={setFullName}
                />
                <Field
                  helper={phoneValid ? 'Телефон будет сохранен без SMS' : 'Введите 11 цифр: +7 700 000 00 00'}
                  icon="phone"
                  label="Телефон"
                  value={phone}
                  onChangeText={(value) => setPhone(formatPilotPhone(value))}
                  placeholder="+7 700 000 00 00"
                  keyboardType="phone-pad"
                  showStatus={attemptedSubmit || phone.length > 0}
                  status={phoneValid ? 'valid' : 'invalid'}
                />
                <ToggleGroup
                  helper={grade === null ? 'Выбери класс, чтобы показать подходящий возраст.' : `${grade} класс выбран.`}
                  label="Класс"
                  options={[6, 7, 8, 9, 10, 11]}
                  selected={grade}
                  status={gradeValid ? 'valid' : attemptedSubmit ? 'invalid' : 'neutral'}
                  onSelect={handleGradeSelect}
                />

                <ToggleGroup
                  helper={
                    grade === null
                      ? 'Сначала выбери класс.'
                      : age === null
                        ? `Выбери возраст для ${grade} класса.`
                        : 'Возраст подходит для выбранного класса.'
                  }
                  label="Возраст"
                  options={availableAges}
                  selected={age}
                  status={ageValid ? 'valid' : attemptedSubmit ? 'invalid' : 'neutral'}
                  onSelect={setAge}
                />

                <PrimaryButton
                  disabled={isSubmitting}
                  icon="arrow-right"
                  label={isSubmitting ? 'Запускаем...' : canStart ? 'Начать путь' : 'Проверить данные'}
                  onPress={handleStart}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function ToggleGroup({
  helper,
  label,
  onSelect,
  options,
  selected,
  status = 'neutral',
}: {
  helper: string;
  label: string;
  onSelect: (value: number) => void;
  options: number[];
  selected: number | null;
  status?: 'valid' | 'invalid' | 'neutral';
}) {
  const helperColor = status === 'valid' ? colors.green : status === 'invalid' ? colors.red : colors.muted;

  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.label} selectable>
        {label}
      </Text>
      {options.length > 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {options.map((item) => {
            const active = selected === item;
            return (
              <Pressable
                key={item}
                onPress={() => onSelect(item)}
                style={{
                  flexGrow: 1,
                  flexBasis: 56,
                  minHeight: 48,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? colors.primary : '#F7F7FB',
                  borderWidth: 1,
                  borderColor: active ? colors.primary : '#ECEEF5',
                }}
              >
                <Text style={{ color: active ? colors.paper : colors.text, fontWeight: '900' }} selectable>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      <Text style={{ color: helperColor, fontSize: 12, fontWeight: '800' }} selectable>
        {helper}
      </Text>
    </View>
  );
}

function Field({
  helper,
  icon,
  keyboardType,
  label,
  onChangeText,
  placeholder,
  showStatus,
  status,
  value,
}: {
  helper: string;
  icon: keyof typeof Feather.glyphMap;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad';
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  showStatus: boolean;
  status: 'valid' | 'invalid';
  value: string;
}) {
  const activeStatus = showStatus ? status : 'neutral';
  const isValid = activeStatus === 'valid';
  const isInvalid = activeStatus === 'invalid';
  const [focused, setFocused] = useState(false);
  const statusColor = isValid ? colors.green : isInvalid ? colors.red : colors.muted;

  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label} selectable>
        {label}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: focused ? colors.primary : isValid ? '#BBF7D0' : isInvalid ? '#FECACA' : '#ECEEF5',
            borderWidth: 1,
            backgroundColor: isValid ? '#F0FDF4' : isInvalid ? '#FEF2F2' : '#F8F9FC',
          },
        ]}
      >
        <Feather name={icon} size={18} color={statusColor} />
        <TextInput
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor="#9AA3AF"
          style={[styles.input, webInputReset]}
          value={value}
        />
        {showStatus ? <Feather name={isValid ? 'check-circle' : 'alert-circle'} size={18} color={statusColor} /> : null}
      </View>
      <Text style={{ color: statusColor, fontSize: 12, fontWeight: '800' }} selectable>
        {helper}
      </Text>
    </View>
  );
}

function normalizePhoneDigits(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) return `7${digits.slice(1, 11)}`;
  if (digits.startsWith('7')) return digits.slice(0, 11);
  return `7${digits}`.slice(0, 11);
}

function formatPilotPhone(value: string) {
  const digits = normalizePhoneDigits(value);
  const country = digits.slice(0, 1);
  const operator = digits.slice(1, 4);
  const first = digits.slice(4, 7);
  const second = digits.slice(7, 9);
  const third = digits.slice(9, 11);
  return [
    country ? `+${country}` : '',
    operator,
    first,
    second,
    third,
  ]
    .filter(Boolean)
    .join(' ');
}

function isValidPilotPhone(value: string) {
  const digits = normalizePhoneDigits(value);
  return digits.length === 11 && digits.startsWith('7');
}

function getAgesForGrade(grade: number) {
  const agesByGrade: Record<number, number[]> = {
    6: [12, 13],
    7: [13, 14],
    8: [14, 15],
    9: [15, 16],
    10: [16, 17],
    11: [17],
  };
  return agesByGrade[grade] ?? [12, 13, 14, 15, 16, 17];
}

const styles = {
  formCard: {
    ...shadows.lg,
    backgroundColor: colors.paper,
    borderRadius: radius.xl,
    padding: 24,
    gap: 18,
    width: '100%' as const,
    maxWidth: 480,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
  },
  inputWrapper: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECEEF5',
    paddingHorizontal: 14,
    backgroundColor: '#F8F9FC',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900' as const,
    textTransform: 'uppercase' as const,
  },
  logoContainer: {
    ...shadows.lg,
    width: 132,
    height: 132,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  logoRing: {
    position: 'absolute' as const,
    width: 154,
    height: 154,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    transform: [{ rotate: '45deg' }],
  },
  logoText: {
    fontSize: 58,
    fontWeight: '900' as const,
    color: colors.paper,
    letterSpacing: 0,
  },
};

const webInputReset = {
  outlineColor: 'transparent',
  outlineOffset: 0,
  outlineStyle: 'none',
  outlineWidth: 0,
} as unknown as { outlineWidth: number };
