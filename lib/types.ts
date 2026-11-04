/**
 * Shapes shared between the server content layer (`lib/db.ts`) and the site chrome
 * components (Header/Footer). Kept free of Supabase/react imports so client components
 * can depend on the type without pulling server code into the bundle.
 */
export type ContactInfo = {
  adminOffice: { label: string; address: string; phone: string; email: string };
  opsBase: { label: string; address: string; phone: string };
};
