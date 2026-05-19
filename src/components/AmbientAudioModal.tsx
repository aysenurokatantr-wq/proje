import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme, Radius, Spacing } from '../theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AmbientAudioModal({ visible, onClose }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [ambientOn, setAmbientOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'1x' | '1.5x' | '2x'>('1x');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Ortam Sesi</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={18} color={colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Ambient toggle */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Ortam arka planı</Text>
          <Switch
            value={ambientOn}
            onValueChange={setAmbientOn}
            trackColor={{ false: colors.grayMid, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        {/* Playback controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="play-skip-back" size={24} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="play-skip-forward" size={24} color={colors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Autopilot Pause */}
        <View style={styles.sectionRow}>
          <Text style={styles.rowLabel}>Otomatik Duraklama</Text>
          <Text style={styles.valueText}>3s</Text>
        </View>
        <View style={styles.sliderRow}>
          <View style={styles.sliderTrack}>
            <View style={styles.sliderFill} />
          </View>
          <View style={styles.premiumBadge}>
            <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Voice Speed */}
        <Text style={styles.sectionLabel}>Ses Hızı</Text>
        <View style={styles.speedRow}>
          {(['1x', '1.5x', '2x'] as const).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.speedBtn, speed === s && styles.speedBtnActive]}
              onPress={() => setSpeed(s)}
            >
              <Text style={[styles.speedText, speed === s && styles.speedTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Loop Autopilot */}
        <View style={styles.row}>
          <Text style={[styles.rowLabel, styles.disabledText]}>Otomatik Döngü...</Text>
          <View style={styles.rowRight}>
            <Switch
              value={false}
              disabled
              trackColor={{ false: colors.grayMid, true: colors.primary }}
              thumbColor={colors.white}
            />
            <View style={styles.premiumBadgeInline}>
              <Ionicons name="lock-closed" size={11} color={colors.purple} />
              <Text style={styles.premiumBadgeInlineText}>Premium</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Background Music */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Arka Plan Müziği</Text>
        </View>

        {/* Done */}
        <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
          <Text style={styles.doneBtnText}>Tamam</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const useStyles = makeStyles((colors) => ({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  disabledText: {
    color: colors.gray,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: Spacing.md,
  },
  sideBtn: {
    width: 64,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayMid,
    marginVertical: 4,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 4,
  },
  valueText: {
    fontSize: 16,
    color: colors.grayDark,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.grayMid,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    width: '30%',
    height: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: 3,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    gap: 4,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
    paddingTop: 10,
    paddingBottom: 8,
  },
  speedRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
  },
  speedBtn: {
    flex: 1,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedBtnActive: {
    backgroundColor: colors.primaryLight,
  },
  speedText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.grayDark,
  },
  speedTextActive: {
    color: colors.primary,
  },
  premiumBadgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.purple,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  premiumBadgeInlineText: {
    fontSize: 12,
    color: colors.purple,
    fontWeight: '600',
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: Radius.full,
    paddingVertical: 14,
    gap: 8,
    marginTop: Spacing.md,
  },
  doneBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
  },
}));
