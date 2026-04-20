import Icon from "@/components/ui/icon";
import { Page, COURSES } from "./Index";

interface ProfilePageProps {
  setPage: (p: Page) => void;
}

const achievements = [
  { icon: "Zap", title: "Быстрый старт", desc: "Начали первый курс", unlocked: true },
  { icon: "Trophy", title: "Первая победа", desc: "Завершили курс", unlocked: true },
  { icon: "Target", title: "Отличник", desc: "100% в тесте", unlocked: true },
  { icon: "Flame", title: "Серия 7 дней", desc: "Учились 7 дней подряд", unlocked: false },
  { icon: "Star", title: "Эксперт", desc: "Завершили 5 курсов", unlocked: false },
  { icon: "Award", title: "Мастер", desc: "Завершили 10 курсов", unlocked: false },
];

export default function ProfilePage({ setPage }: ProfilePageProps) {
  const completedCourses = COURSES.filter((c) => c.completed === c.lessons);
  const inProgressCourses = COURSES.filter((c) => c.completed > 0 && c.completed < c.lessons);
  const totalLessons = COURSES.reduce((acc, c) => acc + c.completed, 0);
  const totalPercent = Math.round(
    (COURSES.reduce((acc, c) => acc + c.completed, 0) / COURSES.reduce((acc, c) => acc + c.lessons, 0)) * 100
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-black text-2xl">
            АИ
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-foreground">Алексей Иванов</h1>
          <p className="text-muted-foreground text-sm mb-1">alexey@example.com</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">Студент</span>
            <span className="text-xs text-muted-foreground">Зарегистрирован в апреле 2026</span>
          </div>
        </div>
        <button className="flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-all">
          <Icon name="Settings" size={15} />
          Настройки
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: "BookOpen", label: "Курсов начато", value: COURSES.filter(c => c.completed > 0).length },
          { icon: "CheckCircle", label: "Курсов завершено", value: completedCourses.length, color: "text-green-600" },
          { icon: "PlayCircle", label: "Уроков пройдено", value: totalLessons },
          { icon: "BarChart3", label: "Общий прогресс", value: `${totalPercent}%`, color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon name={s.icon} size={20} className="text-primary" />
            </div>
            <div className={`text-2xl font-black ${s.color || "text-foreground"}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Courses in progress */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Clock" size={16} className="text-primary" />
            В процессе
          </h2>
          {inProgressCourses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="BookOpen" size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Нет активных курсов</p>
              <button onClick={() => setPage("courses")} className="mt-3 text-primary text-sm font-medium hover:underline">
                Начать обучение →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {inProgressCourses.map((c) => {
                const progress = Math.round((c.completed / c.lessons) * 100);
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="BookOpen" size={15} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{c.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-secondary rounded-full h-1.5">
                          <div className="bg-primary rounded-full h-1.5" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs text-primary font-semibold w-8 text-right">{progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Icon name="CheckCircle" size={16} className="text-green-500" />
            Завершённые курсы
          </h2>
          {completedCourses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Trophy" size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Пока нет завершённых курсов</p>
            </div>
          ) : (
            <div className="space-y-2">
              {completedCourses.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{c.title}</div>
                    <div className="text-xs text-green-600">{c.lessons} уроков · {c.duration}</div>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                    <Icon name="Award" size={13} />
                    Сертификат
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl border border-border p-5 mt-6">
        <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Trophy" size={16} className="text-amber-500" />
          Достижения
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {achievements.map((a, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                a.unlocked
                  ? "border-amber-200 bg-amber-50"
                  : "border-border bg-secondary/30 opacity-50 grayscale"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                a.unlocked ? "bg-amber-100" : "bg-secondary"
              }`}>
                <Icon name={a.icon} size={20} className={a.unlocked ? "text-amber-600" : "text-muted-foreground"} />
              </div>
              <div className="text-xs font-bold text-foreground">{a.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
