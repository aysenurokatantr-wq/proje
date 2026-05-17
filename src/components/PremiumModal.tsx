import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const features = [
  {
    icon: 'sparkles' as const,
    lib: 'Ionicons' as const,
    text: 'Tailored reflections for every day',
  },
  {
    icon: 'sync-circle' as const,
    lib: 'Ionicons' as const,
    text: 'Syncs with your cycles',
  },
  {
    icon: 'brain' as const,
    lib: 'MaterialCommunityIcons' as const,
    text: 'Guides you into deeper awareness',
  },
];

export default function PremiumModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={18} color={Colors.grayDark} />
          </TouchableOpacity>

          <Ionicons
            name="documents"
            size={56}
            color={Colors.black}
            style={styles.icon}
          />

          <Text style={styles.title}>Unlock Personalized Prompts</Text>
          <Text style={styles.description}>
            Get journal prompts that evolve with your manifestation journey—perfectly
            aligned with your affirmations.
          </Text>

          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              {f.lib === 'MaterialCommunityIcons' ? (
                <MaterialCommunityIcons
                  name={f.icon as any}
                  size={24}
                  color={Colors.purple}
                />
              ) : (
                <Ionicons name={f.icon as any} size={24} color={Colors.purple} />
              )}
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.ctaBtn} onPress={onClose}>
            <MaterialCommunityIcons name="crown" size={20} color={Colors.purple} />
            <Text style={styles.ctaBtnText}>Try Personalized Prompts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.grayLight,
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
    backgroundColor: Colors.grayMid,
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
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 15,
    color: Colors.grayDark,
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
    color: Colors.black,
    flex: 1,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.purpleLight,
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
    color: Colors.purple,
  },
});
