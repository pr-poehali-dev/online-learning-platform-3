import { useState } from "react";
import Icon from "@/components/ui/icon";
import { COURSES } from "./Index";

interface CoursesPageProps {
  openCourse: (id: number) => void;
}

const categories = ["Все", "Разработка", "Данные", "Дизайн", "Маркетинг"];
const levels: Record<string, string> = {
  Начинающий: "bg-green-100 text-green-700",
  Средний: "bg-amber-100 text-amber-700",
  Продвинутый: "bg-red-100 text-red-700",
};

export default function CoursesPage({ openCourse }: CoursesPageProps) {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");

  const filtered = COURSES.filter((c) => {
    const matchCat = activeCategory === "Все" || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground mb-2">Все курсы</h1>
        <p className="text-muted-foreground">Выберите курс и начните обучение прямо сейчас</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск курсов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="SearchX" size={40} className="mx-auto mb-4 opacity-30" />
          <p>Курсы не найдены</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course, i) => {
            const progress = Math.round((course.completed / course.lessons) * 100);
            const done = course.completed === course.lessons;

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-border overflow-hidden hover-lift group cursor-pointer"
                onClick={() => openCourse(course.id)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="h-2 bg-secondary">
                  <div
                    className={`h-2 transition-all duration-500 ${done ? "bg-green-500" : "bg-primary"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levels[course.level] || "bg-secondary text-muted-foreground"}`}>
                      {course.level}
                    </span>
                    {done && (
                      <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <Icon name="CheckCircle" size={14} />
                        Завершён
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{course.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="PlayCircle" size={13} />
                      {course.lessons} уроков
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={13} />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Tag" size={13} />
                      {course.category}
                    </span>
                  </div>

                  {progress > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className={`font-semibold ${done ? "text-green-600" : "text-primary"}`}>{progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1">
                        <div
                          className={`rounded-full h-1 ${done ? "bg-green-500" : "bg-primary"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
