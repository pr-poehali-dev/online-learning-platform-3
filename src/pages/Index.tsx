import { useState } from "react";
import HomePage from "./HomePage";
import CoursesPage from "./CoursesPage";
import LessonsPage from "./LessonsPage";
import ProfilePage from "./ProfilePage";
import Navigation from "@/components/Navigation";

export type Page = "home" | "courses" | "lessons" | "profile";

export interface Course {
  id: number;
  title: string;
  description: string;
  lessons: number;
  completed: number;
  category: string;
  level: string;
  duration: string;
}

export const COURSES: Course[] = [
  {
    id: 1,
    title: "Основы веб-разработки",
    description: "HTML, CSS и основы JavaScript для начинающих",
    lessons: 12,
    completed: 8,
    category: "Разработка",
    level: "Начинающий",
    duration: "6 часов",
  },
  {
    id: 2,
    title: "Python для анализа данных",
    description: "Pandas, NumPy и визуализация данных",
    lessons: 18,
    completed: 3,
    category: "Данные",
    level: "Средний",
    duration: "12 часов",
  },
  {
    id: 3,
    title: "UX/UI Дизайн",
    description: "Принципы дизайна, Figma и прототипирование",
    lessons: 10,
    completed: 10,
    category: "Дизайн",
    level: "Начинающий",
    duration: "8 часов",
  },
  {
    id: 4,
    title: "React — продвинутый курс",
    description: "Хуки, контекст, оптимизация и архитектура",
    lessons: 20,
    completed: 0,
    category: "Разработка",
    level: "Продвинутый",
    duration: "15 часов",
  },
  {
    id: 5,
    title: "Маркетинг в социальных сетях",
    description: "SMM-стратегии, контент и аналитика",
    lessons: 8,
    completed: 5,
    category: "Маркетинг",
    level: "Начинающий",
    duration: "4 часа",
  },
  {
    id: 6,
    title: "SQL и базы данных",
    description: "PostgreSQL, оптимизация запросов и архитектура БД",
    lessons: 14,
    completed: 0,
    category: "Данные",
    level: "Средний",
    duration: "10 часов",
  },
];

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [activeCourseId, setActiveCourseId] = useState<number>(1);

  const openCourse = (id: number) => {
    setActiveCourseId(id);
    setPage("lessons");
  };

  return (
    <div className="min-h-screen bg-background font-golos">
      <Navigation page={page} setPage={setPage} />
      <main className="pt-16">
        {page === "home" && <HomePage setPage={setPage} openCourse={openCourse} />}
        {page === "courses" && <CoursesPage openCourse={openCourse} />}
        {page === "lessons" && <LessonsPage courseId={activeCourseId} setPage={setPage} />}
        {page === "profile" && <ProfilePage setPage={setPage} />}
      </main>
    </div>
  );
}
