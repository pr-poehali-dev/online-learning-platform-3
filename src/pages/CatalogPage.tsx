import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Icon from "@/components/ui/icon";

interface Item {
  id: number;
  type: "course" | "circle";
  title: string;
  description: string;
  category: string;
  teacher: string;
  schedule: string;
  max_students: number;
  price: string;
}

const levelColors: Record<string, string> = {
  Разработка: "bg-blue-100 text-blue-700",
  Данные: "bg-violet-100 text-violet-700",
  Дизайн: "bg-pink-100 text-pink-700",
  Маркетинг: "bg-orange-100 text-orange-700",
  Спорт: "bg-green-100 text-green-700",
  Искусство: "bg-rose-100 text-rose-700",
  Языки: "bg-amber-100 text-amber-700",
  Технологии: "bg-cyan-100 text-cyan-700",
};

export default function CatalogPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "course" | "circle">("all");
  const [search, setSearch] = useState("");
  const [applying, setApplying] = useState<number | null>(null);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    api.getItems()
      .then((data: unknown) => setItems((data as { items: Item[] }).items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      api.getApplications()
        .then((data: unknown) => {
          const apps = (data as { applications: { item: { id: number } }[] }).applications;
          setApplied(new Set(apps.map((a) => a.item.id)));
        })
        .catch(() => {});
    }
  }, [user]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApply = async (item: Item) => {
    if (!user) return;
    setApplying(item.id);
    try {
      await api.apply(item.id);
      setApplied((prev) => new Set([...prev, item.id]));
      showToast(`Заявка на «${item.title}» отправлена!`, true);
    } catch (err: unknown) {
      showToast((err as Error).message, false);
    } finally {
      setApplying(null);
    }
  };

  const filtered = items.filter((i) => {
    if (filter !== "all" && i.type !== filter) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up ${
          toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          <Icon name={toast.ok ? "CheckCircle" : "AlertCircle"} size={16} />
          {toast.msg}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground mb-2">Каталог</h1>
        <p className="text-muted-foreground">Выберите курс или кружок и подайте заявку</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: "all", label: "Все" },
            { id: "course", label: "Курсы" },
            { id: "circle", label: "Кружки" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-5 animate-pulse">
              <div className="h-4 bg-secondary rounded mb-3 w-2/3" />
              <div className="h-3 bg-secondary rounded mb-2 w-full" />
              <div className="h-3 bg-secondary rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="SearchX" size={40} className="mx-auto mb-4 opacity-30" />
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const isApplied = applied.has(item.id);
            const catColor = levelColors[item.category] || "bg-secondary text-muted-foreground";

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-border overflow-hidden hover-lift group">
                <div className={`h-1.5 ${item.type === "course" ? "bg-primary" : "bg-emerald-500"}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${catColor}`}>
                      {item.category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      item.type === "course"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {item.type === "course" ? "Курс" : "Кружок"}
                    </span>
                  </div>

                  <h3 className="font-bold text-foreground text-lg mb-1.5 group-hover:text-primary transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="User" size={13} className="flex-shrink-0" />
                      <span>{item.teacher}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={13} className="flex-shrink-0" />
                      <span>{item.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="Users" size={13} className="flex-shrink-0" />
                      <span>До {item.max_students} студентов</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-bold text-foreground text-sm">{item.price}</span>
                    {user ? (
                      <button
                        onClick={() => handleApply(item)}
                        disabled={isApplied || applying === item.id}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isApplied
                            ? "bg-green-100 text-green-700 cursor-default"
                            : "bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                        }`}
                      >
                        {applying === item.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isApplied ? (
                          <Icon name="Check" size={14} />
                        ) : (
                          <Icon name="Send" size={14} />
                        )}
                        {isApplied ? "Заявка подана" : "Подать заявку"}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Войдите для записи</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
