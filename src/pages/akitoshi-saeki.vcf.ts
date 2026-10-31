import type { APIRoute } from 'astro';
import { contact, socialLinks } from '../data/social';

// /links の「連絡先に追加」から読み込まれる vCard
export const GET: APIRoute = () => {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Saeki;Akitoshi;;;',
    'FN:Akitoshi Saeki',
    'ORG:The University of Electro-Communications',
    `EMAIL;TYPE=INTERNET,WORK:${contact.universityEmail}`,
    `EMAIL;TYPE=INTERNET,HOME:${contact.personalEmail}`,
    'URL:https://akitoshi-lab.com/',
    ...[socialLinks.linkedin, socialLinks.github, socialLinks.x].map((link) => `URL:${link.href}`),
    `NOTE:Amateur radio callsign: ${contact.callsign}`,
    'END:VCARD',
  ];
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/vcard; charset=utf-8' },
  });
};
