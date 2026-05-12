import { anchorLabels, scoreLabels } from './theme';
import type { AnchorKey, AnchorScores, Scores, ScoreKey } from '../data/diagnostic';

export type Behavioral = {
  avg_response_time_ms: number;
  fast_answers_count: number;
  answer_changes_count: number;
};

export type PilotReport = {
  normalizedScores: Record<ScoreKey, number>;
  talentWeb: { key: ScoreKey; label: string; value: number }[];
  entProfile: {
    key: 'mathphys' | 'chembio' | 'humanities';
    label: string;
    subjects: string[];
    specialties: string[];
  };
  topAnchors: { key: AnchorKey; label: string; value: number }[];
  strengths: { key: ScoreKey; label: string; value: number }[];
  growthZones: { key: ScoreKey; label: string; value: number }[];
  cognitiveStyle: string;
  personalityType: string;
  recommendedClubs: string[];
  parentTip: string;
  aiGenerated?: boolean;
  aiNarrative?: PilotAiNarrative;
};

export type PilotAiNarrative = {
  header?: {
    eyebrow: string;
    title: string;
    summary: string;
  };
  profile: string;
  strengths: string;
  growth: string;
  careers: string;
  parentAdvice: string;
  skillScores?: Partial<Record<ScoreKey, number>>;
  talentWeb?: { key: ScoreKey; value: number }[];
  recommendations?: {
    subjects: string;
    directions: string;
    motivators: string;
    decisionStyle: string;
    nextStep: string;
    clubs: string[];
  };
};

const maxPositive: Record<ScoreKey, number> = {
  ent_mathphys: 30,
  ent_chembio: 30,
  ent_humanities: 30,
  iq_analytical: 20,
  iq_verbal: 20,
  honesty: 90,
  teamwork: 80,
  leadership: 70,
  stress_tolerance: 70,
  perseverance: 65,
  growth_mindset: 20,
  autonomy: 40,
  mediation: 10,
  attention: 35,
  analytical: 75,
};

const scoreKeys: ScoreKey[] = [
  'ent_mathphys',
  'ent_chembio',
  'ent_humanities',
  'iq_analytical',
  'iq_verbal',
  'honesty',
  'teamwork',
  'leadership',
  'stress_tolerance',
  'perseverance',
  'growth_mindset',
  'autonomy',
  'mediation',
  'attention',
  'analytical',
];

const talentKeys: ScoreKey[] = [
  'analytical',
  'leadership',
  'teamwork',
  'attention',
  'stress_tolerance',
  'growth_mindset',
];

function normalizeScores(scores: Scores): Record<ScoreKey, number> {
  return Object.fromEntries(
    Object.entries(scores).map(([key, value]) => {
      const scoreKey = key as ScoreKey;
      return [scoreKey, Math.max(0, Math.min(100, Math.round((value / maxPositive[scoreKey]) * 100)))];
    })
  ) as Record<ScoreKey, number>;
}

function getEntProfile(scores: Scores): PilotReport['entProfile'] {
  const profiles = [
    {
      key: 'mathphys' as const,
      value: scores.ent_mathphys,
      label: 'Технарь-аналитик',
      subjects: ['Математика', 'Физика', 'Информатика'],
      specialties: ['IT', 'Инженерия', 'Data Science'],
    },
    {
      key: 'chembio' as const,
      value: scores.ent_chembio,
      label: 'Естественник',
      subjects: ['Химия', 'Биология', 'География'],
      specialties: ['Медицина', 'Экология', 'Биотехнологии'],
    },
    {
      key: 'humanities' as const,
      value: scores.ent_humanities,
      label: 'Гуманитарий-коммуникатор',
      subjects: ['История', 'Английский', 'Казахский язык'],
      specialties: ['Журналистика', 'Право', 'Маркетинг'],
    },
  ];

  return profiles.sort((a, b) => b.value - a.value)[0];
}

function getTopAnchors(anchors: AnchorScores, scores: Scores): PilotReport['topAnchors'] {
  const merged = { ...anchors };
  if (scores.autonomy > 10) merged.autonomy += 1;
  if (scores.leadership > 20) merged.management += 1;
  if (scores.perseverance > 20) merged.mastery += 1;
  if (scores.teamwork > 20) merged.service += 1;
  if (scores.stress_tolerance > 20) merged.challenge += 1;

  return Object.entries(merged)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, value]) => ({ key: key as AnchorKey, label: anchorLabels[key], value }));
}

function rankedScores(normalized: Record<ScoreKey, number>) {
  return Object.entries(normalized)
    .map(([key, value]) => ({ key: key as ScoreKey, label: scoreLabels[key], value }))
    .sort((a, b) => b.value - a.value);
}

function getPersonalityType(normalized: Record<ScoreKey, number>) {
  const candidates = [
    {
      label: 'Коммуникатор-медиатор',
      value: Math.round((normalized.mediation + normalized.iq_verbal + normalized.ent_humanities + normalized.teamwork) / 4),
      min: 48,
    },
    {
      label: 'Технарь-исследователь',
      value: Math.round((normalized.ent_mathphys + normalized.iq_analytical + normalized.analytical + normalized.attention) / 4),
      min: 44,
    },
    {
      label: 'Естественно-научный исследователь',
      value: Math.round((normalized.ent_chembio + normalized.analytical + normalized.attention + normalized.perseverance) / 4),
      min: 42,
    },
    {
      label: 'Инициатор проектов',
      value: Math.round((normalized.leadership + normalized.autonomy + normalized.growth_mindset + normalized.stress_tolerance) / 4),
      min: 46,
    },
    {
      label: 'Командный драйвер',
      value: Math.round((normalized.stress_tolerance + normalized.perseverance + normalized.teamwork + normalized.leadership) / 4),
      min: 46,
    },
    {
      label: 'Надежный систематизатор',
      value: Math.round((normalized.attention + normalized.perseverance + normalized.honesty + normalized.analytical) / 4),
      min: 46,
    },
  ]
    .filter((candidate) => candidate.value >= candidate.min)
    .sort((a, b) => b.value - a.value);

  if (candidates[0]) return candidates[0].label;
  if (normalized.ent_mathphys >= normalized.ent_humanities && normalized.ent_mathphys >= normalized.ent_chembio) {
    return 'Практичный технарь';
  }
  if (normalized.ent_chembio >= normalized.ent_humanities) return 'Наблюдательный естественник';
  if (normalized.ent_humanities >= 35) return 'Гуманитарий-коммуникатор';
  return 'Гибкий практик';
}

function getRecommendedClubs(report: {
  entProfile: PilotReport['entProfile'];
  topAnchors: PilotReport['topAnchors'];
  normalizedScores: Record<ScoreKey, number>;
}) {
  const clubs = new Set<string>();
  const activeTeamSignal =
    report.normalizedScores.stress_tolerance >= 45 &&
    (report.normalizedScores.perseverance >= 35 ||
      report.normalizedScores.teamwork >= 35 ||
      report.normalizedScores.leadership >= 35);

  if (report.entProfile.key === 'mathphys') {
    clubs.add('Робототехника и Arduino');
    clubs.add('Python для анализа данных');
  }
  if (report.entProfile.key === 'chembio') {
    clubs.add('Биоэкология города');
    clubs.add('Медицинский pre-club');
  }
  if (report.entProfile.key === 'humanities') {
    clubs.add('Медиа и сторителлинг');
    clubs.add('Дебаты и публичные выступления');
  }
  if (activeTeamSignal) clubs.add('Спортивные проекты и командные игры');
  if (report.topAnchors.some((anchor) => anchor.key === 'entrepreneurship')) clubs.add('Стартап-лаборатория');
  if (report.normalizedScores.leadership > 60) clubs.add('Лидерская проектная группа');
  return Array.from(clubs).slice(0, 4);
}

function clampPercent(value: unknown, fallback: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getAiRecommendedClubs(aiNarrative: PilotAiNarrative, fallback: string[]) {
  const clubs = aiNarrative.recommendations?.clubs ?? [];
  const cleanClubs = clubs
    .filter((club) => typeof club === 'string')
    .map((club) => club.trim())
    .filter(Boolean);

  return cleanClubs.length > 0 ? Array.from(new Set(cleanClubs)).slice(0, 4) : fallback;
}

export function applyAiQuantitativeReport(baseReport: PilotReport, aiNarrative: PilotAiNarrative): PilotReport {
  const normalizedScores = { ...baseReport.normalizedScores };

  for (const key of scoreKeys) {
    normalizedScores[key] = clampPercent(aiNarrative.skillScores?.[key], normalizedScores[key]);
  }

  const aiTalentValues = new Map(
    (aiNarrative.talentWeb ?? [])
      .filter((item): item is { key: ScoreKey; value: number } => talentKeys.includes(item.key))
      .map((item) => [item.key, item.value])
  );

  const talentWeb = talentKeys.map((key) => ({
    key,
    label: scoreLabels[key],
    value: clampPercent(aiTalentValues.get(key), normalizedScores[key]),
  }));
  const ranked = rankedScores(normalizedScores);
  const recalculatedBase = {
    entProfile: baseReport.entProfile,
    normalizedScores,
    topAnchors: baseReport.topAnchors,
  };

  return {
    ...baseReport,
    normalizedScores,
    talentWeb,
    strengths: ranked.slice(0, 3),
    growthZones: ranked.slice(-2).reverse(),
    personalityType: getPersonalityType(normalizedScores),
    recommendedClubs: getAiRecommendedClubs(aiNarrative, getRecommendedClubs(recalculatedBase)),
  };
}

export function buildPilotReport(scores: Scores, anchors: AnchorScores, behavioral: Behavioral): PilotReport {
  const normalizedScores = normalizeScores(scores);
  const entProfile = getEntProfile(scores);
  const topAnchors = getTopAnchors(anchors, scores);
  const ranked = rankedScores(normalizedScores);
  const cognitiveStyle =
    behavioral.avg_response_time_ms < 5000 ? 'Быстрые решения с хорошей интуицией' : 'Вдумчивый аналитический темп';
  const baseReport = {
    normalizedScores,
    entProfile,
    topAnchors,
  };

  return {
    ...baseReport,
    talentWeb: talentKeys.map((key) => ({ key, label: scoreLabels[key], value: normalizedScores[key] })),
    strengths: ranked.slice(0, 3),
    growthZones: ranked.slice(-2).reverse(),
    cognitiveStyle,
    personalityType: getPersonalityType(normalizedScores),
    recommendedClubs: getRecommendedClubs(baseReport),
    parentTip: 'Лучше поддерживать выбор через пробные проекты: подростку важно увидеть профессию в действии, а не только услышать совет.',
    aiGenerated: false,
  };
}
