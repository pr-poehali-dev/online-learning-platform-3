import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Icon from "@/components/ui/icon";

interface Application {
  id: number;
  status: string;
  comment: string;
  created_at: string;
  item: { id: number; type: string; title: string; category: string };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "На рассмотрении", color: "bg-amber-100 text-amber-700", icon: "Clock" },
  approved: { label: "Одобрена", color: "bg-green-100 text-green-700", icon: "CheckCircle" },
  rejected: { label: "Отклонена", color: "bg-red-100 text-red-700", icon: "XCircle" },
  waitlist: { label: "Лист ожидания", color: "bg-blue-100 text-blue-700", icon: "Users" },
  in_progress: { label: "В процессе", color: "bg-violet-100 text-violet-700", icon: "PlayCircle" },
  completed: { label: "Завершено", color: "bg-secondary text-muted-foreground", icon: "CheckCircle2" },
};

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getApplications()
      .then((data: unknown) => setApps((data as { applications: Application[] }).applications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="h-8 bg-secondary rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-5 animate-pulse h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground mb-2">Мои заявки</h1>
        <p className="text-muted-foreground">История ваших заявок на курсы и кружки</p>
      </div>

      {apps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="ClipboardList" size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Заявок пока нет</h3>
          <p className="text-sm text-muted-foreground">Перейдите в каталог и запишитесь на интересный курс или кружок</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => {
            const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
            const date = new Date(app.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

            return (
              <div key={app.id} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      app.item.type === "course" ? "bg-blue-100" : "bg-emerald-100"
                    }`}>
                      <Icon
                        name={app.item.type === "course" ? "BookOpen" : "Users"}
                        size={18}
                        className={app.item.type === "course" ? "text-blue-600" : "text-emerald-600"}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{app.item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{app.item.category}</span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-xs text-muted-foreground">
                          {app.item.type === "course" ? "Курс" : "Кружок"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${s.color}`}>
                    <Icon name={s.icon} size={13} />
                    {s.label}
                  </span>
                </div>

                {app.comment && (
                  <div className="mt-3 ml-13 pl-13 border-l-2 border-border ml-[52px] pl-0">
                    <div className="bg-secondary/50 rounded-xl px-3 py-2 mt-3">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Комментарий администратора</p>
                      <p className="text-sm text-foreground">{app.comment}</p>
                    </div>
                  </div>
                )}

                <div className="mt-3 text-xs text-muted-foreground">Заявка подана {date}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
