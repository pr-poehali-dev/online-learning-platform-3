import Icon from "@/components/ui/icon";
import { Page } from "@/pages/Index";

interface NavigationProps {
  page: Page;
  setPage: (p: Page) => void;
}

const navItems = [
  { id: "home" as Page, label: "Главная", icon: "Home" },
  { id: "courses" as Page, label: "Курсы", icon: "BookOpen" },
  { id: "lessons" as Page, label: "Уроки", icon: "PlayCircle" },
  { id: "profile" as Page, label: "Профиль", icon: "User" },
];

export default function Navigation({ page, setPage }: NavigationProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">LearnHub</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                page === item.id
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">АИ</span>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                page === item.id
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={item.icon} size={18} />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
