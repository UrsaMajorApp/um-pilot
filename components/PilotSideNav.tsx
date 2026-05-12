import { Feather } from '@expo/vector-icons';
import { type Href, usePathname, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { usePilot } from '../lib/pilot-store';
import { colors, shadows } from '../lib/theme';

const navItems = [
  { key: 'home', label: 'Главная', icon: 'home' as const, href: '/(tabs)/home', path: '/home' },
  { key: 'courses', label: 'Кружки', icon: 'book-open' as const, href: '/(tabs)/courses', path: '/courses' },
  { key: 'mentor', label: 'Ментор', icon: 'message-circle' as const, href: '/(tabs)/mentor', path: '/mentor' },
  { key: 'profile', label: 'Профиль', icon: 'user' as const, href: '/(tabs)/profile', path: '/profile' },
];

export function PilotSideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { resetPilot, user } = usePilot();

  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() ?? 'U';
  const userName = user?.fullName || 'Участник пилота';

  return (
    <View
      style={{
        width: 260,
        backgroundColor: colors.paper,
        borderRightWidth: 1,
        borderRightColor: '#ECEEF5',
        height: '100%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#ECEEF5',
        }}
      >
        <Text style={{ color: colors.primary, fontSize: 28, fontWeight: '900', letterSpacing: 0 }} selectable>
          UM
        </Text>
        <Pressable
          disabled
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#F2F2F7',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.72,
          }}
        >
          <Feather name="bell" size={18} color={colors.muted} />
        </Pressable>
      </View>

      <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 12 }}>
        {navItems.map((item) => {
          const active = pathname === item.path || pathname.endsWith(item.path);
          return (
            <Pressable
              key={item.key}
              onPress={() => router.replace(item.href as Href)}
              style={({ hovered, pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 12,
                marginBottom: 3,
                borderRadius: 12,
                backgroundColor: active
                  ? `${colors.primary}12`
                  : pressed
                    ? `${colors.primary}10`
                    : hovered
                      ? '#F2F2F7'
                      : 'transparent',
              })}
            >
              <Feather name={item.icon} size={19} color={active ? colors.primary : colors.muted} />
              <Text
                style={{
                  marginLeft: 12,
                  fontSize: 14,
                  fontWeight: active ? '700' : '500',
                  color: active ? colors.primary : colors.muted,
                }}
                selectable
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#ECEEF5',
          padding: 12,
          gap: 8,
        }}
      >
        <Pressable
          onPress={() => router.replace('/(tabs)/profile' as Href)}
          style={({ hovered, pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderRadius: 12,
            backgroundColor: pressed ? '#ECEEF5' : hovered ? '#F8F8FB' : 'transparent',
          })}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: `${colors.primary}15`,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 15 }} selectable>
              {userInitial}
            </Text>
          </View>
          <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: colors.text }} numberOfLines={1} selectable>
            {userName}
          </Text>
        </Pressable>

        <Pressable
          onPress={resetPilot}
          style={({ hovered, pressed }) => ({
            ...shadows.sm,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            paddingVertical: 12,
            borderRadius: 14,
            backgroundColor: pressed ? '#FEE2E2' : hovered ? '#FEF2F2' : '#FFF5F5',
            borderWidth: 1,
            borderColor: '#FECACA',
          })}
        >
          <Feather name="log-out" size={16} color={colors.red} />
          <Text style={{ color: colors.red, fontSize: 14, fontWeight: '900' }} selectable>
            Выйти
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
