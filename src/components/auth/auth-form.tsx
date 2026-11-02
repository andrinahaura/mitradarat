import { SymbolView } from 'expo-symbols';
import { type ReactNode, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { Brand, Gutter, PillInput, PrimaryButton, Radius, Spacing, Type } from '@/constants/theme';
import type { SymbolName } from '@/data/home';

/** Shared frame of Masuk, Daftar and Lupa kata sandi (reference 1, top row). */
export function AuthScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <SymbolView
            name={{ ios: 'bus', android: 'directions_bus', web: 'directions_bus' }}
            size={28}
            tintColor={Brand.textOnPrimary}
          />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

type AuthFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  icon?: SymbolName;
  /** Renders a show / hide toggle and hides the text by default. */
  password?: boolean;
  hint?: string;
};

export function AuthField({ label, icon, password, hint, ...input }: AuthFieldProps) {
  const [hidden, setHidden] = useState(true);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          {...input}
          secureTextEntry={password ? hidden : undefined}
          placeholderTextColor={Brand.textMuted}
          style={styles.input}
          accessibilityLabel={label}
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi'}>
            <SymbolView
              name={
                hidden
                  ? { ios: 'eye', android: 'visibility', web: 'visibility' }
                  : { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
              }
              size={18}
              tintColor={Brand.textSecondary}
            />
          </Pressable>
        ) : (
          icon && <SymbolView name={icon} size={18} tintColor={Brand.textMuted} />
        )}
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

export function AuthButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      accessibilityRole="button">
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

/** One line of text with a tappable link at the end, e.g. "Belum punya akun? Daftar". */
export function AuthLink({ text, link, onPress }: { text: string; link: string; onPress: () => void }) {
  return (
    <Text style={styles.footer}>
      {text}{' '}
      <Text style={styles.link} onPress={onPress} accessibilityRole="link">
        {link}
      </Text>
    </Text>
  );
}

export function AuthError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <Text style={styles.error} accessibilityLiveRegion="polite">
      {children}
    </Text>
  );
}

export const authStyles = StyleSheet.create({
  link: {
    ...Type.labelSmall,
    fontSize: 14,
    color: Brand.primary,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  content: {
    paddingHorizontal: Gutter + Spacing.one,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  brand: {
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  title: {
    ...Type.headlineLarge,
    color: Brand.text,
    textAlign: 'center',
  },
  subtitle: {
    ...Type.body,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  field: {
    gap: Spacing.two - 2,
  },
  label: {
    ...Type.labelSmall,
    fontSize: 14,
    color: Brand.text,
  },
  inputRow: {
    ...PillInput,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontSize: 16,
    color: Brand.text,
  },
  hint: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  button: {
    ...PrimaryButton,
    marginTop: Spacing.one,
  },
  buttonPressed: {
    backgroundColor: Brand.primaryPressed,
  },
  buttonText: {
    ...Type.label,
    color: Brand.textOnPrimary,
  },
  footer: {
    ...Type.body,
    fontSize: 14,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  link: {
    fontWeight: '600',
    color: Brand.primary,
  },
  error: {
    ...Type.bodySmall,
    fontWeight: '600',
    color: '#B42318',
  },
});
