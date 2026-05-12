export type ScoreKey =
  | 'ent_mathphys'
  | 'ent_chembio'
  | 'ent_humanities'
  | 'iq_analytical'
  | 'iq_verbal'
  | 'honesty'
  | 'teamwork'
  | 'leadership'
  | 'stress_tolerance'
  | 'perseverance'
  | 'growth_mindset'
  | 'autonomy'
  | 'mediation'
  | 'attention'
  | 'analytical';

export type AnchorKey =
  | 'autonomy'
  | 'stability'
  | 'mastery'
  | 'management'
  | 'entrepreneurship'
  | 'service'
  | 'challenge'
  | 'lifestyle';

export type AgeGroup = '12-14' | '15-17';
export type TestTier = 'basic' | 'pro';
export type ModuleKey = 'basic' | 'mail' | 'chat' | 'tasks';

export type Scores = Record<ScoreKey, number>;
export type AnchorScores = Record<AnchorKey, number>;

export type PilotOption = {
  id: 'v1' | 'v2' | 'v3';
  text: string;
  deltas: Partial<Record<ScoreKey, number>>;
  anchors?: Partial<Record<AnchorKey, number>>;
};

export type PilotQuestion = {
  id: string;
  module: ModuleKey;
  from: string;
  subject: string;
  prompt: string;
  options: PilotOption[];
};

export const emptyScores = (): Scores => ({
  ent_mathphys: 0,
  ent_chembio: 0,
  ent_humanities: 0,
  iq_analytical: 0,
  iq_verbal: 0,
  honesty: 0,
  teamwork: 0,
  leadership: 0,
  stress_tolerance: 0,
  perseverance: 0,
  growth_mindset: 0,
  autonomy: 0,
  mediation: 0,
  attention: 0,
  analytical: 0,
});

export const emptyAnchors = (): AnchorScores => ({
  autonomy: 0,
  stability: 0,
  mastery: 0,
  management: 0,
  entrepreneurship: 0,
  service: 0,
  challenge: 0,
  lifestyle: 0,
});

export const pilotQuestions: PilotQuestion[] = [
  {
    id: 'P01',
    module: 'mail',
    from: 'HR',
    subject: 'NDA до конца дня',
    prompt: 'Подпиши NDA до конца дня. Файл на 15 страниц. Юрист уже согласовал.',
    options: [
      { id: 'v1', text: 'Подпишу: раз юрист проверил, значит все ок.', deltas: { autonomy: 5 } },
      {
        id: 'v2',
        text: 'Попрошу 30 минут, чтобы пробежать ключевые пункты.',
        deltas: { attention: 10, honesty: 10 },
      },
      {
        id: 'v3',
        text: 'Напишу, что подпишу только после личной встречи с HR.',
        deltas: { autonomy: 5, teamwork: -5 },
      },
    ],
  },
  {
    id: 'P02',
    module: 'mail',
    from: 'IT',
    subject: 'Доступ к системам',
    prompt: 'Выберите отдел. От этого зависит ваш доступ к системам.',
    options: [
      { id: 'v1', text: 'Отдел данных и аналитики.', deltas: { ent_mathphys: 10 } },
      { id: 'v2', text: 'R&D и лаборатория.', deltas: { ent_chembio: 10 } },
      { id: 'v3', text: 'Коммуникации и тексты.', deltas: { ent_humanities: 10 } },
    ],
  },
  {
    id: 'P03',
    module: 'mail',
    from: 'Финансы',
    subject: 'Отчет не сходится',
    prompt: 'В вашем отчете итог не сходится. Разница - 200 тенге.',
    options: [
      { id: 'v1', text: 'Округлю: на такую сумму никто не обратит внимания.', deltas: { honesty: -10 } },
      { id: 'v2', text: 'Пересчитаю с начала.', deltas: { perseverance: 10, attention: 10 } },
      { id: 'v3', text: 'Напишу, что цифры верные, ошибка в системе.', deltas: { honesty: -10 } },
    ],
  },
  {
    id: 'P04',
    module: 'mail',
    from: 'Шеф',
    subject: 'Дедлайн завтра',
    prompt: 'Коллега заболел. Его задача теперь твоя.',
    options: [
      { id: 'v1', text: 'Возьму, разберусь.', deltas: { teamwork: 10, stress_tolerance: 10 } },
      { id: 'v2', text: 'Скажу, что у меня и своих задач хватает.', deltas: { teamwork: -5 } },
      {
        id: 'v3',
        text: 'Возьму, но попрошу перенести мои дедлайны.',
        deltas: { stress_tolerance: 10, teamwork: 10 },
      },
    ],
  },
  {
    id: 'P05',
    module: 'mail',
    from: 'Клиент',
    subject: 'Срыв сроков',
    prompt: 'Вы сорвали сроки. Я разочарован и хочу говорить с руководством.',
    options: [
      { id: 'v1', text: 'Извинюсь и сам соединю с руководителем.', deltas: { honesty: 10, leadership: 10 } },
      { id: 'v2', text: 'Объясню, что это не моя зона ответственности.', deltas: { teamwork: -5 } },
      { id: 'v3', text: 'Попрошу описать проблему письменно для команды.', deltas: { attention: 5 } },
    ],
  },
  {
    id: 'P06',
    module: 'mail',
    from: 'Шеф',
    subject: 'Регламент',
    prompt: 'Прочитайте 40-страничный регламент до пятницы.',
    options: [
      { id: 'v1', text: 'Прочитаю полностью.', deltas: { perseverance: 10 } },
      { id: 'v2', text: 'Прочитаю содержание и ключевые разделы.', deltas: { iq_verbal: 10 } },
      { id: 'v3', text: 'Попрошу коллег рассказать главное.', deltas: { attention: -5 } },
    ],
  },
  {
    id: 'P07',
    module: 'mail',
    from: 'IT-бот',
    subject: 'Мини-задача',
    prompt: 'Следующее число в ряду: 3, 6, 11, 18, 27, ...?',
    options: [
      { id: 'v1', text: '36', deltas: {} },
      { id: 'v2', text: '38', deltas: { iq_analytical: 10 } },
      { id: 'v3', text: '33', deltas: {} },
    ],
  },
  {
    id: 'P08',
    module: 'mail',
    from: 'Макс',
    subject: 'Первый день',
    prompt: 'Тут все работают по-разному. Кто-то тихо делает свое, кто-то спрашивает, кто-то берет инициативу. Ты какой?',
    options: [
      { id: 'v1', text: 'Буду наблюдать первую неделю, потом видно будет.', deltas: { analytical: 10 } },
      { id: 'v2', text: 'Сразу спрошу у всех, как принято, и подстроюсь.', deltas: { teamwork: 10 } },
      { id: 'v3', text: 'Буду делать как считаю нужным, посмотрим на результат.', deltas: { autonomy: 10 } },
    ],
  },
  {
    id: 'P09',
    module: 'mail',
    from: 'Коллега',
    subject: 'Ошибка в презентации',
    prompt: 'Шеф спросил, кто сделал ошибку в презентации. Это был я, но все молчат.',
    options: [
      { id: 'v1', text: 'Промолчу: меня не спрашивали.', deltas: { honesty: -10 } },
      { id: 'v2', text: 'Скажу коллеге, что лучше самому признаться.', deltas: { honesty: 10 } },
      { id: 'v3', text: 'Скажу шефу сам, что ошибку сделал коллега.', deltas: { teamwork: -5 } },
    ],
  },
  {
    id: 'P10',
    module: 'mail',
    from: 'Бот',
    subject: 'Аналогия',
    prompt: 'Слово - буква. Программа - ?',
    options: [
      { id: 'v1', text: 'Экран', deltas: {} },
      { id: 'v2', text: 'Код', deltas: { iq_verbal: 10, iq_analytical: 10 } },
      { id: 'v3', text: 'Компьютер', deltas: {} },
    ],
  },
  {
    id: 'P11',
    module: 'chat',
    from: 'Макс',
    subject: 'Встреча через 10 минут',
    prompt: 'Шеф хочет встречу через 10 минут, а я не готов. Что делать?',
    options: [
      { id: 'v1', text: 'Скажи, что заболел, и перенеси.', deltas: { stress_tolerance: 5, honesty: -10 } },
      { id: 'v2', text: 'Зайди и честно скажи, что нужно еще 20 минут.', deltas: { honesty: 10, stress_tolerance: 10 } },
      { id: 'v3', text: 'Зайди как есть: экспромт иногда работает.', deltas: { autonomy: 5 } },
    ],
  },
  {
    id: 'P12',
    module: 'chat',
    from: 'Алиса',
    subject: 'Черновик клиенту',
    prompt: 'Я случайно отправила черновик клиенту вместо финальной версии. Помогаешь?',
    options: [
      { id: 'v1', text: 'Напишем клиенту вместе и пришлем верную версию.', deltas: { teamwork: 10, leadership: 10 } },
      { id: 'v2', text: 'Сообщи руководителю, это твоя ответственность.', deltas: { teamwork: -5 } },
      { id: 'v3', text: 'Перешли правильную версию без объяснений.', deltas: { honesty: -10 } },
    ],
  },
  {
    id: 'P13',
    module: 'chat',
    from: 'Шеф',
    subject: 'Нужен доброволец',
    prompt: 'Кто может взять дополнительную задачу?',
    options: [
      { id: 'v1', text: 'Напишу, что возьму.', deltas: { leadership: 10, teamwork: 10 } },
      { id: 'v2', text: 'Промолчу, пусть кто-то другой.', deltas: { teamwork: -5 } },
      { id: 'v3', text: 'Могу взять, если это не срочнее текущих задач.', deltas: { stress_tolerance: 10, analytical: 10 } },
    ],
  },
  {
    id: 'P14',
    module: 'chat',
    from: 'Макс',
    subject: 'Удаленная таблица',
    prompt: 'Я удалил таблицу с данными трех месяцев. Паника. Никто не знает.',
    options: [
      { id: 'v1', text: 'Сначала проверим бэкап, потом решим, как говорить.', deltas: { analytical: 10, teamwork: 10 } },
      { id: 'v2', text: 'Идем к IT прямо сейчас и признаемся.', deltas: { honesty: 10, leadership: 10 } },
      { id: 'v3', text: 'Ничего не знаю, это твоя проблема.', deltas: { teamwork: -10 } },
    ],
  },
  {
    id: 'P15',
    module: 'chat',
    from: 'Алиса',
    subject: 'Вопрос клиента',
    prompt: 'Клиент спрашивает, почему в эко-продукте ферменты, а не витамины. Что ответить?',
    options: [
      { id: 'v1', text: 'Ферменты ускоряют реакции, витамины тело само не вырабатывает.', deltas: { ent_chembio: 10 } },
      { id: 'v2', text: 'Скажи, что оба полезны и продукт работает.', deltas: {} },
      { id: 'v3', text: 'Переключи на менеджера по продукту.', deltas: { teamwork: -5 } },
    ],
  },
  {
    id: 'P16',
    module: 'chat',
    from: 'Шеф',
    subject: 'Перевод',
    prompt: "Переведи клиенту: 'Our Q3 metrics indicate a significant churn rate increase.'",
    options: [
      { id: 'v1', text: 'Метрики третьего квартала показывают рост оттока клиентов.', deltas: { ent_humanities: 10 } },
      { id: 'v2', text: 'Наши результаты в третьем квартале ухудшились.', deltas: {} },
      { id: 'v3', text: 'Не буду переводить, это не мой отдел.', deltas: { teamwork: -5 } },
    ],
  },
  {
    id: 'P17',
    module: 'chat',
    from: 'Макс',
    subject: 'Без выходных',
    prompt: 'Я уже третью неделю работаю без выходных. Нормально это?',
    options: [
      { id: 'v1', text: 'Иногда так бывает, потерпи.', deltas: {} },
      { id: 'v2', text: 'Скажи руководителю, это важно для твоего здоровья.', deltas: { teamwork: 10 } },
      { id: 'v3', text: 'Ты сам выбрал эту работу.', deltas: {} },
    ],
  },
  {
    id: 'P18',
    module: 'chat',
    from: 'Макс',
    subject: 'Вероятность',
    prompt: 'Сценарий А - 75%, сценарий Б - 80%. Вероятность, что оба сработают одновременно, 60%. Это правильно?',
    options: [
      { id: 'v1', text: 'Да, для независимых событий P(A) x P(B) = 60%.', deltas: { ent_mathphys: 10 } },
      { id: 'v2', text: 'Выглядит правильно, 60% - среднее между 75% и 80%.', deltas: {} },
      { id: 'v3', text: 'Не знаю, лучше проверь с аналитиком.', deltas: {} },
    ],
  },
  {
    id: 'P19',
    module: 'chat',
    from: 'Шеф',
    subject: 'Анализ конкурентов',
    prompt: 'Нужен анализ конкурентов к завтрашнему утру. Берешься?',
    options: [
      { id: 'v1', text: 'Да, к утру будет таблица.', deltas: { perseverance: 10 } },
      { id: 'v2', text: 'Смогу к послезавтра, за ночь качественно не получится.', deltas: { honesty: 10, stress_tolerance: 10 } },
      { id: 'v3', text: 'Нет, у меня другие приоритеты.', deltas: { teamwork: -5 } },
    ],
  },
  {
    id: 'P20',
    module: 'chat',
    from: 'Макс',
    subject: 'Конфликт',
    prompt: 'Ты сказал шефу, что я опоздал с задачей. Зачем?',
    options: [
      { id: 'v1', text: 'Шеф спросил напрямую, я не мог соврать.', deltas: { honesty: 10 } },
      { id: 'v2', text: 'Извини, не хотел задеть. Давай разберемся вместе.', deltas: { leadership: 10, mediation: 10 } },
      { id: 'v3', text: 'Ты и правда опоздал.', deltas: {} },
    ],
  },
  {
    id: 'P21',
    module: 'tasks',
    from: 'Таск-трекер',
    subject: '17:50',
    prompt: 'Задача до конца дня. Ты понял, что не успеваешь: осталось 30% работы.',
    options: [
      { id: 'v1', text: 'Останусь и доделаю.', deltas: { perseverance: 10 } },
      { id: 'v2', text: 'Напишу: готово на 70%, доделаю первым делом завтра.', deltas: { honesty: 10, stress_tolerance: 10 } },
      { id: 'v3', text: 'Закрою как выполненную: 70% почти все.', deltas: { honesty: -10 } },
    ],
  },
  {
    id: 'P22',
    module: 'tasks',
    from: 'Таск-трекер',
    subject: 'Нет инструкции',
    prompt: 'Задача: провести анализ рынка. Инструкции нет.',
    options: [
      { id: 'v1', text: 'Подожду, пока кто-то объяснит.', deltas: {} },
      { id: 'v2', text: 'Задам уточняющие вопросы и начну с понятного.', deltas: { analytical: 10 } },
      { id: 'v3', text: 'Сделаю как понимаю, потом скажут если что.', deltas: { autonomy: 5 } },
    ],
  },
  {
    id: 'P23',
    module: 'tasks',
    from: 'Таск-трекер',
    subject: 'Задачу закрыли',
    prompt: 'Коллега закрыл твою задачу как выполненную, но ты ее не делал.',
    options: [
      { id: 'v1', text: 'Скажу спасибо и промолчу.', deltas: { honesty: -10 } },
      { id: 'v2', text: 'Открою снова и напишу, что задача не выполнена.', deltas: { honesty: 10, attention: 10 } },
      { id: 'v3', text: 'Сделаю задачу сам и не буду поднимать тему.', deltas: { honesty: -5, perseverance: 5 } },
    ],
  },
  {
    id: 'P24',
    module: 'tasks',
    from: 'Система',
    subject: 'Следующая неделя',
    prompt: 'Выбери задачу на следующую неделю.',
    options: [
      { id: 'v1', text: 'Разработка алгоритма для рекомендаций.', deltas: { ent_mathphys: 10 } },
      { id: 'v2', text: 'Тестирование нового химического состава упаковки.', deltas: { ent_chembio: 10 } },
      { id: 'v3', text: 'Написание контент-плана для запуска продукта.', deltas: { ent_humanities: 10 } },
    ],
  },
  {
    id: 'P25',
    module: 'tasks',
    from: 'Шеф',
    subject: 'Мини-команда',
    prompt: 'Шеф предлагает стать руководителем небольшой группы.',
    options: [
      { id: 'v1', text: 'Соглашусь, хочу управлять людьми.', deltas: { leadership: 10 }, anchors: { management: 1 } },
      { id: 'v2', text: 'Откажусь, хочу остаться экспертом.', deltas: { perseverance: 10 }, anchors: { mastery: 1 } },
      { id: 'v3', text: 'Спрошу, что именно это предполагает.', deltas: { analytical: 10 } },
    ],
  },
  {
    id: 'P26',
    module: 'tasks',
    from: 'Таск-трекер',
    subject: 'Срыв дедлайна',
    prompt: 'Дедлайн прошел. Задача не сделана из-за технической ошибки системы.',
    options: [
      { id: 'v1', text: 'Напишу, что система виновата.', deltas: { honesty: -5 } },
      { id: 'v2', text: 'Объясню ситуацию и предложу новый срок.', deltas: { honesty: 10, stress_tolerance: 10 } },
      { id: 'v3', text: 'Тихо закрою задачу, может никто не заметит.', deltas: { honesty: -10 } },
    ],
  },
  {
    id: 'P27',
    module: 'tasks',
    from: 'Система',
    subject: 'Премия',
    prompt: 'За что выписать тебе премию?',
    options: [
      { id: 'v1', text: 'За точность и безошибочность работы.', deltas: { perseverance: 10 }, anchors: { mastery: 1 } },
      { id: 'v2', text: 'За то, что вытащил команду в критический момент.', deltas: { leadership: 10 }, anchors: { management: 1 } },
      { id: 'v3', text: 'За новую идею, которую внедрили в продукт.', deltas: { autonomy: 10 }, anchors: { entrepreneurship: 1 } },
    ],
  },
  {
    id: 'P28',
    module: 'tasks',
    from: 'Коллега',
    subject: 'Спор о решении',
    prompt: 'Коллега говорит, что твой способ неправильный, но ты уверен, что он работает.',
    options: [
      { id: 'v1', text: 'Соглашусь, он опытнее.', deltas: { autonomy: -5 } },
      { id: 'v2', text: 'Покажу результаты и предложу сравнить.', deltas: { analytical: 10, honesty: 10 } },
      { id: 'v3', text: 'Настаиваю на своем, я знаю что делаю.', deltas: { teamwork: -5 } },
    ],
  },
  {
    id: 'P29',
    module: 'tasks',
    from: 'Шеф',
    subject: 'Итоги дня',
    prompt: 'Сегодня был хаотичный день. Спасибо всем. Завтра разберем, что пошло не так.',
    options: [
      { id: 'v1', text: 'Поставлю лайк и промолчу.', deltas: {} },
      { id: 'v2', text: 'Напишу: есть пара идей, как улучшить процесс.', deltas: { growth_mindset: 10 } },
      { id: 'v3', text: 'Напишу: надеюсь завтра будет спокойнее.', deltas: {} },
    ],
  },
  {
    id: 'P30',
    module: 'tasks',
    from: 'Макс',
    subject: 'После работы',
    prompt: 'Тут реально бывает так тяжело. Ты как, не пожалел, что пришел?',
    options: [
      { id: 'v1', text: 'Устал, но интересно, хочу разобраться.', deltas: { growth_mindset: 10 } },
      { id: 'v2', text: 'Нет, все нормально, справляюсь.', deltas: {} },
      { id: 'v3', text: 'Пока не знаю, посмотрим дальше.', deltas: { analytical: 5 } },
    ],
  },
];

function basicCard(
  id: string,
  subject: string,
  prompt: string,
  deltas: PilotOption['deltas'],
  anchors?: PilotOption['anchors']
): PilotQuestion {
  return {
    id,
    module: 'basic',
    from: 'Карьерная карточка',
    subject,
    prompt,
    options: [
      { id: 'v1', text: 'Не мое', deltas: {} },
      { id: 'v2', text: 'Мое', deltas, anchors },
    ],
  };
}

export const basicQuestions1517: PilotQuestion[] = [
  basicCard('B15_01', 'Автономия', 'Сам решаю когда начинать и заканчивать работу', { autonomy: 10 }, { autonomy: 1 }),
  basicCard('B15_02', 'Стабильность', 'Знаю что завтра будет так же как сегодня - и это спокойно', { perseverance: 5 }, { stability: 1 }),
  basicCard('B15_03', 'Вызов', 'Чем сложнее задача - тем интереснее за нее браться', { stress_tolerance: 10 }, { challenge: 1 }),
  basicCard('B15_04', 'Польза', 'Работа которая реально меняет что-то в мире', { teamwork: 10 }, { service: 1 }),
  basicCard('B15_05', 'Мастерство', 'Стать лучшим в своей теме - это важнее зарплаты', { perseverance: 10 }, { mastery: 1 }),
  basicCard('B15_06', 'Предпринимательство', 'Создать что-то свое с нуля - бренд, продукт, бизнес', { leadership: 5, autonomy: 5 }, { entrepreneurship: 1 }),
  basicCard('B15_07', 'Баланс', 'Работа не должна съедать личную жизнь', { stress_tolerance: 5 }, { lifestyle: 1 }),
  basicCard('B15_08', 'Менеджмент', 'Принимать решения которые влияют на всю команду', { leadership: 10 }, { management: 1 }),
  basicCard('B15_09', 'Автономия', 'Не зависеть от одного работодателя', { autonomy: 10 }, { autonomy: 1 }),
  basicCard('B15_10', 'Стабильность', 'Предсказуемый карьерный путь без неожиданностей', { attention: 5 }, { stability: 1 }),
  basicCard('B15_11', 'Вызов', 'Браться за то от чего другие отказались', { stress_tolerance: 10, leadership: 5 }, { challenge: 1 }),
  basicCard('B15_12', 'Польза', 'Помогать людям решать их настоящие проблемы', { mediation: 10, teamwork: 5 }, { service: 1 }),
  basicCard('B15_13', 'Мастерство', 'Углубляться в одну тему годами - это мое', { perseverance: 10, analytical: 5 }, { mastery: 1 }),
  basicCard('B15_14', 'Предпринимательство', 'Рисковать ради большой идеи - нормально', { autonomy: 10, stress_tolerance: 5 }, { entrepreneurship: 1 }),
  basicCard('B15_15', 'Менеджмент', 'Отвечать за финальный результат всей команды', { leadership: 10, stress_tolerance: 5 }, { management: 1 }),
  basicCard('B15_16', 'Баланс', 'Работа важна - но есть вещи важнее', { stress_tolerance: 5 }, { lifestyle: 1 }),
  basicCard('B15_17', 'Вызов', 'Конкурировать и побеждать в жестких условиях', { leadership: 5, stress_tolerance: 10 }, { challenge: 1 }),
  basicCard('B15_18', 'Польза', 'Передавать знания и видеть как люди растут', { teamwork: 10, ent_humanities: 5 }, { service: 1 }),
  basicCard('B15_19', 'Мастерство', 'Делать открытия которых еще никто не делал', { analytical: 10, ent_chembio: 5 }, { mastery: 1 }),
  basicCard('B15_20', 'Автономия', 'Самостоятельно выбирать проекты и задачи', { autonomy: 10 }, { autonomy: 1 }),
  basicCard('B15_21', 'Предпринимательство', 'Продавать идею и убеждать людей верить в проект', { leadership: 10, ent_humanities: 5 }, { entrepreneurship: 1 }),
  basicCard('B15_22', 'Стабильность', 'Спокойствие и уверенность важнее высокой зарплаты', { attention: 5, perseverance: 5 }, { stability: 1 }),
  basicCard('B15_23', 'Менеджмент', 'Принимать жесткие решения когда нет хороших вариантов', { leadership: 10, stress_tolerance: 5 }, { management: 1 }),
  basicCard('B15_24', 'Баланс', 'Если работа вредит здоровью - это не моя работа', { stress_tolerance: 5 }, { lifestyle: 1 }),
];

export const basicQuestions1214: PilotQuestion[] = [
  basicCard('B12_01', 'Реалистичный', 'Собирать и чинить технику своими руками', { ent_mathphys: 10, autonomy: 5 }),
  basicCard('B12_02', 'Исследовательский', 'Разбираться как все устроено изнутри', { analytical: 10, iq_analytical: 5 }),
  basicCard('B12_03', 'Артистичный', 'Создавать визуальные миры с нуля', { ent_humanities: 10, autonomy: 5 }),
  basicCard('B12_04', 'Социальный', 'Быть там где людно и весело', { teamwork: 10 }),
  basicCard('B12_05', 'Предпринимательский', 'Придумать идею и убедить других в нее поверить', { leadership: 10 }, { entrepreneurship: 1 }),
  basicCard('B12_06', 'Конвенциональный', 'Когда все по плану и никакого хаоса', { attention: 10, perseverance: 5 }, { stability: 1 }),
  basicCard('B12_07', 'Реалистичный', 'Выживать и крафтить в реальных условиях', { autonomy: 10, stress_tolerance: 5 }),
  basicCard('B12_08', 'Исследовательский', 'Проводить эксперименты и находить закономерности', { ent_chembio: 10, analytical: 5 }),
  basicCard('B12_09', 'Артистичный', 'Создавать треки и звуки', { ent_humanities: 10 }),
  basicCard('B12_10', 'Социальный', 'Делать что-то важное для других людей', { teamwork: 10, mediation: 5 }, { service: 1 }),
  basicCard('B12_11', 'Предпринимательский', 'Продвигать идеи и влиять на аудиторию', { leadership: 10, ent_humanities: 5 }, { entrepreneurship: 1 }),
  basicCard('B12_12', 'Конвенциональный', 'Структурировать информацию и находить порядок', { attention: 10, analytical: 5 }),
  basicCard('B12_13', 'Реалистичный', 'Строить физические механизмы и устройства', { ent_mathphys: 10, analytical: 5 }),
  basicCard('B12_14', 'Исследовательский', 'Изучать то что еще никто не понял', { analytical: 10, ent_chembio: 5 }, { challenge: 1 }),
  basicCard('B12_15', 'Артистичный', 'Перевоплощаться и играть разные роли', { ent_humanities: 10, autonomy: 5 }),
  basicCard('B12_16', 'Социальный', 'Общаться с людьми и задавать вопросы', { teamwork: 10, ent_humanities: 5 }),
  basicCard('B12_17', 'Предпринимательский', 'Спорить, доказывать свою точку и побеждать', { leadership: 10, stress_tolerance: 5 }, { challenge: 1 }),
  basicCard('B12_18', 'Конвенциональный', 'Работать вдумчиво и методично', { attention: 10, perseverance: 5 }, { mastery: 1 }),
  basicCard('B12_19', 'Реалистичный', 'Тренироваться и двигаться', { perseverance: 10, stress_tolerance: 5 }),
  basicCard('B12_20', 'Исследовательский', 'Анализировать большие объемы информации', { analytical: 10, iq_analytical: 5 }),
  basicCard('B12_21', 'Артистичный', 'Снимать и монтировать видео', { ent_humanities: 10, attention: 5 }),
  basicCard('B12_22', 'Социальный', 'Объяснять другим то что сам понял', { teamwork: 10, ent_humanities: 5 }, { service: 1 }),
  basicCard('B12_23', 'Предпринимательский', 'Строить бизнес и зарабатывать большие деньги', { leadership: 10, autonomy: 5 }, { entrepreneurship: 1 }),
  basicCard('B12_24', 'Конвенциональный', 'Управлять бюджетом и считать деньги', { attention: 10, ent_mathphys: 5 }),
];

export const proQuestions1214: PilotQuestion[] = [
  {
    id: 'M01',
    module: 'chat',
    from: 'Алиса',
    subject: 'Взлом хакатона',
    prompt: 'Наш код для умной теплицы стерли! Защита хакатона завтра.',
    options: [
      { id: 'v1', text: 'Ладно все пропало - давайте придумаем другой проект.', deltas: { stress_tolerance: -5 } },
      { id: 'v2', text: 'Спокойно. Проверим бэкапы на сервере.', deltas: { stress_tolerance: 10, analytical: 5 } },
      { id: 'v3', text: 'Надо срочно всем написать - может кто-то сохранял копию.', deltas: { teamwork: 5 } },
    ],
  },
  {
    id: 'M02',
    module: 'chat',
    from: 'Макс',
    subject: 'Аналогия',
    prompt: 'Вирус = Карантин, Баг в коде = ?',
    options: [
      { id: 'v1', text: 'Удаление', deltas: {} },
      { id: 'v2', text: 'Отладка', deltas: { iq_analytical: 10, ent_mathphys: 5 } },
      { id: 'v3', text: 'Обновление', deltas: {} },
    ],
  },
  {
    id: 'M03',
    module: 'chat',
    from: 'Бот',
    subject: 'Ключ доступа',
    prompt: 'Введите ключ доступа. По развертке какая фигура получится?',
    options: [
      { id: 'v1', text: 'Пирамида', deltas: {} },
      { id: 'v2', text: 'Цилиндр', deltas: {} },
      { id: 'v3', text: 'Куб', deltas: { analytical: 10 } },
    ],
  },
  {
    id: 'M04',
    module: 'chat',
    from: 'Алиса',
    subject: 'Ссора в команде',
    prompt: 'Алиса обвиняет Макса во взломе, Макс отрицает. Что делаешь?',
    options: [
      { id: 'v1', text: 'Макс реально виноват - надо было осторожнее.', deltas: { mediation: -5 } },
      { id: 'v2', text: 'Стоп. Разберемся потом - сейчас восстанавливаем данные.', deltas: { mediation: 10, stress_tolerance: 5 } },
      { id: 'v3', text: 'Вы оба успокойтесь - я пока ищу бэкап.', deltas: { mediation: 8, analytical: 5 } },
    ],
  },
  {
    id: 'M05',
    module: 'chat',
    from: 'Админ-бот',
    subject: 'Фишинг',
    prompt: 'Ваш аккаунт взломан! Перейдите по ссылке secure-login-free.com и введите пароль.',
    options: [
      { id: 'v1', text: 'Кликаем быстрее - иначе потеряем все.', deltas: { iq_analytical: -10 } },
      { id: 'v2', text: 'Это фишинг - настоящие админы так не пишут.', deltas: { iq_analytical: 10, attention: 5 } },
      { id: 'v3', text: 'Перейдем, но пароль не вводим.', deltas: { iq_analytical: -5 } },
    ],
  },
  {
    id: 'M06',
    module: 'chat',
    from: 'Макс',
    subject: 'Пароль',
    prompt: 'Следующий байт в ряду: 16, 32, 64, 128, ...?',
    options: [
      { id: 'v1', text: '200', deltas: {} },
      { id: 'v2', text: '256', deltas: { iq_analytical: 10, ent_mathphys: 5 } },
      { id: 'v3', text: '512', deltas: {} },
    ],
  },
  {
    id: 'M07',
    module: 'chat',
    from: 'Макс',
    subject: 'Чужой проект',
    prompt: 'Давайте возьмем похожий проект из интернета и немного переделаем?',
    options: [
      { id: 'v1', text: 'Давай - другого выхода нет.', deltas: { honesty: -10 } },
      { id: 'v2', text: 'Нет - если поймают, дисквалифицируют. Делаем свое.', deltas: { honesty: 10 } },
      { id: 'v3', text: 'Можно взять только идею - код напишем сами.', deltas: {} },
    ],
  },
  {
    id: 'M08',
    module: 'chat',
    from: 'Алиса',
    subject: 'Тег архива',
    prompt: 'Что общее у слов: сервер, роутер, протокол?',
    options: [
      { id: 'v1', text: 'Компьютеры', deltas: {} },
      { id: 'v2', text: 'Сетевые технологии', deltas: { iq_analytical: 10 } },
      { id: 'v3', text: 'Интернет', deltas: {} },
    ],
  },
  {
    id: 'M09',
    module: 'chat',
    from: 'Алиса',
    subject: 'Формат файла',
    prompt: 'Преподу скидывать PDF или PPTX? В правилах написано: только PDF.',
    options: [
      { id: 'v1', text: 'PDF', deltas: { attention: 10 } },
      { id: 'v2', text: 'PPTX', deltas: { attention: -5 } },
      { id: 'v3', text: 'Скину оба формата - пусть сам выберет.', deltas: { attention: -5 } },
    ],
  },
  {
    id: 'M10',
    module: 'chat',
    from: 'Макс',
    subject: 'Делегирование',
    prompt: 'Я нашел кусок кода, но не знаю как сделать презентацию из этого.',
    options: [
      { id: 'v1', text: 'Скидывай - я сам все оформлю.', deltas: { leadership: -5 } },
      { id: 'v2', text: 'Алиса сделает дизайн слайдов, а мы вставим код.', deltas: { leadership: 10, teamwork: 5 } },
      { id: 'v3', text: 'Погугли как делать презентации - не сложно.', deltas: { teamwork: -5 } },
    ],
  },
  {
    id: 'M11',
    module: 'chat',
    from: 'Алиса',
    subject: 'Разделиться',
    prompt: 'Нам нужно разделиться. За что возьмешься прямо сейчас?',
    options: [
      { id: 'v1', text: 'Восстановлю код алгоритма.', deltas: { ent_mathphys: 10 } },
      { id: 'v2', text: 'Пересчитаю химические формулы для датчиков.', deltas: { ent_chembio: 10 } },
      { id: 'v3', text: 'Напишу текст для питча жюри.', deltas: { ent_humanities: 10 } },
    ],
  },
  {
    id: 'M12',
    module: 'chat',
    from: 'Алиса',
    subject: 'Биология',
    prompt: 'Датчик влажности сломан. Как растения теряют воду?',
    options: [
      { id: 'v1', text: 'Испарением через листья', deltas: {} },
      { id: 'v2', text: 'Транспирацией через устьица', deltas: { ent_chembio: 10 } },
      { id: 'v3', text: 'Фотосинтезом', deltas: {} },
    ],
  },
  {
    id: 'M13',
    module: 'chat',
    from: 'Макс',
    subject: 'Физика',
    prompt: 'Жюри спросит про насос. Формула механической работы A = ?',
    options: [
      { id: 'v1', text: 'F x S', deltas: { ent_mathphys: 10 } },
      { id: 'v2', text: 'm x g', deltas: {} },
      { id: 'v3', text: 'v / t', deltas: {} },
    ],
  },
  {
    id: 'M14',
    module: 'chat',
    from: 'Алиса',
    subject: 'Литература',
    prompt: 'Слоган "Зеленое сердце города" - это какой прием?',
    options: [
      { id: 'v1', text: 'Сравнение', deltas: {} },
      { id: 'v2', text: 'Метафора', deltas: { ent_humanities: 10 } },
      { id: 'v3', text: 'Эпитет', deltas: {} },
    ],
  },
  {
    id: 'M15',
    module: 'chat',
    from: 'Макс',
    subject: 'Математика',
    prompt: 'Теплица 5 на 4 метра. Слой почвы 0.5 метра. Сколько кубов земли закупать?',
    options: [
      { id: 'v1', text: '20 кубов', deltas: {} },
      { id: 'v2', text: '10 кубов', deltas: { ent_mathphys: 10 } },
      { id: 'v3', text: '15 кубов', deltas: {} },
    ],
  },
  {
    id: 'M16',
    module: 'chat',
    from: 'Алиса',
    subject: 'Фокус презентации',
    prompt: 'Не успеваем - от чего откажемся в презентации?',
    options: [
      { id: 'v1', text: 'Оставим код - уберем красивое описание.', deltas: { ent_mathphys: 10 } },
      { id: 'v2', text: 'Оставим анализ состава почвы - уберем графики.', deltas: { ent_chembio: 10 } },
      { id: 'v3', text: 'Оставим текст выступления - уберем технические схемы.', deltas: { ent_humanities: 10 } },
    ],
  },
  {
    id: 'M17',
    module: 'chat',
    from: 'Макс',
    subject: 'География',
    prompt: 'Где в Казахстане лучше строить теплицы - где больше солнца?',
    options: [
      { id: 'v1', text: 'На севере', deltas: {} },
      { id: 'v2', text: 'На юге', deltas: { ent_chembio: 10 } },
      { id: 'v3', text: 'На востоке', deltas: {} },
    ],
  },
  {
    id: 'M18',
    module: 'chat',
    from: 'Бот',
    subject: 'Английский',
    prompt: 'System failure. Reboot required. Что делаем?',
    options: [
      { id: 'v1', text: 'Выключаем компьютер - ошибка же.', deltas: {} },
      { id: 'v2', text: 'Перезагружаем систему.', deltas: { ent_humanities: 10 } },
      { id: 'v3', text: 'Зовем организаторов - мы не виноваты.', deltas: {} },
    ],
  },
  {
    id: 'M19',
    module: 'chat',
    from: 'Макс',
    subject: 'Информатика',
    prompt: 'В каком формате хранится код: 1011001?',
    options: [
      { id: 'v1', text: 'Десятичная система', deltas: {} },
      { id: 'v2', text: 'Шестнадцатеричная', deltas: {} },
      { id: 'v3', text: 'Двоичная', deltas: { ent_mathphys: 10 } },
    ],
  },
  {
    id: 'M20',
    module: 'chat',
    from: 'Алиса',
    subject: 'Один учебник',
    prompt: 'Если бы мог взять один учебник на хакатон - что бы взял?',
    options: [
      { id: 'v1', text: 'По программированию или математике.', deltas: { ent_mathphys: 10 } },
      { id: 'v2', text: 'По биологии или химии.', deltas: { ent_chembio: 10 } },
      { id: 'v3', text: 'По казахскому или русскому.', deltas: { ent_humanities: 10 } },
    ],
  },
  {
    id: 'M21',
    module: 'tasks',
    from: 'Хакатон',
    subject: 'Финальный час',
    prompt: 'Остался час. Кто пойдет выступать перед жюри?',
    options: [
      { id: 'v1', text: 'Я - легко продам нашу идею.', deltas: { leadership: 10 }, anchors: { entrepreneurship: 1 } },
      { id: 'v2', text: 'Иди ты - я лучше еще раз проверю код.', deltas: { analytical: 10 }, anchors: { mastery: 1 } },
      { id: 'v3', text: 'Давайте запишем видео-презентацию.', deltas: { ent_humanities: 10 } },
    ],
  },
  {
    id: 'M22',
    module: 'tasks',
    from: 'Хакатон',
    subject: 'Каверзные вопросы',
    prompt: 'Жюри будет задавать каверзные вопросы. Как готовимся?',
    options: [
      { id: 'v1', text: 'Покажем как работает прототип руками.', deltas: { ent_mathphys: 5, autonomy: 5 } },
      { id: 'v2', text: 'Выучим цифры и данные - будем опираться на факты.', deltas: { attention: 10, analytical: 5 } },
      { id: 'v3', text: 'Я буду отвечать - умею расположить людей.', deltas: { teamwork: 10, leadership: 5 } },
    ],
  },
  {
    id: 'M23',
    module: 'tasks',
    from: 'Хакатон',
    subject: 'Компромисс',
    prompt: 'Макс считает проект готовым, Алиса хочет все переделать. Что выбираешь?',
    options: [
      { id: 'v1', text: 'Макс прав - у нас нет времени.', deltas: { mediation: -5 } },
      { id: 'v2', text: 'Исправим только то, что жюри точно заметит.', deltas: { mediation: 10, analytical: 5 } },
      { id: 'v3', text: 'Алиса права - лучше сделать хорошо даже если не успеем.', deltas: { stress_tolerance: -5 } },
    ],
  },
  {
    id: 'M24',
    module: 'tasks',
    from: 'Хакатон',
    subject: '10 минут',
    prompt: 'Осталось 10 минут, а работы на полчаса!',
    options: [
      { id: 'v1', text: 'Паника - не успеваем!', deltas: { stress_tolerance: -5 } },
      { id: 'v2', text: 'Каждый делает только свою часть - без отвлечений.', deltas: { leadership: 10, stress_tolerance: 5 } },
      { id: 'v3', text: 'Сдаем что есть - главное участие.', deltas: {} },
    ],
  },
  {
    id: 'M25',
    module: 'tasks',
    from: 'Жюри',
    subject: 'Идея вторична',
    prompt: 'Ваша идея вторична - такие теплицы уже существуют.',
    options: [
      { id: 'v1', text: 'Ну да наверное - мы не знали...', deltas: { growth_mindset: -10 } },
      { id: 'v2', text: 'Возможно - но наш алгоритм эффективнее на 30%.', deltas: { growth_mindset: 10, analytical: 5 } },
      { id: 'v3', text: 'Неправда - мы проверяли конкурентов.', deltas: { stress_tolerance: 5 } },
    ],
  },
  {
    id: 'M26',
    module: 'tasks',
    from: 'Алиса',
    subject: 'После сцены',
    prompt: 'Я забыла слова на сцене... Так стыдно.',
    options: [
      { id: 'v1', text: 'Да, это было неловко.', deltas: { teamwork: -10 } },
      { id: 'v2', text: 'Все нормально - все волновались. Ты молодец что вышла.', deltas: { teamwork: 10, mediation: 5 } },
      { id: 'v3', text: 'Главное что мы выступили.', deltas: {} },
    ],
  },
  {
    id: 'M27',
    module: 'tasks',
    from: 'Макс',
    subject: 'Что было легче',
    prompt: 'Хакатон кончился. Что тебе давалось легче всего?',
    options: [
      { id: 'v1', text: 'Выступать и общаться с людьми.', deltas: { teamwork: 10, leadership: 5 } },
      { id: 'v2', text: 'Писать код и считать.', deltas: { ent_mathphys: 10, analytical: 5 } },
      { id: 'v3', text: 'Организовывать команду и следить за временем.', deltas: { attention: 10, leadership: 5 } },
    ],
  },
  {
    id: 'M28',
    module: 'tasks',
    from: 'Алиса',
    subject: 'Если повторить',
    prompt: 'Если бы делали это снова - что изменили бы?',
    options: [
      { id: 'v1', text: 'Лучше бы планировали время с самого начала.', deltas: { growth_mindset: 10, iq_analytical: 5 } },
      { id: 'v2', text: 'Ничего - нам просто не повезло.', deltas: { growth_mindset: -10 } },
      { id: 'v3', text: 'Я бы взял команду посильнее.', deltas: { teamwork: -5 } },
    ],
  },
  {
    id: 'M29',
    module: 'tasks',
    from: 'Жюри',
    subject: 'Грант',
    prompt: 'Мы даем вам грант! На что потратите?',
    options: [
      { id: 'v1', text: 'На оборудование и компьютеры.', deltas: { ent_mathphys: 10 } },
      { id: 'v2', text: 'На лабораторию и реактивы для исследований.', deltas: { ent_chembio: 10 } },
      { id: 'v3', text: 'На маркетинг и продвижение проекта.', deltas: { ent_humanities: 10 }, anchors: { entrepreneurship: 1 } },
    ],
  },
  {
    id: 'M30',
    module: 'tasks',
    from: 'Организаторы',
    subject: 'Следующий хакатон',
    prompt: 'Организаторы предлагают участвовать в более сложном хакатоне через месяц. Идете?',
    options: [
      { id: 'v1', text: 'Да - хотим попробовать еще раз, это было круто.', deltas: { growth_mindset: 10 } },
      { id: 'v2', text: 'Нет - это было слишком стрессово.', deltas: { growth_mindset: -5 } },
      { id: 'v3', text: 'Может быть - если найдем время подготовиться.', deltas: { analytical: 5 } },
    ],
  },
];

export function getAgeGroup(age: number): AgeGroup {
  return age <= 14 ? '12-14' : '15-17';
}

export function getPilotQuestions(ageGroup: AgeGroup, tier: TestTier): PilotQuestion[] {
  if (ageGroup === '12-14') return tier === 'basic' ? basicQuestions1214 : proQuestions1214;
  return tier === 'basic' ? basicQuestions1517 : pilotQuestions;
}
