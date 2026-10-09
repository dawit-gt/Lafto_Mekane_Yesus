// Hand-written to match supabase/migrations/0001_init.sql.
// Once you have a real Supabase project, regenerate the authoritative
// version with:
//   npx supabase gen types typescript --project-id <id> > src/types/database.ts

export type ContentStatus = "draft" | "published" | "archived";
export type SubmissionStatus = "new" | "in_progress" | "resolved" | "archived";

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { id: string; full_name: string; role: "admin"; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["admin_users"]["Row"]> & { id: string; full_name: string };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Row"]>;
        Relationships: [];
      };
      pages: {
        Row: { id: string; slug: string; title: string; body_md: string; status: ContentStatus; updated_by: string | null; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["pages"]["Row"]> & { slug: string; title: string };
        Update: Partial<Database["public"]["Tables"]["pages"]["Row"]>;
        Relationships: [];
      };
      locations: {
        Row: { id: string; name: string; address_line1: string; address_line2: string | null; city: string; region: string | null; postal_code: string | null; country: string; latitude: number | null; longitude: number | null; directions_note: string | null; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["locations"]["Row"]> & { name: string; address_line1: string; city: string };
        Update: Partial<Database["public"]["Tables"]["locations"]["Row"]>;
        Relationships: [];
      };
      leaders: {
        Row: { id: string; full_name: string; title: string; bio_md: string | null; photo_url: string | null; display_order: number; status: ContentStatus; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["leaders"]["Row"]> & { full_name: string; title: string };
        Update: Partial<Database["public"]["Tables"]["leaders"]["Row"]>;
        Relationships: [];
      };
      ministries: {
        Row: { id: string; slug: string; name: string; summary: string; description_md: string | null; meeting_info: string | null; contact_name: string | null; contact_email: string | null; contact_phone: string | null; image_url: string | null; status: ContentStatus; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["ministries"]["Row"]> & { slug: string; name: string; summary: string };
        Update: Partial<Database["public"]["Tables"]["ministries"]["Row"]>;
        Relationships: [];
      };
      sermon_series: {
        Row: { id: string; slug: string; title: string; description: string | null; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["sermon_series"]["Row"]> & { slug: string; title: string };
        Update: Partial<Database["public"]["Tables"]["sermon_series"]["Row"]>;
        Relationships: [];
      };
      sermons: {
        Row: { id: string; slug: string; title: string; description: string | null; speaker: string; scripture: string | null; series_id: string | null; sermon_date: string; thumbnail_url: string | null; video_url: string | null; audio_url: string | null; status: ContentStatus; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["sermons"]["Row"]> & { slug: string; title: string; speaker: string; sermon_date: string };
        Update: Partial<Database["public"]["Tables"]["sermons"]["Row"]>;
        Relationships: [];
      };
      events: {
        Row: { id: string; slug: string; title: string; description: string | null; image_url: string | null; start_at: string; end_at: string | null; timezone: string; location_id: string | null; ministry_id: string | null; registration_url: string | null; status: ContentStatus; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["events"]["Row"]> & { slug: string; title: string; start_at: string };
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
        Relationships: [];
      };
      stories: {
        Row: { id: string; slug: string; title: string; category: "testimony" | "ministry" | "community" | null; body_md: string; image_url: string | null; featured: boolean; status: ContentStatus; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["stories"]["Row"]> & { slug: string; title: string; body_md: string };
        Update: Partial<Database["public"]["Tables"]["stories"]["Row"]>;
        Relationships: [];
      };
      announcements: {
        Row: { id: string; title: string; body_md: string; publish_at: string; expires_at: string | null; status: ContentStatus; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["announcements"]["Row"]> & { title: string; body_md: string };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Row"]>;
        Relationships: [];
      };
      faqs: {
        Row: { id: string; question: string; answer_md: string; page_context: string; display_order: number; status: ContentStatus; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["faqs"]["Row"]> & { question: string; answer_md: string };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Row"]>;
        Relationships: [];
      };
      media: {
        Row: { id: string; title: string; kind: "image" | "document" | "video_embed"; url: string; alt_text: string | null; file_size_bytes: number | null; uploaded_by: string | null; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["media"]["Row"]> & { title: string; kind: "image" | "document" | "video_embed"; url: string };
        Update: Partial<Database["public"]["Tables"]["media"]["Row"]>;
        Relationships: [];
      };
      members: {
        Row: { id: string; auth_user_id: string | null; full_name: string; phone: string | null; marital_status: "married" | "not_married" | null; occupation: string | null; children_count: number | null; photo_path: string | null; membership_status: "active" | "inactive"; ministry_ids: string[]; directory_visible: boolean; created_at: string; updated_at: string };        Insert: Partial<Database["public"]["Tables"]["members"]["Row"]> & { full_name: string };
        Update: Partial<Database["public"]["Tables"]["members"]["Row"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: { id: string; name: string; email: string; phone: string | null; subject: string | null; message: string; status: SubmissionStatus; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]> & { name: string; email: string; message: string };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]>;
        Relationships: [];
      };
      prayer_requests: {
        Row: { id: string; name: string | null; email: string | null; is_confidential: boolean; request_text: string; status: SubmissionStatus; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["prayer_requests"]["Row"]> & { request_text: string };
        Update: Partial<Database["public"]["Tables"]["prayer_requests"]["Row"]>;
        Relationships: [];
      };
      volunteer_requests: {
        Row: { id: string; name: string; email: string; phone: string | null; ministry_interest: string | null; availability_note: string | null; status: SubmissionStatus; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["volunteer_requests"]["Row"]> & { name: string; email: string };
        Update: Partial<Database["public"]["Tables"]["volunteer_requests"]["Row"]>;
        Relationships: [];
      };
      giving_settings: {
        Row: { id: number; is_online_giving_enabled: boolean; provider_name: string | null; provider_url: string | null; informational_note: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["giving_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["giving_settings"]["Row"]>;
        Relationships: [];
      };
      site_settings: {
        Row: { id: number; service_times_md: string; default_locale: string; supported_locales: string[]; seo_default_title: string | null; seo_default_description: string | null; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: { id: string; actor_id: string | null; action: string; table_name: string; record_id: string | null; details: Record<string, unknown> | null; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]> & { action: string; table_name: string };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      content_status: ContentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Sermon = Database["public"]["Tables"]["sermons"]["Row"];
export type Ministry = Database["public"]["Tables"]["ministries"]["Row"];
export type Story = Database["public"]["Tables"]["stories"]["Row"];
export type Announcement = Database["public"]["Tables"]["announcements"]["Row"];
export type Faq = Database["public"]["Tables"]["faqs"]["Row"];
export type Leader = Database["public"]["Tables"]["leaders"]["Row"];
export type Location = Database["public"]["Tables"]["locations"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type GivingSettings = Database["public"]["Tables"]["giving_settings"]["Row"];
export type Page = Database["public"]["Tables"]["pages"]["Row"];
export type Member = Database["public"]["Tables"]["members"]["Row"];
export type Media = Database["public"]["Tables"]["media"]["Row"];