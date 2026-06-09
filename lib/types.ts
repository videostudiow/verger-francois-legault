export interface SiteContent {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface SiteColor {
  id: string;
  key: string;
  value: string;
  label: string;
}

export interface SiteInfo {
  id: string;
  key: string;
  value: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  created_at: string;
}
