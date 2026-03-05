import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { useAuth } from "@/src/features/auth";
import { useUIStore } from "@/src/store/useUIStore";
import { useThemeColors } from "@/src/utils/useThemeColors";

/**
 * Settings screen — language, theme, background sync, sign out.
 * All dark-mode aware via useThemeColors.
 */
export default function SettingsScreen() {
	const { t, i18n } = useTranslation();
	const c = useThemeColors();
	const { signOut } = useAuth();
	const { themeMode, setThemeMode, backgroundSyncEnabled, toggleBackgroundSync } = useUIStore();

	const handleLanguageChange = (lang: string) => {
		i18n.changeLanguage(lang);
	};

	return (
		<ScrollView style={[styles.container, { backgroundColor: c.bg }]} contentContainerStyle={styles.content}>
			{/* ── Language ───────────────────────────────────────────── */}
			<Text style={[styles.sectionTitle, { color: c.textSecondary }]}>{t("settings.language").toUpperCase()}</Text>
			<View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
				{[
					{ key: "en", label: t("settings.english") },
					{ key: "vi", label: t("settings.vietnamese") },
				].map((lang, idx) => (
					<Pressable key={lang.key} style={[styles.cardRow, idx > 0 && { borderTopWidth: 1, borderTopColor: c.border }]} onPress={() => handleLanguageChange(lang.key)}>
						<Text style={[styles.rowLabel, { color: c.text }]}>{lang.label}</Text>
						{i18n.language === lang.key && <Text style={{ color: c.primary, fontSize: 16 }}>✓</Text>}
					</Pressable>
				))}
			</View>

			{/* ── Theme ──────────────────────────────────────────────── */}
			<Text style={[styles.sectionTitle, { color: c.textSecondary }]}>{t("settings.theme").toUpperCase()}</Text>
			<View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
				{(["light", "dark", "system"] as const).map((mode, idx) => (
					<Pressable key={mode} style={[styles.cardRow, idx > 0 && { borderTopWidth: 1, borderTopColor: c.border }]} onPress={() => setThemeMode(mode)}>
						<Text style={[styles.rowLabel, { color: c.text }]}>{t(`settings.${mode}`)}</Text>
						{themeMode === mode && <Text style={{ color: c.primary, fontSize: 16 }}>✓</Text>}
					</Pressable>
				))}
			</View>

			{/* ── Account ────────────────────────────────────────────── */}
			<Text style={[styles.sectionTitle, { color: c.textSecondary }]}>{t("settings.account").toUpperCase()}</Text>
			<View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
				<Pressable style={styles.cardRow} onPress={signOut}>
					<Text style={[styles.rowLabel, { color: c.danger }]}>{t("auth.signOut")}</Text>
				</Pressable>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { padding: 16, paddingBottom: 40 },
	sectionTitle: {
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 1,
		marginTop: 24,
		marginBottom: 8,
		marginLeft: 4,
	},
	card: {
		borderWidth: 1,
		borderRadius: 12,
		overflow: "hidden",
	},
	cardRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	rowLabel: {
		fontSize: 16,
	},
});
