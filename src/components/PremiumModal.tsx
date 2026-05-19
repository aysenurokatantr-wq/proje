import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { makeStyles, useTheme, Radius, Spacing } from '../theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const features = [
  {
    icon: 'sparkles' as const,
    lib: 'Ionicons' as const,
    text: 'Her güne özel yansımalar',
  },
  {
    icon: 'sync-circle' as const,
    lib: 'Ionicons' as const,
    text: 'Döngülerinle senkronize',
  },
  {
    icon: 'brain' as const,
    lib: 'MaterialCommunityIcons' as const,
    text: 'Seni daha derin farkındalığa yönlendirir',
  },
];

export default function PremiumModal({ visible, onClose }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={18} color={colors.grayDark} />
          </TouchableOpacity>

          <Ionicons
            name="documents"
            size={56}
            color={colors.black}
            style={styles.icon}
          />

          <Text style={styles.title}>Kişiselleştirilmiş Soruların Kilidini Aç</Text>
          <Text style={styles.description}>
            Manifesto yolculuğunla birlikte gelişen, olumlamalarınla mükemmel uyum
            içinde günlük soruları al.
          </Text>

          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              {f.lib === 'MaterialCommunityIcons' ? (
                <MaterialCommunityIcons
                  name={f.icon as any}
                  size={24}
                  color={colors.purple}
                />
              ) : (
                <Ionicons name={f.icon as any} size={24} color={colors.purple} />
              )}
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.ctaBtn} onPress={onClose}>
            <MaterialCommunityIcons name="crown" size={20} color={colors.purple} />
            <Text style={styles.ctaBtnText}>Kişiselleştirilmiş Soruları Dene</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const useStyles = makeStyles((colors) => ({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: colors.grayLight,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grayMid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.black,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 15,
    color: colors.grayDark,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    alignSelf: 'stretch',
    marginBottom: Spacing.md,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    flex: 1,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purpleLight,
    borderRadius: Radius.full,
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    gap: 10,
    marginTop: Spacing.md,
    alignSelf: 'stretch',
  },
  ctaBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.purple,
  },
}));
