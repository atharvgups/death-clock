import { supabase } from '../supabaseClient';

export function Auth() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://death-clock-ten.vercel.app/auth/v1/callback'
      }
    });
  };

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <button onClick={signInWithGoogle} style={{ padding: 8, background: '#4285F4', color: 'white', border: 'none', borderRadius: 4 }}>
        Sign in with Google
      </button>
    </div>
  );
} 