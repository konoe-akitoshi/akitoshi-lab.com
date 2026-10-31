import { config } from '../settings/site-settings';

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  href: string;
  icon: string;
}

// About の Card と /links で共有するSNSリンク定義
export const socialLinks: Record<string, SocialLink> = {
  linkedin: { id: 'linkedin', label: 'LinkedIn', handle: 'Akitoshi Saeki', href: config.social.linkedin, icon: 'i-simple-icons-linkedin' },
  github: { id: 'github', label: 'GitHub', handle: 'konoe-akitoshi', href: config.social.github, icon: 'i-simple-icons-github' },
  x: { id: 'x', label: 'X', handle: config.social.twitter, href: config.social.twitterProf, icon: 'i-ri-twitter-x-fill' },
  zenn: { id: 'zenn', label: 'Zenn', handle: 'konoe_akitoshi', href: config.social.zenn, icon: 'i-simple-icons-zenn' },
  youtube: { id: 'youtube', label: 'YouTube', handle: 'Akitoshi', href: config.social.youtube, icon: 'i-simple-icons-youtube' },
  facebook: { id: 'facebook', label: 'Facebook', handle: 'Akitoshi Saeki', href: config.social.facebook, icon: 'i-simple-icons-facebook' },
  instagram: { id: 'instagram', label: 'Instagram', handle: '@nt_akitoshi', href: config.social.instagram, icon: 'i-simple-icons-instagram' },
};

export const contact = {
  callsign: 'JL1AVV',
  universityEmail: 'akitoshi.saeki@uec.ac.jp',
  personalEmail: 'info@akitoshi-lab.com',
};
