import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeStyles, useTheme, Radius, Spacing } from '../theme';

type Props = {
  onDone: () => void;
};

const FOCUS_OPTIONS = [
  { id: 'selfLove', label: 'Öz Sevgi', iconLib: 'Ionicons', icon: 'heart', color: '#F04E6D' },
  { id: 'confidence', label: 'Özgüven', iconLib: 'Ionicons', icon: 'flash', color: '#8B5CF6' },
  { id: 'abundance', label: 'Bolluk', iconLib: 'MaterialCommunityIcons', icon: 'diamond-stone', color: '#10B981' },
  { id: 'gratitude', label: 'Şükran', iconLib: 'Ionicons', icon: 'sparkles', color: '#14B8A6' },
  { id: 'boundaries', label: 'Sınırlar', iconLib: 'Ionicons', icon: 'shield', color: '#3B82F6' },
  { id: 'luckyGirl', label: 'Şanslı Kız', iconLib: 'FontAwesome5', icon: 'star', color: '#F59E0B' },
];

export default function OnboardingScreen({ onDone }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [name, setName] = useState('');
  const [focus, setFocus] = useState<string | null>(null);

  const finish = async () => {
    await AsyncStorage.multiSet([
      ['user_name', name.trim() || 'Sen'],
      ['user_focus', focus ?? 'selfLove'],
      ['onboarding_done', 'true'],
    ]);
    onDone();
  };

  const renderIcon = (option: typeof FOCUS_OPTIONS[0], active: boolean) => {
    const color = active ? '#FFFFFF' : option.color;
    const size = 24;
    if (option.iconLib === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={option.icon as any} size={size} color={color} />;
    }
    if (option.iconLib === 'FontAwesome5') {
      return <FontAwesome5 name={option.icon as any} size={size} color={color} />;
    }
    return <Ionicons name={option.icon as any} size={size} color={color} />;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.inner, { paddingTop: insets.top + Spacing.xl }]}>
        {/* Progress dots */}
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.dot, i <= step && styles.dotActive]}
            />
          ))}
        </View>

        {step === 0 && (
          <View style={styles.stepContent}>
            <View style={styles.heartWrap}>
              <Ionicons name="heart" size={56} color={colors.primary} />
            </View>
            <Text style={styles.welcomeTitle}>Hoş Geldin</Text>
            <Text style={styles.welcomeDesc}>
              Her gün daha çok kendin olmaya bir adım daha yaklaşacaksın. Bu yolculuğa
              birlikte başlayalım.
            </Text>
            <TouchableOpacity style={styles.cta} onPress={() => setStep(1)}>
              <LinearGradient
                colors={[colors.primary, '#FF7090']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Başla</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>Adın nedir?</Text>
            <Text style={styles.subtitle}>
              Olumlamalarımız sana sesleneceği için adını öğrenmek istiyoruz.
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Adın..."
              placeholderTextColor={colors.gray}
              autoFocus
              maxLength={30}
            />
            <TouchableOpacity
              style={[styles.cta, !name.trim() && styles.ctaDisabled]}
              disabled={!name.trim()}
              onPress={() => setStep(2)}
            >
              <LinearGradient
                colors={[colors.primary, '#FF7090']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Devam</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <ScrollView
            contentContainerStyle={styles.stepContentScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Bugün neye odaklanmak istersin?</Text>
            <Text style={styles.subtitle}>
              Sana özel olumlamalarını seçtiğin alana göre getireceğiz.
            </Text>
            <View style={styles.focusGrid}>
              {FOCUS_OPTIONS.map((option) => {
                const active = focus === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.focusBtn,
                      active && { backgroundColor: option.color, borderColor: option.color },
                    ]}
                    onPress={() => setFocus(option.id)}
                  >
                    {renderIcon(option, active)}
                    <Text style={[styles.focusBtnText, active && styles.focusBtnTextActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={[styles.cta, !focus && styles.ctaDisabled]}
              disabled={!focus}
              onPress={finish}
            >
              <LinearGradient
                colors={[colors.primary, '#FF7090']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Yolculuğa Başla</Text>
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.grayMid,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  stepContentScroll: {
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  heartWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  welcomeTitle: {
    fontFamily: 'Georgia',
    fontSize: 36,
    color: colors.black,
    textAlign: 'center',
  },
  welcomeDesc: {
    fontSize: 16,
    color: colors.grayDark,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 28,
    color: colors.black,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  subtitle: {
    fontSize: 15,
    color: colors.grayDark,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  input: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 18,
    color: colors.black,
    fontFamily: 'Georgia',
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  focusBtn: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.grayMid,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  focusBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },
  focusBtnTextActive: {
    color: '#FFFFFF',
  },
  cta: {
    alignSelf: 'stretch',
    marginTop: Spacing.md,
  },
  ctaDisabled: {
    opacity: 0.4,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.full,
    paddingVertical: 16,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
}));
