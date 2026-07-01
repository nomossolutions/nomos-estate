import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure user has a role record
      await supabase.rpc('ensure_user_role');

      const isLocalEnv = process.env.NODE_ENV === 'development';
      // Use NEXT_PUBLIC_SITE_URL in production to avoid redirect issues when
      // Supabase Site URL is still pointing to localhost.
      const baseUrl = isLocalEnv
        ? origin
        : (process.env.NEXT_PUBLIC_SITE_URL ??
          `https://${request.headers.get('x-forwarded-host') ?? new URL(request.url).host}`);

      return NextResponse.redirect(`${baseUrl}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
