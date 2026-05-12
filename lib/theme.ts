export const colors = {
  primary: '#6C5CE7',
  secondary: '#AF52DE',
  ink: '#15161A',
  text: '#20222A',
  muted: '#69707D',
  line: '#E2E6EE',
  paper: '#FFFFFF',
  surface: '#F6F7FA',
  surfaceDark: '#101218',
  cardDark: '#181B23',
  violet: '#5C4DFF',
  blue: '#007AFF',
  green: '#12B981',
  amber: '#F59E0B',
  red: '#EF4444',
  cyan: '#06B6D4',
  gradients: {
    header: ['#4F46E5', '#7C3AED', '#C026D3'] as [string, string, string],
    soft: ['#FFFFFF', '#F4F5FF'] as [string, string],
  },
};

export const radius = {
  lg: 24,
  xl: 32,
  full: 999,
};

export const shadows = {
  sm: {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  },
  md: {
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
  },
  lg: {
    boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.12)',
  },
};

export const scoreLabels: Record<string, string> = {
  ent_mathphys: 'Математика / IT',
  ent_chembio: 'Химия / био',
  ent_humanities: 'Гуманитарный',
  iq_analytical: 'Логика',
  iq_verbal: 'Вербальный IQ',
  honesty: 'Честность',
  teamwork: 'Командность',
  leadership: 'Лидерство',
  stress_tolerance: 'Стресс',
  perseverance: 'Настойчивость',
  growth_mindset: 'Рост',
  autonomy: 'Автономия',
  mediation: 'Медиация',
  attention: 'Внимание',
  analytical: 'Аналитика',
};

export const anchorLabels: Record<string, string> = {
  autonomy: 'Автономия',
  stability: 'Стабильность',
  mastery: 'Мастерство',
  management: 'Менеджмент',
  entrepreneurship: 'Предпринимательство',
  service: 'Польза людям',
  challenge: 'Вызов',
  lifestyle: 'Баланс',
};
