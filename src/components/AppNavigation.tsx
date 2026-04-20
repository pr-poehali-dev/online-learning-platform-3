import Icon from "@/components/ui/icon";
import { useAuth } from "@/lib/auth-context";
import { AppPage } from "@/pages/Index";

interface Props {
  page: AppPage;
  setPage: (p: AppPage) => void;
}

export default function AppNavigation({ page, setPage }: Props) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: "catalog" as AppPage, label: "Каталог", icon: "BookOpen" },
    ...(user?.role !== "admin"
      ? [{ id: "my-applications" as AppPage, label: "Мои заявки", icon: "ClipboardList" }]
      : [{ id: "admin" as AppPage, label: "Панель управления", icon: "Settings" }]),
  ];

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

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.role === "admin" ? "Администратор" : "Студент"}
                </div>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
              }`}>
                {user.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Icon name="LogOut" size={15} />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-border flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all ${
              page === item.id ? "text-primary border-t-2 border-primary -mt-px" : "text-muted-foreground"
            }`}
          >
            <Icon name={item.icon} size={16} />
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
