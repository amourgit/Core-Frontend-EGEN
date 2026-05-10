// ============================================================
// components/pages/auth/ForgotPasswordPageContent.tsx
// Mot de passe oublié — page publique (sans AuthLayout)
// Pas d'endpoint dédié backend : la demande est envoyée à
// l'admin IAM. On simule la soumission avec un feedback propre.
// ============================================================


import React, { useState, useEffect } from 'react';
import { type Variants, type Transition, motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound, ArrowLeft, User, Mail, CheckCircle2,
  ShieldAlert, Loader2, Phone, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OutlinedField } from '@/components/fields/fields';
import { Link } from '@/lib/Link';
import { useNavigate } from 'react-router-dom';

// ── Arrière-plan ──────────────────────────────────────────
function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background1.webp')", opacity: 0.8 }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60" />
      {/* Orbes */}
      {[
        { top: '20%', left: '8%',  w: 'w-40 h-40', delay: '0s' },
        { top: '65%', right: '10%', w: 'w-28 h-28', delay: '1.2s' },
        { top: '45%', left: '60%', w: 'w-20 h-20', delay: '0.6s' },
      ].map((o, i) => (
        <div
          key={i}
          className={`absolute ${o.w} rounded-full animate-pulse`}
          style={{
            top: o.top, left: o.left, right: o.right,
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            animationDelay: o.delay,
          }}
        />
      ))}
    </div>
  );
}

// ── Étape 1 : Formulaire ──────────────────────────────────
function FormStep({ onSubmit, isLoading }: {
  onSubmit: (identifier: string) => void;
  isLoading: boolean;
}) {
  const [identifier, setIdentifier] = useState('');

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icône */}
      <div className="flex justify-center mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
            boxShadow: '0 4px 20px rgba(245,158,11,0.15)',
          }}
        >
          <KeyRound className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      {/* Titre */}
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-white mb-2">Mot de passe oublié ?</h1>
        <p className="text-white/50 text-sm leading-relaxed">
          Renseignez votre identifiant. Votre administrateur IAM
          sera notifié pour réinitialiser votre accès.
        </p>
      </div>

      {/* Champ identifiant */}
      <div className="space-y-4">
        <OutlinedField
          label="Identifiant ou email"
          type="text"
          value={identifier}
          onChange={setIdentifier}
          fieldIcon={{ icon: User, position: 'left' }}
          placeholder="Votre nom d'utilisateur ou email"
          autoComplete="username"
          required
          disabled={isLoading}
        />

        {/* Info box */}
        <div
          className="flex items-start gap-2.5 p-3 rounded-xl"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300/80 leading-relaxed">
            Pour les comptes reliés à IAM Central, le reset de mot de passe
            s'effectue via votre portail institutionnel.
          </p>
        </div>

        {/* Bouton */}
        <Button
          onClick={() => onSubmit(identifier)}
          disabled={!identifier.trim() || isLoading}
          className="w-full h-12 font-semibold"
          style={{
            background: 'linear-gradient(135deg, #0C115B 0%, #1e3a8a 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Envoyer la demande
            </span>
          )}
        </Button>
      </div>

      {/* Contact direct */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-xs text-white/35 bg-transparent">
              ou contacter directement
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <a
            href="mailto:admin@iam.local"
            className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-white/70">Administrateur IAM</p>
              <p className="text-xs text-white/35">admin@iam.local</p>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ── Étape 2 : Confirmation ────────────────────────────────
function ConfirmStep({ identifier, onBack }: {
  identifier: string;
  onBack: () => void;
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      key="confirm"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      {/* Icône succès */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="flex justify-center mb-6"
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)',
            boxShadow: '0 4px 30px rgba(34,197,94,0.15)',
          }}
        >
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
      </motion.div>

      <h2 className="text-xl font-bold text-white mb-2">Demande envoyée</h2>
      <p className="text-white/50 text-sm mb-6 leading-relaxed">
        Votre demande de réinitialisation a été transmise à l'administrateur IAM.
        Vous serez contacté dans les plus brefs délais.
      </p>

      {/* Identifiant envoyé */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl mb-6 text-left"
        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
      >
        <ShieldAlert className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-blue-300/70 mb-0.5">Demande soumise pour</p>
          <p className="text-sm text-white/80 font-medium font-mono truncate">{identifier}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={() => navigate('/auth/login')}
          className="w-full h-11 font-semibold"
          style={{
            background: 'linear-gradient(135deg, #0C115B 0%, #1e3a8a 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          Retour à la connexion
        </Button>
        <button
          onClick={onBack}
          className="w-full text-sm text-white/40 hover:text-white/60 transition-colors py-2"
        >
          Soumettre une autre demande
        </button>
      </div>
    </motion.div>
  );
}

// ── Composant principal ───────────────────────────────────
export default function ForgotPasswordPageContent() {
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [isLoading, setIsLoading]   = useState(false);

  const handleSubmit = async (value: string) => {
    setIsLoading(true);
    // Simuler un délai réseau réaliste
    await new Promise((r) => setTimeout(r, 1200));
    setIdentifier(value);
    setSubmitted(true);
    setIsLoading(false);
  };

  const handleBack = () => {
    setSubmitted(false);
    setIdentifier('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <Background />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Bouton retour — toujours visible */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour à la connexion
        </Link>

        {/* Carte principale */}
        <div
          className="rounded-2xl p-8 overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <FormStep
                key="form"
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            ) : (
              <ConfirmStep
                key="confirm"
                identifier={identifier}
                onBack={handleBack}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Bas de page */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/30">Connexion sécurisée IAM Local</span>
        </div>
      </motion.div>
    </div>
  );
}
