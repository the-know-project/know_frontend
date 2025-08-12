const SECRET = "temp-secret-123456"

export async function encryptData(data: any) {
  const enc = new TextEncoder();
  const key = await getKeyFromSecret(SECRET);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(data)
  );

  return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(encrypted)));
}

export async function decryptData(cipherText: any) {
  const data = atob(cipherText);
  const iv = new Uint8Array(data.slice(0, 12).split("").map(c => c.charCodeAt(0)));
  const encData = new Uint8Array(data.slice(12).split("").map(c => c.charCodeAt(0)));

  const key = await getKeyFromSecret(SECRET);

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encData);
  return new TextDecoder().decode(decrypted);
}

async function getKeyFromSecret(SECRET: string) {
  const enc = new TextEncoder().encode(SECRET);
  const hash = await crypto.subtle.digest("SHA-256", enc); // 32 bytes
  return crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

