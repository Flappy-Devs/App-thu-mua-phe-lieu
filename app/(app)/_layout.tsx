import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function AppLayout() {
	const { t } = useTranslation();

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: t("home.title"),
					tabBarLabel: t("home.title"),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: t("settings.title"),
					tabBarLabel: t("settings.title"),
				}}
			/>
		</Tabs>
	);
}
