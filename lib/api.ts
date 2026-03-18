const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ferrumchat.onrender.com";

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function register(data: {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ─── User ────────────────────────────────────────────────────────────────────

export async function getMe() {
  const res = await fetch(`${BASE_URL}/api/me`, {
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function searchUsers(username: string) {
  const res = await fetch(`${BASE_URL}/api/users/search?username=${username}`, {
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}


// ─── Chats ───────────────────────────────────────────────────────────────────

export async function getChats(token: string) {
  const res = await fetch(`${BASE_URL}/api/chats`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createChat(token: string, receiver_id: string) {
  const res = await fetch(`${BASE_URL}/api/chats`, {
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
  const res = await fetch(`${BASE_URL}/api/chats/${chat_id}`, {
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
    `${BASE_URL}/api/chats/${chat_id}/messages?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    }
  );

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function editMessage(
  token: string,
  message_id: string,
  content: string
) {
  const res = await fetch(`${BASE_URL}/api/messages/${message_id}`, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function deleteMessage(
  token: string,
  message_id: string
) {
  const res = await fetch(`${BASE_URL}/api/messages/${message_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) throw await res.json();

  return true;
}


// ─── WebSocket ───────────────────────────────────────────────────────────────

export function connectWebSocket(token: string) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://ferrumchat.onrender.com";
  return new WebSocket(`${WS_URL}/ws?token=${token}`);
}