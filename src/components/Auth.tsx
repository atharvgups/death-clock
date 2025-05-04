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

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <button onClick={signInWithGoogle} style={{ padding: 8, background: '#4285F4', color: 'white', border: 'none', borderRadius: 4 }}>
        Sign in with Google
      </button>
      <button onClick={signOut} style={{ padding: 8, background: '#222', color: 'white', border: 'none', borderRadius: 4 }}>
        Sign out
      </button>
    </div>
  );
} 