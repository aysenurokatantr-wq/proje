import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../theme';
import { categories, Category } from '../data/affirmations';

type Props = {
  visible: boolean;
  selectedId: string;
  onSelect: (category: Category) => void;
  onClose: () => void;
};

export default function CategorySheet({ visible, selectedId, onSelect, onClose }: Props) {
  const renderIcon = (cat: Category) => {
    const size = 22;
    const color = cat.premium ? Colors.gray : cat.color;
    if (cat.iconLib === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={cat.icon as any} size={size} color={color} />;
    }
    if (cat.iconLib === 'FontAwesome5') {
      return <FontAwesome5 name={cat.icon as any} size={size} color={color} />;
    }
    return <Ionicons name={cat.icon as any} size={size} color={color} />;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Choose your vibe</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedId;
            return (
              <TouchableOpacity
                style={[styles.row, isSelected && styles.rowSelected]}
                onPress={() => {
                  if (!item.premium) {
                    onSelect(item);
                  }
                }}
                activeOpacity={item.premium ? 1 : 0.7}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { borderColor: item.premium ? Colors.grayMid : item.color },
                    item.premium && styles.iconCircleLocked,
                  ]}
                >
                  {renderIcon(item)}
                </View>
                <View style={styles.rowContent}>
                  <Text style={[styles.rowName, item.premium && styles.rowNameLocked]}>
                    {item.name}
                  </Text>
                  {item.premium && (
                    <Text style={styles.premiumText}>Requires Premium</Text>
                  )}
                </View>
                {item.premium ? (
                  <Ionicons name="lock-closed" size={18} color={Colors.grayMid} />
                ) : isSelected ? (
                  <View style={styles.selectedDot} />
                ) : (
                  <View style={styles.emptyDot} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingBottom: 40,
    paddingHorizontal: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.grayMid,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.grayDark,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: 4,
  },
  rowSelected: {
    backgroundColor: Colors.grayLight,
    borderWidth: 1.5,
    borderColor: Colors.blue,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    backgroundColor: Colors.white,
  },
  iconCircleLocked: {
    backgroundColor: Colors.grayLight,
  },
  rowContent: {
    flex: 1,
  },
  rowName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.black,
  },
  rowNameLocked: {
    color: Colors.gray,
  },
  premiumText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  selectedDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.blue,
    opacity: 0.3,
  },
  emptyDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.grayMid,
  },
});
