const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ferrumchat.onrender.com";

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function register(data: {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ─── User ────────────────────────────────────────────────────────────────────

export async function getMe() {
  const res = await fetch(`${BASE_URL}/me`, {
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ─── Chats ───────────────────────────────────────────────────────────────────

export async function getChats(token: string) {
  const res = await fetch(`${BASE_URL}/chats`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createChat(token: string, receiver_id: string) {
  const res = await fetch(`${BASE_URL}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",  
    body: JSON.stringify({ receiver_id }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function deleteChat(token: string, chat_id: string) {
  const res = await fetch(`${BASE_URL}/chats/${chat_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ─── Messages ────────────────────────────────────────────────────────────────

export async function getMessages(
  token: string,
  chat_id: string,
  page = 1,
  limit = 50
) {
  const res = await fetch(
    `${BASE_URL}/chats/${chat_id}/messages?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    }
  );
  if (!res.ok) throw await res.json();
  return res.json();
}

// ─── WebSocket ───────────────────────────────────────────────────────────────

export function connectWebSocket(token: string) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://https://ferrumchat.onrender.com";
  return new WebSocket(`${WS_URL}/ws?token=${token}`);
}