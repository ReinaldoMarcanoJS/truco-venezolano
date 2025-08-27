export type SupabaseUser = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string;
  phone: string;
  is_anonymous: boolean;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  identities: any[]; // Puedes tipar mejor si lo necesitas
  user_metadata: {
    email: string;
    email_verified: boolean;
    name?: string;
    phone_verified?: boolean;
    sub?: string;
    [key: string]: any;
  };
};