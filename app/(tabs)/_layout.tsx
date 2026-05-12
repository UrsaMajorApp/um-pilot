import { Feather } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Text, useWindowDimensions, View } from 'react-native';
import { PilotSideNav } from '../../components/PilotSideNav';
import { usePilot } from '../../lib/pilot-store';
import { colors } from '../../lib/theme';

export default function PilotTabsLayout() {
  const { report, user } = usePilot();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  if (!user) return <Redirect href="/" />;
  if (!report) return <Redirect href="/diagnostic" />;

  const tabs = (
    <Tabs
      screenOptions={{
        headerShown: false,
          tabBarActiveTintColor: colors.violet,
          tabBarInactiveTintColor: colors.muted,
        tabBarStyle: isDesktop
          ? { display: 'none' }
          : {
              position: 'absolute',
              height: 82,
              left: 0,
              right: 0,
              bottom: 0,
              borderTopLeftRadius: 34,
              borderTopRightRadius: 34,
              borderTopWidth: 1,
              borderTopColor: 'rgba(255,255,255,0.85)',
              backgroundColor: colors.paper,
              paddingTop: 10,
              boxShadow: '0px -10px 30px rgba(24, 27, 35, 0.08)',
            },
        tabBarLabel: ({ color, children }) => (
          <Text style={{ color, fontSize: 11, fontWeight: '800' }} selectable>
            {children}
          </Text>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="home" />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Кружки',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="book-open" />,
        }}
      />
      <Tabs.Screen
        name="mentor"
        options={{
          title: 'Ментор',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="message-circle" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="user" />,
        }}
      />
    </Tabs>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.surface }}>
        <PilotSideNav />
        <View style={{ flex: 1 }}>{tabs}</View>
      </View>
    );
  }

  return tabs;
}

function TabIcon({ color, name }: { color: string; name: keyof typeof Feather.glyphMap }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Feather name={name} size={21} color={color} />
    </View>
  );
}
