import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Icon from "@/components/ui/icon";

interface Application {
  id: number;
  status: string;
  comment: string;
  created_at: string;
  user: { id: number; name: string; email: string };
  item: { id: number; type: string; title: string; category: string };
}

interface Item {
  id: number;
  type: string;
  title: string;
  category: string;
  teacher: string;
  is_active: boolean;
  app_count: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "Ожидает", color: "bg-amber-100 text-amber-700", icon: "Clock" },
  approved: { label: "Одобрена", color: "bg-green-100 text-green-700", icon: "CheckCircle" },
  rejected: { label: "Отклонена", color: "bg-red-100 text-red-700", icon: "XCircle" },
  waitlist: { label: "Лист ожидания", color: "bg-blue-100 text-blue-700", icon: "Users" },
  in_progress: { label: "В процессе", color: "bg-violet-100 text-violet-700", icon: "PlayCircle" },
  completed: { label: "Завершено", color: "bg-secondary text-muted-foreground", icon: "CheckCircle2" },
};

const STATUSES = ["pending", "approved", "rejected", "waitlist", "in_progress", "completed"];

export default function AdminPage() {
  const [tab, setTab] = useState<"applications" | "items">("applications");
  const [apps, setApps] = useState<Application[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [comment, setComment] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ type: "course", title: "", description: "", category: "", teacher: "", schedule: "", max_students: 20, price: "Бесплатно" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getApplications().then((d: unknown) => setApps((d as { applications: Application[] }).applications)),
      api.getAdminItems().then((d: unknown) => setItems((d as { items: Item[] }).items)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async () => {
    if (!selected || !newStatus) return;
    setUpdating(selected.id);
    try {
      await api.updateApplication(selected.id, newStatus, comment);
      setApps((prev) => prev.map((a) => a.id === selected.id ? { ...a, status: newStatus, comment } : a));
      showToast("Статус обновлён", true);
      setSelected(null);
      setComment("");
    } catch (err: unknown) {
      showToast((err as Error).message, false);
    } finally {
      setUpdating(null);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createItem(newItem as Record<string, unknown>);
      const d = (await api.getAdminItems()) as { items: Item[] };
      setItems(d.items);
      setShowAddItem(false);
      setNewItem({ type: "course", title: "", description: "", category: "", teacher: "", schedule: "", max_students: 20, price: "Бесплатно" });
      showToast("Добавлено успешно!", true);
    } catch (err: unknown) {
      showToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const filteredApps = apps.filter((a) => filter === "all" || a.status === filter);
  const pendingCount = apps.filter((a) => a.status === "pending").length;

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

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border w-full max-w-md shadow-2xl">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Изменить статус заявки</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-secondary rounded-lg">
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">{selected.item.title}</p>
                <p className="text-sm text-muted-foreground">{selected.user.name} · {selected.user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Новый статус</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Выберите статус</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Комментарий (необязательно)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Причина отклонения или дополнительная информация..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-all"
                >
                  Отмена
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!newStatus || !!updating}
                  className="flex-1 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  {updating ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground mb-1">Панель администратора</h1>
          <p className="text-muted-foreground text-sm">Управление заявками и каталогом</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-medium text-sm">
            <Icon name="Bell" size={16} />
            {pendingCount} новых заявок
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Всего заявок", value: apps.length, icon: "ClipboardList", color: "text-foreground" },
          { label: "Ожидают", value: apps.filter(a => a.status === "pending").length, icon: "Clock", color: "text-amber-600" },
          { label: "Одобрено", value: apps.filter(a => a.status === "approved").length, icon: "CheckCircle", color: "text-green-600" },
          { label: "Курсов и кружков", value: items.length, icon: "BookOpen", color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-4 text-center">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-2">
              <Icon name={s.icon} size={18} className={s.color} />
            </div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary p-1 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setTab("applications")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "applications" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          Заявки
        </button>
        <button
          onClick={() => setTab("items")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "items" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          Курсы и кружки
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : tab === "applications" ? (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {[{ id: "all", label: "Все" }, ...STATUSES.map(s => ({ id: s, label: STATUS_CONFIG[s]?.label || s }))].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filter === f.id ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
                {f.id !== "all" && apps.filter(a => a.status === f.id).length > 0 && (
                  <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                    {apps.filter(a => a.status === f.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredApps.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-12 text-center text-muted-foreground">
              <Icon name="ClipboardList" size={36} className="mx-auto mb-3 opacity-30" />
              <p>Заявок нет</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredApps.map((app) => {
                const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                const date = new Date(app.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

                return (
                  <div key={app.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4 hover:border-primary/20 transition-colors group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      app.item.type === "course" ? "bg-blue-100" : "bg-emerald-100"
                    }`}>
                      <Icon name={app.item.type === "course" ? "BookOpen" : "Users"} size={18} className={app.item.type === "course" ? "text-blue-600" : "text-emerald-600"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground text-sm truncate">{app.item.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {app.user.name} · {app.user.email} · {date}
                      </div>
                      {app.comment && <div className="text-xs text-muted-foreground mt-0.5 italic truncate">"{app.comment}"</div>}
                    </div>
                    <button
                      onClick={() => { setSelected(app); setNewStatus(app.status); setComment(app.comment || ""); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-all flex-shrink-0"
                    >
                      <Icon name="Edit" size={13} />
                      Изменить
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddItem(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
            >
              <Icon name="Plus" size={16} />
              Добавить курс / кружок
            </button>
          </div>

          {/* Add form */}
          {showAddItem && (
            <div className="bg-white rounded-2xl border border-primary/30 p-5 mb-4">
              <h3 className="font-bold text-foreground mb-4">Новый курс / кружок</h3>
              <form onSubmit={handleAddItem} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Тип</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="course">Курс</option>
                    <option value="circle">Кружок</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Название *</label>
                  <input required value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} placeholder="Название" className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Описание</label>
                  <textarea value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} placeholder="Описание" rows={2} className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Категория</label>
                  <input value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))} placeholder="Разработка, Дизайн..." className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Преподаватель</label>
                  <input value={newItem.teacher} onChange={e => setNewItem(p => ({ ...p, teacher: e.target.value }))} placeholder="Имя преподавателя" className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Расписание</label>
                  <input value={newItem.schedule} onChange={e => setNewItem(p => ({ ...p, schedule: e.target.value }))} placeholder="Пн, Ср 18:00–19:30" className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Цена</label>
                  <input value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} placeholder="Бесплатно" className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="button" onClick={() => setShowAddItem(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-all">Отмена</button>
                  <button type="submit" disabled={saving} className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60">
                    {saving ? "Сохранение..." : "Добавить"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.type === "course" ? "bg-blue-100" : "bg-emerald-100"
                }`}>
                  <Icon name={item.type === "course" ? "BookOpen" : "Users"} size={18} className={item.type === "course" ? "text-blue-600" : "text-emerald-600"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{item.title}</span>
                    <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{item.category}</span>
                    {!item.is_active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Неактивен</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.teacher} · {item.app_count} заявок</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
