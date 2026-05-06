// ============================================================
// pages/LoginPage.tsx
// Page de connexion du Core — authentifie via authService
// ============================================================

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Shield, Loader2 } from 'lucide-react';

import { authService } from '@/lib/auth/authService';
import { useAuthContext } from '@/lib/auth/AuthProvider';
import MagicRings from '@/components/MagicRings';

export default function LoginPage() {
  const navigate    = useNavigate();
  const { login }   = useAuthContext();

  const [username,   setUsername]   = useState('');
  const [password,   setPassword]   = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const data = await authService.login({ username: username.trim(), password });
      await login(data.accessToken, data.sessionId, data.user, data.permissions, data.roles);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(
        err?.message?.includes('401') || err?.status === 401
          ? 'Identifiants incorrects.'
          : err?.message ?? 'Erreur de connexion. Vérifiez que le service IAM est disponible.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--surface-background)' }}
    >
      {/* Fond décoratif */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.42, 0, 0.18, 1] }}
        style={{
          width:          '100%',
          maxWidth:       '420px',
          background:     'var(--glass-card-bg)',
          backdropFilter: 'var(--glass-card-blur)',
          WebkitBackdropFilter: 'var(--glass-card-blur)',
          border:         'var(--glass-card-border)',
          boxShadow:      'var(--glass-card-shadow)',
          borderRadius:   'var(--radius-xl)',
          padding:        'var(--space-8)',
          position:       'relative',
          zIndex:         1,
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div style={{ width: 80, height: 48, position: 'relative' }}>
            <MagicRings
              color="#818cf8" colorTwo="#4f46e5"
              ringCount={5} speed={0.8} attenuation={10}
              lineThickness={0.02} baseRadius={0.15} radiusStep={0.06}
              scaleRate={0.6} opacity={1} blur={0} noiseAmount={0.1}
              rotation={0} ringGap={1.5} fadeIn={0.7} fadeOut={0.5}
              followMouse={false} mouseInfluence={0.2} hoverScale={1.2}
              parallax={0.05} clickBurst={false}
            />
          </div>
          <div className="text-center">
            <h1 style={{
              fontSize:   'var(--fs-xl)',
              fontWeight: 'var(--fw-bold)',
              color:      'var(--surface-foreground)',
              margin:     0,
            }}>
              EGEN Platform
            </h1>
            <p style={{
              fontSize: 'var(--fs-sm)',
              color:    'var(--surface-mutedForeground)',
              margin:   'var(--space-1) 0 0',
            }}>
              Connectez-vous à votre espace
            </p>
          </div>
        </div>

        {/* Indicateur sécurisé */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          'var(--space-2)',
          background:   'var(--surface-accent)',
          borderRadius: 'var(--radius-md)',
          padding:      'var(--space-2) var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <Shield style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', color: 'var(--primary-500)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--surface-foreground)', fontWeight: 'var(--fw-medium)' }}>
            Connexion sécurisée — IAM Central
          </span>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Champ username */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
            <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--surface-foreground)' }}>
              Nom d'utilisateur
            </span>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute', left: 'var(--space-3)',
                top: '50%', transform: 'translateY(-50%)',
                width: 'var(--icon-sm)', height: 'var(--icon-sm)',
                color: 'var(--surface-mutedForeground)',
              }} />
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                disabled={isLoading}
                style={{
                  width:        '100%',
                  paddingLeft:  'calc(var(--space-3) + var(--icon-sm) + var(--space-2))',
                  paddingRight: 'var(--space-3)',
                  paddingTop:   'var(--space-2-5)',
                  paddingBottom:'var(--space-2-5)',
                  background:   'var(--surface-muted)',
                  border:       '1px solid var(--border-input)',
                  borderRadius: 'var(--radius-md)',
                  fontSize:     'var(--fs-sm)',
                  color:        'var(--surface-foreground)',
                  outline:      'none',
                  transition:   'var(--transition-glass)',
                  boxSizing:    'border-box',
                }}
              />
            </div>
          </label>

          {/* Champ mot de passe */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
            <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--surface-foreground)' }}>
              Mot de passe
            </span>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute', left: 'var(--space-3)',
                top: '50%', transform: 'translateY(-50%)',
                width: 'var(--icon-sm)', height: 'var(--icon-sm)',
                color: 'var(--surface-mutedForeground)',
              }} />
              <input
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                style={{
                  width:        '100%',
                  paddingLeft:  'calc(var(--space-3) + var(--icon-sm) + var(--space-2))',
                  paddingRight: 'calc(var(--space-3) + var(--icon-sm) + var(--space-2))',
                  paddingTop:   'var(--space-2-5)',
                  paddingBottom:'var(--space-2-5)',
                  background:   'var(--surface-muted)',
                  border:       '1px solid var(--border-input)',
                  borderRadius: 'var(--radius-md)',
                  fontSize:     'var(--fs-sm)',
                  color:        'var(--surface-foreground)',
                  outline:      'none',
                  transition:   'var(--transition-glass)',
                  boxSizing:    'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position:   'absolute', right: 'var(--space-3)',
                  top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color:      'var(--surface-mutedForeground)',
                  padding:    0,
                }}
              >
                {showPwd
                  ? <EyeOff style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
                  : <Eye    style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
                }
              </button>
            </div>
          </label>

          {/* Message d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding:      'var(--space-3)',
                background:   'rgba(239,68,68,0.10)',
                border:       '1px solid rgba(239,68,68,0.25)',
                borderRadius: 'var(--radius-md)',
                fontSize:     'var(--fs-sm)',
                color:        'var(--error-500)',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Bouton submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={isLoading ? {} : { scale: 1.02 }}
            whileTap={isLoading ? {} : { scale: 0.98 }}
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            'var(--space-2)',
              padding:        'var(--space-3)',
              background:     isLoading
                ? 'var(--primary-400)'
                : 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
              color:          '#ffffff',
              border:         'none',
              borderRadius:   'var(--radius-md)',
              fontSize:       'var(--fs-sm)',
              fontWeight:     'var(--fw-semibold)',
              cursor:         isLoading ? 'not-allowed' : 'pointer',
              transition:     'var(--transition-glass)',
              boxShadow:      'var(--shadow-sm)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2
                  style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', animation: 'spin 0.8s linear infinite' }}
                />
                Connexion en cours...
              </>
            ) : 'Se connecter'}
          </motion.button>
        </form>

        {/* Mode dev — info */}
        {import.meta.env.DEV && (
          <p style={{
            marginTop: 'var(--space-6)',
            fontSize:  'var(--fs-xs)',
            color:     'var(--surface-mutedForeground)',
            textAlign: 'center',
          }}>
            Mode développement — IAM : {import.meta.env.VITE_IAM_URL ?? 'http://localhost:3000'}
          </p>
        )}
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
