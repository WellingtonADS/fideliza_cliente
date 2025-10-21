import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import IconComponent from './IconComponent';
import ThemedText from './ThemedText';
import { colors } from '../theme/colors';
import { AppIconKey } from './iconNames';

type Props = {
  icon: AppIconKey;
  title: string;
  onActionPress?: () => void;
  actionLabel?: string;
  style?: ViewStyle;
};

const TopBar: React.FC<Props> = ({ icon, title, onActionPress, actionLabel = 'Voltar', style }) => {
  return (
    <View style={[styles.header, style]}>
      <IconComponent icon={icon} size={26} color={colors.text} />
      <ThemedText variant="h2" style={styles.headerText}>{title}</ThemedText>
      {onActionPress ? (
        <TouchableOpacity onPress={onActionPress} style={styles.actionButton}>
          <ThemedText style={styles.actionText}>{actionLabel}</ThemedText>
        </TouchableOpacity>
      ) : <View style={{ width: 64 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
  },
  headerText: {
    marginLeft: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: 'bold',
  },
});

export default TopBar;
