const URLS = {
  auth: "https://functions.poehali.dev/ed851101-d357-4987-a02d-314d0197073c",
  items: "https://functions.poehali.dev/c6d648c0-d640-4373-a9c6-8700c243d260",
  adminItems: "https://functions.poehali.dev/2d6a9447-0089-48f4-bcef-4ceb2859699a",
  applications: "https://functions.poehali.dev/1968a8f5-67b2-4fdf-b7a0-b26e6d7f19e5",
};

function getToken() {
  return localStorage.getItem("token") || "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Authorization": `Bearer ${getToken()}`,
  };
}

async function req(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
    if (typeof data === "string") data = JSON.parse(data);
  } catch {
    data = text;
  }
  if (!res.ok) {
    const err = (data as Record<string, string>)?.error || "Ошибка сервера";
    throw new Error(err);
  }
  return data;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    req(URLS.auth, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", name, email, password }),
    }),

  login: (email: string, password: string) =>
    req(URLS.auth, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    }),

  me: () =>
    req(URLS.auth, {
      method: "GET",
      headers: authHeaders(),
    }),

  getItems: (type?: string) =>
    req(`${URLS.items}${type ? `?type=${type}` : ""}`, { method: "GET" }),

  getAdminItems: () =>
    req(URLS.adminItems, {
      method: "GET",
      headers: authHeaders(),
    }),

  createItem: (data: Record<string, unknown>) =>
    req(URLS.adminItems, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  updateItem: (data: Record<string, unknown>) =>
    req(URLS.adminItems, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  getApplications: () =>
    req(URLS.applications, {
      method: "GET",
      headers: authHeaders(),
    }),

  apply: (item_id: number) =>
    req(URLS.applications, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ item_id }),
    }),

  updateApplication: (id: number, status: string, comment?: string) =>
    req(URLS.applications, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ id, status, comment: comment || "" }),
    }),
};