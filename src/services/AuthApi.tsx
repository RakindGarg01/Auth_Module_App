// const BASE_URL = 'https://some-actors-hammer.loca.lt/api/auth/login';
const BASE_URL = 'https://rockiness-passable-gibberish.ngrok-free.dev/api/auth';


export async function loginApi(email: string, password: string) {
     const url = `${BASE_URL}/login`;
     const payload = {email, password};
     console.log('REQUEST', url, JSON.stringify({email}));

     const response = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
     });

     const raw = await response.text();
     console.log('RESPONSE', response.status, raw);

     let data = null;
     try {
          data = JSON.parse(raw);
     } catch {}

          if (!response.ok) {
          throw new Error(
               data?.message ?? data?.error ?? `Login failed (${response.status})`,
          );
     }
     return data;
}