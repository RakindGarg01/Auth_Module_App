
const BASE_URL = 'https://rockiness-passable-gibberish.ngrok-free.dev/api';

export async function apiRequest<T>(
  endpoint: string,
  token?: string,
  method: 'GET' | 'POST' = 'GET',
  body?: object,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    },
    ...(body ? {body: JSON.stringify(body)} : {}),
  });

  // const data = await response.json();
  const responseText = await response.text();

let data: any;

try {
  data = JSON.parse(responseText);
} catch {
  throw new Error(
    `Invalid response from ${endpoint}. HTTP ${response.status}. Response starts with: ${responseText.slice(0, 120)}`,
  );
}

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data as T;
}
