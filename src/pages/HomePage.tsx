import Icon from "@/components/ui/icon";
import { Page, COURSES } from "./Index";

interface HomePageProps {
  setPage: (p: Page) => void;
  openCourse: (id: number) => void;
}

const stats = [
  { value: "2 400+", label: "Студентов", icon: "Users" },
  { value: "48", label: "Курсов", icon: "BookOpen" },
  { value: "94%", label: "Завершают обучение", icon: "TrendingUp" },
  { value: "4.9", label: "Средняя оценка", icon: "Star" },
];

export default function HomePage({ setPage, openCourse }: HomePageProps) {
  const inProgress = COURSES.filter((c) => c.completed > 0 && c.completed < c.lessons);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 border-b border-border">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #4f63eb 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-6">
              <Icon name="Sparkles" size={14} />
              Умная система проверки знаний
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-tight mb-6">
              Учись эффективно.<br />
              <span className="text-primary">Расти быстро.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Онлайн-платформа с автоматическими тестами, отслеживанием прогресса и структурированными курсами по востребованным направлениям.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPage("courses")}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
              >
                <Icon name="Rocket" size={18} />
                Начать обучение
              </button>
              <button
                onClick={() => setPage("courses")}
                className="inline-flex items-center gap-2 bg-white text-foreground px-6 py-3 rounded-xl font-semibold text-base border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
              >
                <Icon name="Search" size={18} />
                Смотреть курсы
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-border text-center hover-lift"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon name={stat.icon} size={20} className="text-primary" />
              </div>
              <div className="text-2xl font-black text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Continue learning */}
      {inProgress.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Продолжить обучение</h2>
            <button
              onClick={() => setPage("courses")}
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              Все курсы <Icon name="ArrowRight" size={14} />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {inProgress.slice(0, 3).map((course) => {
              const progress = Math.round((course.completed / course.lessons) * 100);
              return (
                <button
                  key={course.id}
                  onClick={() => openCourse(course.id)}
                  className="bg-white rounded-2xl p-5 border border-border text-left hover-lift group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon name="BookOpen" size={18} className="text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.completed} из {course.lessons} уроков</p>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div
                      className="bg-primary rounded-full h-1.5 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs font-medium text-primary">{progress}%</div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="bg-slate-50 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-10 text-center">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "CheckCircle",
                title: "Автоматическая проверка",
                desc: "Тесты проверяются мгновенно. Система сразу показывает правильные ответы и объяснения.",
              },
              {
                icon: "BarChart3",
                title: "Отслеживание прогресса",
                desc: "Подробная статистика по каждому курсу, уроку и тесту. Всегда знайте свой уровень.",
              },
              {
                icon: "Trophy",
                title: "Сертификаты",
                desc: "После завершения курса получайте сертификат, подтверждающий ваши знания.",
              },
            ].map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name={f.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
