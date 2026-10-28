// Fabrique les bruitages de Matou (synthèse simple, aucun fichier tiers) dans public/brand/sons/.
// Usage : npx tsx scripts/generate-sounds.ts
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const dossier = path.resolve(import.meta.dirname, '..', 'public', 'brand', 'sons');
fs.mkdirSync(dossier, {recursive: true});

const ecrireWav = (nom: string, s: Float32Array) => {
  const n = s.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  let max = 0;
  for (const v of s) max = Math.max(max, Math.abs(v));
  const g = max > 0 ? 0.89 / max : 1;
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s[i] * g)) * 32767), 44 + i * 2);
  fs.writeFileSync(path.join(dossier, nom), buf);
};

const vide = (sec: number) => new Float32Array(Math.round(sec * SR));
let graine = 7;
const bruit = () => {
  graine = (graine * 16807) % 2147483647;
  return (graine / 2147483647) * 2 - 1;
};

// Note de marimba : fondamentale + partiel à 4×, attaque nette, extinction rapide.
const marimba = (s: Float32Array, t0: number, f: number, dur = 0.5, amp = 1) => {
  const i0 = Math.round(t0 * SR);
  for (let i = 0; i < dur * SR && i0 + i < s.length; i++) {
    const t = i / SR;
    const att = Math.min(1, t / 0.003);
    s[i0 + i] +=
      amp * att * (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 7) + 0.35 * Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-t * 28));
  }
};

// 1. transition : un « fffit » de feuille qui glisse
{
  const s = vide(0.28);
  let lp = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / s.length;
    const a = 0.02 + 0.35 * t; // filtre qui s'ouvre
    lp += a * (bruit() - lp);
    s[i] = lp * Math.sin(Math.PI * t) ** 2;
  }
  ecrireWav('transition.wav', s);
}
// 2. tampon : coup sourd + claquement
{
  const s = vide(0.3);
  for (let i = 0; i < s.length; i++) {
    const t = i / SR;
    s[i] = Math.sin(2 * Math.PI * (110 - 50 * t) * t) * Math.exp(-t * 22) + 0.5 * bruit() * Math.exp(-t * 90);
  }
  ecrireWav('tampon.wav', s);
}
// 3. pop : petite bulle
{
  const s = vide(0.12);
  let phase = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / SR;
    phase += (2 * Math.PI * (380 + 5200 * t)) / SR;
    s[i] = Math.sin(phase) * Math.exp(-t * 38);
  }
  ecrireWav('pop.wav', s);
}
// 4. verdict : « ding » de clochette
{
  const s = vide(1.1);
  for (let i = 0; i < s.length; i++) {
    const t = i / SR;
    s[i] =
      Math.sin(2 * Math.PI * 1318.5 * t) * Math.exp(-t * 4) +
      0.4 * Math.sin(2 * Math.PI * 1318.5 * 2.76 * t) * Math.exp(-t * 9) +
      0.2 * Math.sin(2 * Math.PI * 1318.5 * 5.4 * t) * Math.exp(-t * 16);
  }
  ecrireWav('verdict.wav', s);
}
// 5. signature : « Ma-tou ! » en trois notes de marimba (sol, mi, do aigu) + ding
{
  const s = vide(1.6);
  marimba(s, 0.0, 783.99, 0.5, 0.9);
  marimba(s, 0.16, 659.25, 0.5, 0.9);
  marimba(s, 0.34, 1046.5, 0.9, 1);
  marimba(s, 0.34, 523.25, 0.9, 0.5);
  ecrireWav('signature.wav', s);
}
console.log(`Bruitages écrits dans ${path.relative(process.cwd(), dossier)}`);
