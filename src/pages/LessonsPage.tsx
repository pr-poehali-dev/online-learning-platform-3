import { useState } from "react";
import Icon from "@/components/ui/icon";
import { COURSES, Page } from "./Index";

interface LessonsPageProps {
  courseId: number;
  setPage: (p: Page) => void;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

const LESSONS_DATA: Record<number, { title: string; content: string; questions: Question[] }[]> = {
  1: [
    {
      title: "Введение в HTML",
      content: "HTML — это язык разметки гипертекста. Он описывает структуру веб-страниц с помощью тегов. Каждый тег имеет открывающую и закрывающую часть. Основные теги: <html>, <head>, <body>, <h1>-<h6>, <p>, <a>, <img>.",
      questions: [
        { id: 1, text: "Что означает аббревиатура HTML?", options: ["HyperText Markup Language", "High Technology Modern Language", "HyperText Making Links", "Home Tool Markup Language"], correct: 0 },
        { id: 2, text: "Какой тег используется для создания ссылки?", options: ["<link>", "<href>", "<a>", "<url>"], correct: 2 },
        { id: 3, text: "Сколько уровней заголовков в HTML?", options: ["4", "5", "6", "7"], correct: 2 },
      ],
    },
    {
      title: "Основы CSS",
      content: "CSS (Cascading Style Sheets) определяет внешний вид HTML-элементов. Стили задаются правилами: селектор { свойство: значение }. Можно применять цвета, шрифты, отступы, размеры и многое другое.",
      questions: [
        { id: 1, text: "Как задать цвет текста в CSS?", options: ["text-color: red", "color: red", "font-color: red", "text: red"], correct: 1 },
        { id: 2, text: "Что означает «каскадность» в CSS?", options: ["Стили падают вниз", "Приоритет применения стилей", "Нет правильного ответа", "Скорость загрузки"], correct: 1 },
      ],
    },
    {
      title: "JavaScript основы",
      content: "JavaScript — язык программирования для создания интерактивных веб-страниц. Переменные объявляются через let и const. Функции — основной строительный блок JS. Работа с DOM позволяет изменять страницу динамически.",
      questions: [
        { id: 1, text: "Как объявить константу в JS?", options: ["var x = 1", "let x = 1", "const x = 1", "define x = 1"], correct: 2 },
        { id: 2, text: "Какой метод выводит сообщение в консоль?", options: ["console.log()", "print()", "alert()", "output()"], correct: 0 },
      ],
    },
  ],
  2: [
    {
      title: "Введение в Python",
      content: "Python — популярный язык программирования для анализа данных. Прост в изучении, имеет богатую экосистему библиотек: pandas, numpy, matplotlib.",
      questions: [
        { id: 1, text: "Какой тип данных используется для списков в Python?", options: ["array", "list", "tuple", "set"], correct: 1 },
        { id: 2, text: "Как вывести текст в Python?", options: ["echo", "console.log", "print()", "write()"], correct: 2 },
      ],
    },
  ],
};

const DEFAULT_LESSONS = [
  {
    title: "Введение в курс",
    content: "Добро пожаловать на курс! Здесь вы узнаете основные концепции и получите практические навыки. Изучайте материалы последовательно и проходите тесты для закрепления знаний.",
    questions: [
      { id: 1, text: "Зачем нужен этот курс?", options: ["Для развлечения", "Для получения знаний", "Для получения сертификата", "Для общения"], correct: 1 },
    ],
  },
];

export default function LessonsPage({ courseId, setPage }: LessonsPageProps) {
  const course = COURSES.find((c) => c.id === courseId)!;
  const lessonsData = LESSONS_DATA[courseId] || DEFAULT_LESSONS;

  const [activeLesson, setActiveLesson] = useState(0);
  const [showTest, setShowTest] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(
    new Set(Array.from({ length: course.completed }, (_, i) => i))
  );

  const lesson = lessonsData[activeLesson];
  const totalQuestions = lesson?.questions.length || 0;
  const correctCount = submitted
    ? lesson.questions.filter((q) => answers[q.id] === q.correct).length
    : 0;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const handleSubmit = () => {
    if (Object.keys(answers).length < totalQuestions) return;
    setSubmitted(true);
    if (score >= 60) {
      setCompletedLessons((prev) => new Set([...prev, activeLesson]));
    }
  };

  const resetTest = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const goNext = () => {
    if (activeLesson < lessonsData.length - 1) {
      setActiveLesson(activeLesson + 1);
      setShowTest(false);
      resetTest();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setPage("courses")}
          className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
        >
          <Icon name="ArrowLeft" size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground">{course.title}</h1>
          <p className="text-sm text-muted-foreground">{completedLessons.size} из {lessonsData.length} уроков завершено</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar lessons list */}
        <div className="bg-white rounded-2xl border border-border p-4 h-fit">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 px-1">Уроки курса</h3>
          <div className="space-y-1">
            {lessonsData.map((l, i) => {
              const done = completedLessons.has(i);
              const active = activeLesson === i;
              return (
                <button
                  key={i}
                  onClick={() => { setActiveLesson(i); setShowTest(false); resetTest(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    done ? "bg-green-500 text-white" : active ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                  }`}>
                    {done ? <Icon name="Check" size={12} /> : i + 1}
                  </div>
                  <span className="text-sm font-medium truncate">{l.title}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Общий прогресс</span>
              <span className="font-semibold text-primary">
                {Math.round((completedLessons.size / lessonsData.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div
                className="bg-primary rounded-full h-1.5 transition-all duration-500"
                style={{ width: `${Math.round((completedLessons.size / lessonsData.length) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {!showTest ? (
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Урок {activeLesson + 1}
                </span>
                {completedLessons.has(activeLesson) && (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                    <Icon name="CheckCircle" size={12} />
                    Завершён
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-foreground mb-6">{lesson.title}</h2>

              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed mb-8">
                <p className="text-base text-foreground/80 leading-relaxed">{lesson.content}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowTest(true)}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all"
                >
                  <Icon name="ClipboardCheck" size={16} />
                  Пройти тест
                </button>
                {activeLesson < lessonsData.length - 1 && (
                  <button
                    onClick={goNext}
                    className="flex items-center gap-2 bg-secondary text-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all"
                  >
                    Следующий урок
                    <Icon name="ArrowRight" size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-foreground">Тест: {lesson.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{totalQuestions} вопросов</p>
                </div>
                <button
                  onClick={() => { setShowTest(false); resetTest(); }}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>

              {submitted && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-4 ${
                  score >= 60 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    score >= 60 ? "bg-green-100" : "bg-red-100"
                  }`}>
                    <Icon name={score >= 60 ? "Trophy" : "RefreshCw"} size={22} className={score >= 60 ? "text-green-600" : "text-red-500"} />
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${score >= 60 ? "text-green-700" : "text-red-600"}`}>
                      {score >= 60 ? "Отлично!" : "Попробуйте ещё раз"}
                    </div>
                    <div className={`text-sm ${score >= 60 ? "text-green-600" : "text-red-500"}`}>
                      Правильных ответов: {correctCount} из {totalQuestions} ({score}%)
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {lesson.questions.map((q, qi) => {
                  const userAns = answers[q.id];
                  const isCorrect = submitted && userAns === q.correct;
                  const isWrong = submitted && userAns !== undefined && userAns !== q.correct;

                  return (
                    <div key={q.id} className={`rounded-2xl border p-4 transition-all ${
                      isCorrect ? "border-green-200 bg-green-50/50" :
                      isWrong ? "border-red-200 bg-red-50/50" :
                      "border-border"
                    }`}>
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                          isCorrect ? "bg-green-500 text-white" :
                          isWrong ? "bg-red-500 text-white" :
                          "bg-primary/10 text-primary"
                        }`}>
                          {qi + 1}
                        </span>
                        <p className="font-semibold text-foreground text-sm leading-relaxed">{q.text}</p>
                      </div>
                      <div className="space-y-2 ml-10">
                        {q.options.map((opt, oi) => {
                          const selected = userAns === oi;
                          const isCorrectOpt = oi === q.correct;
                          let optClass = "border border-border bg-white hover:border-primary/40 hover:bg-primary/5";
                          if (submitted) {
                            if (isCorrectOpt) optClass = "border-green-500 bg-green-50 text-green-700";
                            else if (selected && !isCorrectOpt) optClass = "border-red-400 bg-red-50 text-red-600";
                            else optClass = "border-border bg-secondary/30 text-muted-foreground";
                          } else if (selected) {
                            optClass = "border-primary bg-primary/10 text-primary";
                          }

                          return (
                            <button
                              key={oi}
                              onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${optClass}`}
                              disabled={submitted}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selected && !submitted ? "border-primary bg-primary" :
                                submitted && isCorrectOpt ? "border-green-500 bg-green-500" :
                                submitted && selected ? "border-red-400 bg-red-400" :
                                "border-current opacity-30"
                              }`}>
                                {(selected || (submitted && isCorrectOpt)) && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-3">
                {!submitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < totalQuestions}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="Send" size={16} />
                    Проверить ответы
                  </button>
                ) : (
                  <>
                    <button
                      onClick={resetTest}
                      className="flex items-center gap-2 bg-secondary text-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all"
                    >
                      <Icon name="RefreshCw" size={16} />
                      Пройти заново
                    </button>
                    {score >= 60 && activeLesson < lessonsData.length - 1 && (
                      <button
                        onClick={goNext}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-all"
                      >
                        Следующий урок
                        <Icon name="ArrowRight" size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
