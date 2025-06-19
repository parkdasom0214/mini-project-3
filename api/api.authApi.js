// api/authApi.js
export async function login(userId, password) {
  const response = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: userId, password })
  });

  const result = await response.json();
  return { ok: response.ok, result };
}
