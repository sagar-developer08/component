// Lightweight AES-GCM encrypt/decrypt helpers using Web Crypto API
// NOTE: This provides transport obfuscation in the browser. Do not treat as
// strong secret storage, since the key is present in client code.

const DEFAULT_SECRET = process.env.NEXT_PUBLIC_COOKIE_SECRET || 'qliq-cookie-secret';

function bufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // avoid call stack limits
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const sub = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, sub);
  }
  return btoa(binary);
}

function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getKey(secret) {
  const enc = new TextEncoder().encode(secret);
  const hash = await crypto.subtle.digest('SHA-256', enc);
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encryptText(plainText, secret = DEFAULT_SECRET) {
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(plainText);
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  const ivB64 = bufferToBase64(iv.buffer);
  const cipherB64 = bufferToBase64(cipherBuffer);
  return `${ivB64}.${cipherB64}`;
}

export async function decryptText(payload, secret = DEFAULT_SECRET) {
  const [ivB64, cipherB64] = (payload || '').split('.');
  if (!ivB64 || !cipherB64) return '';
  const key = await getKey(secret);
  const iv = new Uint8Array(base64ToBuffer(ivB64));
  const cipherBuffer = base64ToBuffer(cipherB64);
  const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBuffer);
  return new TextDecoder().decode(plainBuffer);
}

export default { encryptText, decryptText };


