const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const scoreKeys = [
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
const talentKeys = ['analytical', 'leadership', 'teamwork', 'attention', 'stress_tolerance', 'growth_mindset'];

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
    status?: string;
  };
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

function parseJsonObject(text: string) {
  return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
  }

  const authorization = req.headers.get('Authorization');
  if (!authorization) {
    return jsonResponse({ error: 'Missing Authorization header' }, { status: 401 });
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return jsonResponse({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload?.user || !payload?.scores || !payload?.base_report) {
    return jsonResponse({ error: 'Invalid diagnostic payload' }, { status: 400 });
  }

const prompt = `
Ты — детский психолог и карьерный консультант платформы Ursa Major.
Тебе переданы результаты диагностики подростка ${payload.age_group || `${payload.user.age} лет`} в формате ${payload.tier || 'pilot'}.

Правила:
- Пиши на русском, на "ты", уважительно и спокойно.
- Не ставь диагнозы и не используй медицинские формулировки.
- Не придумывай факты вне переданных данных.
- Слабые стороны называй "зонами роста".
- Markdown можно использовать только для редкого выделения ключевых слов через **жирный**. Не выделяй целые предложения.
- header — короткий текст для верхнего блока результата. eyebrow 2-4 слова, title до 70 символов, summary 1-2 предложения.
- profile, strengths, growth, careers, parentAdvice — по 1 короткому абзацу, 1-2 предложения.
- skillScores — это проценты навыков от 0 до 100, целые числа. Они должны отражать ответы подростка, но не копировать механически base_report.normalizedScores.
- talentWeb — данные для диаграммы-паутинки. Верни ровно 6 осей: analytical, leadership, teamwork, attention, stress_tolerance, growth_mindset. Значения тоже от 0 до 100.
- recommendations — персональные рекомендации для блока "Куда смотреть дальше". Не повторяй сухо base_report. Пиши как консультант, который объясняет, почему эти предметы, направления и кружки подходят подростку.
- recommendations.subjects, directions, motivators, decisionStyle, nextStep — каждое поле должно быть одним коротким предложением до 140 символов.
- recommendations.clubs — 3-4 коротких названия кружков или проектных направлений. Это демо-каталог, реальные партнеры могут быть добавлены позже.
- Не используй "Гибкий практик" как универсальный ярлык. Если данные смешанные, делай header.title конкретнее через сильную сторону: аналитика, коммуникация, команда, спорт/активность, проекты.
- Если ответы или навыки показывают спорт, движение, соревновательность, выносливость или командную игру, обязательно отрази это в directions или clubs.
- Не завышай все показатели. Оставляй видимую разницу между сильными сторонами и зонами роста.
- Ответ должен быть конкретным, коротким и полезным для школьника.

Данные:
${JSON.stringify(payload, null, 2)}

Верни JSON строго по схеме.
`;

  const geminiResponse = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.45,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            header: {
              type: 'OBJECT',
              properties: {
                eyebrow: { type: 'STRING' },
                title: { type: 'STRING' },
                summary: { type: 'STRING' },
              },
              required: ['eyebrow', 'title', 'summary'],
              propertyOrdering: ['eyebrow', 'title', 'summary'],
            },
            profile: { type: 'STRING' },
            strengths: { type: 'STRING' },
            growth: { type: 'STRING' },
            careers: { type: 'STRING' },
            parentAdvice: { type: 'STRING' },
            skillScores: {
              type: 'OBJECT',
              properties: Object.fromEntries(scoreKeys.map((key) => [key, { type: 'INTEGER' }])),
              required: scoreKeys,
              propertyOrdering: scoreKeys,
            },
            talentWeb: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  key: { type: 'STRING', enum: talentKeys },
                  value: { type: 'INTEGER' },
                },
                required: ['key', 'value'],
                propertyOrdering: ['key', 'value'],
              },
            },
            recommendations: {
              type: 'OBJECT',
              properties: {
                subjects: { type: 'STRING' },
                directions: { type: 'STRING' },
                motivators: { type: 'STRING' },
                decisionStyle: { type: 'STRING' },
                nextStep: { type: 'STRING' },
                clubs: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                },
              },
              required: ['subjects', 'directions', 'motivators', 'decisionStyle', 'nextStep', 'clubs'],
              propertyOrdering: ['subjects', 'directions', 'motivators', 'decisionStyle', 'nextStep', 'clubs'],
            },
          },
          required: [
            'header',
            'profile',
            'strengths',
            'growth',
            'careers',
            'parentAdvice',
            'skillScores',
            'talentWeb',
            'recommendations',
          ],
          propertyOrdering: [
            'header',
            'profile',
            'strengths',
            'growth',
            'careers',
            'parentAdvice',
            'skillScores',
            'talentWeb',
            'recommendations',
          ],
        },
      },
    }),
  });

  const geminiData = (await geminiResponse.json().catch(() => ({}))) as GeminiResponse;

  if (!geminiResponse.ok) {
    return jsonResponse(
      {
        error: 'Gemini request failed',
        detail: geminiData.error?.status || geminiData.error?.message || geminiResponse.status,
      },
      { status: 502 },
    );
  }

  const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const report = parseJsonObject(text);

  return jsonResponse({ report });
});
