// ============================================================
// components/pages/auth/ChangePasswordPageContent.tsx
// Changement de mot de passe — POST /api/v1/tokens/change-password
// Backend attend: { old_password, new_password, confirm_password }
// ============================================================


import React, { useState } from 'react';
import { type Variants, type Transition, motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Eye, EyeOff, ShieldCheck, CheckCircle2,
  AlertCircle, Loader2, ArrowLeft, KeyRound,
} from 'lucide-react';
import { useChangePassword } from '@egen/esm-auth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { OutlinedField } from '@/components/fields/fields';
import { useNavigate } from 'react-router-dom';
import { Link } from '@/lib/Link';
import { AuthLayout } from './ui/AuthLayout';

// ── Force du mot de passe ─────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 caractères min', ok: password.length >= 8 },
    { label: 'Majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Minuscule', ok: /[a-z]/.test(password) },
    { label: 'Chiffre', ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const levels = ['Très faible', 'Faible', 'Acceptable', 'Fort', 'Très fort'];
  const barColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  if (!password) return null;

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 space-y-2">
      <div className="flex gap-1 h-1">
        {[0,1,2,3].map((i) => (
          <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i < score ? barColors[score] : 'bg-white/12'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">{levels[score]}</p>
        <div className="flex gap-3">
          {checks.map((c) => (
            <span key={c.label} className={`text-xs ${c.ok ? 'text-green-400' : 'text-white/25'}`}>
              {c.ok ? '✓' : '○'} {c.label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ChangePasswordMainContent() {
  const navigate = useNavigate();
  const { changePassword, isLoading, error, success, reset } = useChangePassword();
  const { toast } = useToast();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isPasswordStrong = /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword) && newPassword.length >= 8;
  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;
  const canSubmit = oldPassword && newPassword && confirmPassword === newPassword && isPasswordStrong && !isLoading && !success;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const result = await changePassword(oldPassword, newPassword);
    if (result.success) {
      toast({ variant: 'success', title: 'Mot de passe modifié', description: 'Votre mot de passe a été changé avec succès.', duration: 4000 });
      setTimeout(() => navigate('/auth/compte'), 2000);
    } else {
      toast({ variant: 'destructive', title: 'Erreur', description: result.error, duration: 5000 });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Link href="/auth/compte" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour au compte
      </Link>

      <div className="flex items-center gap-3 mb-7">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(12,17,91,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <KeyRound className="w-6 h-6 text-blue-300" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">Changer le mot de passe</h1>
          <p className="text-white/45 text-sm">Mettez à jour vos identifiants de connexion</p>
        </div>
      </div>

      {/* Succès */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 rounded-xl mb-5"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-green-300 font-medium text-sm">Mot de passe modifié !</p>
              <p className="text-green-400/60 text-xs">Redirection vers votre compte...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Ancien MDP */}
        <div className="relative">
          <OutlinedField label="Mot de passe actuel" type={showOld ? 'text' : 'password'}
            value={oldPassword} onChange={setOldPassword} fieldIcon={{ icon: Lock, position: 'left' }}
            placeholder="Votre mot de passe actuel" required disabled={isLoading || success}
          />
          <button type="button" onClick={() => setShowOld(!showOld)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 p-1" tabIndex={-1}
          >
            {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="border-t border-white/6 pt-5 space-y-4">
          {/* Nouveau MDP */}
          <div>
            <div className="relative">
              <OutlinedField label="Nouveau mot de passe" type={showNew ? 'text' : 'password'}
                value={newPassword} onChange={setNewPassword} fieldIcon={{ icon: Lock, position: 'left' }}
                placeholder="Minimum 8 caractères" required disabled={isLoading || success}
              />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 p-1" tabIndex={-1}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={newPassword} />
          </div>

          {/* Confirmation */}
          <div>
            <div className="relative">
              <OutlinedField label="Confirmer le nouveau mot de passe" type={showConfirm ? 'text' : 'password'}
                value={confirmPassword} onChange={setConfirmPassword} fieldIcon={{ icon: Lock, position: 'left' }}
                placeholder="Répétez le nouveau mot de passe" required disabled={isLoading || success}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 p-1" tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <AnimatePresence>
              {confirmMismatch && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-xs text-red-400 mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" /> Les mots de passe ne correspondent pas
                </motion.p>
              )}
              {confirmPassword && confirmPassword === newPassword && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-xs text-green-400 mt-1.5 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" /> Les mots de passe correspondent
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Erreur API */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2.5 p-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-300">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" className="w-full h-12 font-semibold"
          style={{ background: 'linear-gradient(135deg, #0C115B 0%, #1e3a8a 100%)', border: '1px solid rgba(255,255,255,0.12)' }}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Modification en cours...</span>
          ) : (
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" />Changer le mot de passe</span>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-white/20 mt-5">
        Après le changement, vos sessions actives resteront valides.
      </p>
    </div>
  );
}

export default function ChangePasswordPageContent() {
  return (
    <AuthLayout>
      <ChangePasswordMainContent />
    </AuthLayout>
  );
}
