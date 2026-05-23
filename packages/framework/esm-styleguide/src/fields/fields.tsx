"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { AlertTriangle, AlertCircle, CheckCircle, type LucideIcon } from "lucide-react"

// ── Règles de validation ──────────────────────────────────────────────
export interface ValidationRule {
  regex: RegExp
  message: string
  type: "warning" | "error" | "success"
}

export interface ValidationConfig {
  rules: ValidationRule[]
  realTimeValidation?: boolean
  triggerVibration?: boolean
  showIcons?: boolean
  showMessages?: boolean
  /** Délai en ms avant la validation temps-réel (debounce) */
  debounceMs?: number
}

export interface FieldIcon {
  icon: LucideIcon
  position?: "left" | "label"
}

export interface BaseFieldProps {
  label?: string
  placeholder?: string
  type?: "text" | "email" | "password" | "tel" | "url" | "number" | "search"
  value?: string
  onChange?: (value: string) => void
  className?: string
  disabled?: boolean
  required?: boolean
  autoComplete?: string
  autoFocus?: boolean
  fieldIcon?: FieldIcon
  validation?: ValidationConfig
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onValidationChange?: (validation: ValidationRule | null) => void
  /**
   * Couleur de fond du label flottant — obligatoire sur fond glass/translucide
   * pour que le label "coupe" visuellement la bordure.
   * Exemple : "rgba(15,23,42,0.75)" pour un card glass sombre.
   * Par défaut transparent (context classique).
   */
  labelBg?: string
  /** Padding horizontal supplémentaire côté droit (ex. quand bouton eye présent) */
  rightPadding?: string
}

const defaultValidation: ValidationConfig = {
  rules: [],
  realTimeValidation: true,
  triggerVibration: true,
  showIcons: true,
  showMessages: true,
  debounceMs: 0,
}

// ── Couleurs de validation via CSS vars du thème ──────────────────────
const VALIDATION_COLORS = {
  success: {
    text:   "var(--success-400, #4ade80)",
    border: "var(--success-500, #22c55e)",
    msg:    "var(--success-400, #4ade80)",
  },
  error: {
    text:   "var(--error-400, #f87171)",
    border: "var(--error-500, #ef4444)",
    msg:    "var(--error-400, #f87171)",
  },
  warning: {
    text:   "var(--warning-400, #fbbf24)",
    border: "var(--warning-500, #f59e0b)",
    msg:    "var(--warning-400, #fbbf24)",
  },
} as const

// ── Hook de validation avec debounce ─────────────────────────────────
const useFieldValidation = (
  inputValue: string,
  validation: ValidationConfig,
  onValidationChange?: (validation: ValidationRule | null) => void
) => {
  const [currentValidation, setCurrentValidation] = useState<ValidationRule | null>(null)
  const [isAnimating,       setIsAnimating]       = useState(false)
  const [animationType,     setAnimationType]     = useState<"error"|"success"|"warning"|null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerAnimation = useCallback((type: "warning" | "error" | "success") => {
    if (!validation.triggerVibration) return
    setAnimationType(type)
    setIsAnimating(true)
    if (navigator.vibrate) {
      const patterns = { error: [100, 50, 100], warning: [50, 30, 50], success: [30] }
      navigator.vibrate(patterns[type])
    }
    setTimeout(() => { setIsAnimating(false); setAnimationType(null) }, 700)
  }, [validation.triggerVibration])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const delay = validation.debounceMs ?? 0
    debounceRef.current = setTimeout(() => {
      if (!validation.realTimeValidation || !inputValue || validation.rules.length === 0) {
        setCurrentValidation(null)
        onValidationChange?.(null)
        return
      }

      const failedRule = validation.rules.find(r => !r.regex.test(inputValue))
      if (failedRule) {
        if (currentValidation?.type !== failedRule.type) triggerAnimation(failedRule.type)
        setCurrentValidation(failedRule)
        onValidationChange?.(failedRule)
      } else {
        const successRule = validation.rules.find(r => r.type === "success" && r.regex.test(inputValue))
        if (successRule) {
          if (currentValidation?.type !== "success") triggerAnimation("success")
          setCurrentValidation(successRule)
          onValidationChange?.(successRule)
        } else {
          setCurrentValidation(null)
          onValidationChange?.(null)
        }
      }
    }, delay)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, validation.realTimeValidation, validation.rules, validation.debounceMs])

  return { currentValidation, isAnimating, animationType }
}

// ── Icône de validation animée ────────────────────────────────────────
const ValidationIcon: React.FC<{
  currentValidation: ValidationRule | null
  showIcons: boolean
  animationType: "error" | "success" | "warning" | null
}> = ({ currentValidation, showIcons, animationType }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [prevType,  setPrevType]  = useState<string | null>(null)
  const [isSwapping, setIsSwapping] = useState(false)

  useEffect(() => {
    if (currentValidation && showIcons) {
      if (prevType && prevType !== currentValidation.type) {
        // Transition entre états : sortie puis entrée
        setIsSwapping(true)
        setIsVisible(false)
        setTimeout(() => {
          setPrevType(currentValidation.type)
          setIsSwapping(false)
          setTimeout(() => setIsVisible(true), 30)
        }, 200)
      } else {
        setPrevType(currentValidation.type)
        setTimeout(() => setIsVisible(true), 50)
      }
    } else {
      setIsVisible(false)
      if (!currentValidation) setTimeout(() => setPrevType(null), 300)
    }
  }, [currentValidation, showIcons])

  if (!showIcons || !currentValidation) return null

  const IconMap = { success: CheckCircle, error: AlertCircle, warning: AlertTriangle }
  const IconComponent = IconMap[currentValidation.type as keyof typeof IconMap]
  if (!IconComponent) return null

  const color = VALIDATION_COLORS[currentValidation.type as keyof typeof VALIDATION_COLORS]?.text
    ?? "rgba(255,255,255,0.5)"

  // Animation selon le type
  const iconAnim = animationType === "error"
    ? "validIconShake 0.5s ease-out"
    : animationType === "success"
      ? "validIconBounce 0.5s ease-out"
      : "validIconSlide 0.35s cubic-bezier(0.16,1,0.3,1)"

  return (
    <div
      style={{
        position:          "absolute",
        right:             "0.75rem",
        top:               "50%",
        transform:         isVisible && !isSwapping ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.5)",
        opacity:           isVisible && !isSwapping ? 1 : 0,
        transition:        "opacity 0.25s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        zIndex:            10,
        pointerEvents:     "none",
      }}
    >
      <IconComponent
        style={{
          width:    "1.125rem",
          height:   "1.125rem",
          color,
          animation: isVisible ? iconAnim : "none",
          filter:   `drop-shadow(0 0 6px ${color})`,
        }}
      />
    </div>
  )
}

// ── Icône de champ (position left ou label) ───────────────────────────
const FieldIconComponent: React.FC<{
  fieldIcon?: FieldIcon
  color?: string
}> = ({ fieldIcon, color }) => {
  if (!fieldIcon) return null
  const Ic = fieldIcon.icon
  return (
    <Ic
      style={{
        width:      "1rem",
        height:     "1rem",
        color:      color ?? "rgba(255,255,255,0.5)",
        transition: "color var(--dur-normal,200ms) ease",
        flexShrink: 0,
      }}
    />
  )
}

// ── Message de validation animé ───────────────────────────────────────
const ValidationMessage: React.FC<{
  currentValidation: ValidationRule | null
  showMessages: boolean
  fieldId: string
}> = ({ currentValidation, showMessages, fieldId }) => {
  const [visible, setVisible] = useState(false)
  const [text,    setText]    = useState<ValidationRule | null>(null)

  useEffect(() => {
    if (currentValidation && showMessages) {
      setText(currentValidation)
      setTimeout(() => setVisible(true), 30)
    } else {
      setVisible(false)
      setTimeout(() => setText(null), 250)
    }
  }, [currentValidation, showMessages])

  if (!text) return null

  const color = VALIDATION_COLORS[text.type as keyof typeof VALIDATION_COLORS]?.msg
    ?? "rgba(255,255,255,0.5)"

  const prefixes = { success: "✓", error: "✕", warning: "⚠" }
  const prefix = prefixes[text.type as keyof typeof prefixes] ?? ""

  return (
    <p
      id={`${fieldId}_help`}
      style={{
        marginTop:   "0.375rem",
        fontSize:    "var(--fs-xs, 0.75rem)",
        color,
        opacity:     visible ? 1 : 0,
        transform:   visible ? "translateY(0)" : "translateY(-6px)",
        transition:  "opacity 0.25s ease, transform 0.25s ease",
        display:     "flex",
        alignItems:  "center",
        gap:         "0.25rem",
        fontWeight:  "500",
        letterSpacing: "0.01em",
        filter:      `drop-shadow(0 0 4px ${color}40)`,
        paddingLeft: "0.125rem",
      }}
    >
      <span style={{ fontFamily: "monospace", fontSize: "0.85em", opacity: 0.8 }}>{prefix}</span>
      {text.message}
    </p>
  )
}

// ──────────────────────────────────────────────────────────────────────
// KEYFRAMES inline partagés entre tous les composants Field
// ──────────────────────────────────────────────────────────────────────
const FIELD_KEYFRAMES = `
@keyframes validIconShake {
  0%,100%{ transform: translateY(-50%) scale(1) rotate(0deg); }
  15%    { transform: translateY(-50%) scale(1.15) rotate(-12deg); }
  30%    { transform: translateY(-50%) scale(1.1)  rotate(10deg); }
  45%    { transform: translateY(-50%) scale(1.05) rotate(-8deg); }
  60%    { transform: translateY(-50%) scale(1.02) rotate(5deg); }
}
@keyframes validIconBounce {
  0%  { transform: translateY(-50%) scale(0.5); opacity:0; }
  60% { transform: translateY(-60%) scale(1.2); opacity:1; }
  80% { transform: translateY(-45%) scale(0.95); }
  100%{ transform: translateY(-50%) scale(1);  opacity:1; }
}
@keyframes validIconSlide {
  0%  { transform: translateY(-50%) scale(0.5) translateX(8px); opacity:0; }
  100%{ transform: translateY(-50%) scale(1)   translateX(0);   opacity:1; }
}
@keyframes fieldShake {
  0%,100%{ transform: translateX(0); }
  20%    { transform: translateX(-5px); }
  40%    { transform: translateX(5px); }
  60%    { transform: translateX(-3px); }
  80%    { transform: translateX(3px); }
}
`

// ──────────────────────────────────────────────────────────────────────
// OutlinedField — Champ avec bordure Material Design adapté glass
// ──────────────────────────────────────────────────────────────────────
export const OutlinedField: React.FC<BaseFieldProps> = ({
  label,
  placeholder = " ",
  type = "text",
  value = "",
  onChange,
  className = "",
  disabled = false,
  required = false,
  autoComplete,
  autoFocus,
  fieldIcon,
  validation = defaultValidation,
  onFocus,
  onBlur,
  onValidationChange,
  labelBg,
  rightPadding,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [isFocused,  setIsFocused]  = useState(false)

  const { currentValidation, isAnimating, animationType } = useFieldValidation(
    inputValue, validation, onValidationChange,
  )

  useEffect(() => {
    if (value !== inputValue) setInputValue(value)
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); onChange?.(e.target.value)
  }
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => { setIsFocused(true);  onFocus?.(e) }
  const handleBlur  = (e: React.FocusEvent<HTMLInputElement>) => { setIsFocused(false); onBlur?.(e)  }

  // Couleurs dynamiques selon l'état
  const stateColor = currentValidation
    ? VALIDATION_COLORS[currentValidation.type as keyof typeof VALIDATION_COLORS]
    : null

  const borderColor = stateColor
    ? stateColor.border
    : isFocused
      ? "var(--primary-400, #818cf8)"
      : "rgba(255,255,255,0.20)"

  const labelColor = stateColor
    ? stateColor.text
    : isFocused
      ? "var(--primary-300, #a5b4fc)"
      : "rgba(255,255,255,0.50)"

  const hasLeftIcon  = fieldIcon?.position === "left"
  const hasLabelIcon = fieldIcon?.position === "label"
  const fieldId      = `outlined_${label?.toLowerCase().replace(/\s+/g, "_") ?? "field"}`

  // Padding droit : espace pour l'icône de validation + bouton optionnel
  const prRight = rightPadding ?? (validation.showIcons && currentValidation ? "2.5rem" : "0.75rem")

  return (
    <div className={className} style={{ position: "relative" }}>
      <style>{FIELD_KEYFRAMES}</style>

      <div
        style={{
          position: "relative",
          animation: isAnimating && animationType === "error" ? "fieldShake 0.5s ease-out" : "none",
        }}
      >
        {/* Icône gauche */}
        {hasLeftIcon && (
          <div
            style={{
              position:  "absolute",
              left:      "0.75rem",
              top:       "50%",
              transform: "translateY(-50%)",
              zIndex:    10,
            }}
          >
            <FieldIconComponent fieldIcon={fieldIcon} color={labelColor} />
          </div>
        )}

        {/* Input */}
        <input
          id={fieldId}
          type={type}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-describedby={validation.showMessages && currentValidation ? `${fieldId}_help` : undefined}
          style={{
            display:         "block",
            width:           "100%",
            paddingTop:      "1rem",
            paddingBottom:   "0.625rem",
            paddingLeft:     hasLeftIcon ? "2.5rem" : "0.75rem",
            paddingRight:    prRight,
            fontSize:        "var(--fs-sm, 0.875rem)",
            lineHeight:      "var(--fs-sm-lh, 1.25rem)",
            background:      "transparent",
            borderRadius:    "var(--radius-md, 0.75rem)",
            border:          `1.5px solid ${borderColor}`,
            outline:         "none",
            color:           "#ffffff",
            transition:      "border-color var(--dur-normal,200ms) ease, box-shadow var(--dur-normal,200ms) ease",
            boxShadow:       isFocused
              ? `0 0 0 2px ${stateColor?.border ?? "var(--primary-500,#6366f1)"}28, inset 0 1px 0 rgba(255,255,255,0.05)`
              : "inset 0 1px 0 rgba(255,255,255,0.04)",
            cursor:          disabled ? "not-allowed" : "text",
            opacity:         disabled ? 0.5 : 1,
            WebkitBoxShadow: "0 0 0 1000px rgba(0,0,0,0) inset",
            WebkitTextFillColor: "#ffffff",
            colorScheme:     "dark",
          } as React.CSSProperties}
        />

        {/* Label flottant */}
        {label && (
          <label
            htmlFor={fieldId}
            style={{
              position:    "absolute",
              left:        hasLeftIcon ? "2.25rem" : "0.625rem",
              top:         inputValue || isFocused || placeholder !== " " ? "0" : "50%",
              transform:   inputValue || isFocused || placeholder !== " "
                ? "translateY(-50%) scale(0.78)"
                : "translateY(-50%) scale(1)",
              transformOrigin: "left center",
              transition:  "all var(--dur-moderate,300ms) cubic-bezier(0.16,1,0.3,1)",
              fontSize:    "var(--fs-sm, 0.875rem)",
              fontWeight:  "500",
              color:       labelColor,
              zIndex:      10,
              pointerEvents: "none",
              display:     "flex",
              alignItems:  "center",
              gap:         "0.25rem",
              // Fond qui "coupe" la bordure pour le label flottant
              padding:     inputValue || isFocused || placeholder !== " " ? "0 0.25rem" : "0",
              background:  inputValue || isFocused || placeholder !== " "
                ? (labelBg ?? "rgba(10,10,20,0.80)")
                : "transparent",
              borderRadius: "2px",
            }}
          >
            {hasLabelIcon && <FieldIconComponent fieldIcon={fieldIcon} color={labelColor} />}
            <span>
              {label}
              {required && (
                <span style={{ color: "var(--error-400,#f87171)", marginLeft: "0.2rem" }}>*</span>
              )}
            </span>
          </label>
        )}

        {/* Icône de validation */}
        <ValidationIcon
          currentValidation={currentValidation}
          showIcons={validation.showIcons ?? true}
          animationType={animationType}
        />
      </div>

      {/* Message de validation */}
      <ValidationMessage
        currentValidation={currentValidation}
        showMessages={validation.showMessages ?? true}
        fieldId={fieldId}
      />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────
// FilledField — Champ rempli (style Google Material)
// ──────────────────────────────────────────────────────────────────────
export const FilledField: React.FC<BaseFieldProps> = ({
  label, placeholder = " ", type = "text", value = "", onChange,
  className = "", disabled = false, required = false, autoComplete, autoFocus,
  fieldIcon, validation = defaultValidation, onFocus, onBlur, onValidationChange, labelBg,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [isFocused,  setIsFocused]  = useState(false)
  const { currentValidation, isAnimating, animationType } = useFieldValidation(inputValue, validation, onValidationChange)

  useEffect(() => { if (value !== inputValue) setInputValue(value) }, [value]) // eslint-disable-line

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInputValue(e.target.value); onChange?.(e.target.value) }
  const handleFocus  = (e: React.FocusEvent<HTMLInputElement>)  => { setIsFocused(true);  onFocus?.(e) }
  const handleBlur   = (e: React.FocusEvent<HTMLInputElement>)  => { setIsFocused(false); onBlur?.(e)  }

  const stateColor  = currentValidation ? VALIDATION_COLORS[currentValidation.type as keyof typeof VALIDATION_COLORS] : null
  const borderColor = stateColor?.border ?? (isFocused ? "var(--primary-400,#818cf8)" : "rgba(255,255,255,0.20)")
  const labelColor  = stateColor?.text   ?? (isFocused ? "var(--primary-300,#a5b4fc)" : "rgba(255,255,255,0.50)")
  const hasLeftIcon  = fieldIcon?.position === "left"
  const hasLabelIcon = fieldIcon?.position === "label"
  const fieldId = `filled_${label?.toLowerCase().replace(/\s+/g, "_") ?? "field"}`

  return (
    <div className={className}>
      <style>{FIELD_KEYFRAMES}</style>
      <div style={{ position: "relative", animation: isAnimating && animationType === "error" ? "fieldShake 0.5s ease-out" : "none" }}>
        {hasLeftIcon && (
          <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", zIndex: 10 }}>
            <FieldIconComponent fieldIcon={fieldIcon} color={labelColor} />
          </div>
        )}
        <input
          id={fieldId} type={type} value={inputValue}
          onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
          disabled={disabled} required={required} autoComplete={autoComplete} autoFocus={autoFocus}
          placeholder={placeholder}
          style={{
            display: "block", width: "100%",
            paddingTop: "1.25rem", paddingBottom: "0.5rem",
            paddingLeft: hasLeftIcon ? "2.5rem" : "0.625rem",
            paddingRight: validation.showIcons && currentValidation ? "2.5rem" : "0.625rem",
            fontSize: "var(--fs-sm,0.875rem)", background: "rgba(255,255,255,0.06)",
            borderTopLeftRadius: "var(--radius-md,0.75rem)", borderTopRightRadius: "var(--radius-md,0.75rem)",
            borderBottom: `2px solid ${borderColor}`, border: "none", borderBottomStyle: "solid",
            borderBottomWidth: "2px", borderBottomColor: borderColor,
            outline: "none", color: "#ffffff", transition: "border-color var(--dur-normal,200ms) ease",
            opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "text",
            WebkitBoxShadow: "0 0 0 1000px rgba(0,0,0,0) inset", WebkitTextFillColor: "#ffffff", colorScheme: "dark",
          } as React.CSSProperties}
        />
        {label && (
          <label htmlFor={fieldId} style={{
            position: "absolute", left: hasLeftIcon ? "2.5rem" : "0.625rem",
            top: inputValue || isFocused ? "0.3rem" : "50%",
            transform: inputValue || isFocused ? "scale(0.78)" : "translateY(-50%) scale(1)",
            transformOrigin: "left top", transition: "all var(--dur-moderate,300ms) cubic-bezier(0.16,1,0.3,1)",
            fontSize: "var(--fs-sm,0.875rem)", fontWeight: "500", color: labelColor,
            zIndex: 10, pointerEvents: "none", display: "flex", alignItems: "center", gap: "0.25rem",
          }}>
            {hasLabelIcon && <FieldIconComponent fieldIcon={fieldIcon} color={labelColor} />}
            <span>{label}{required && <span style={{ color: "var(--error-400,#f87171)", marginLeft: "0.2rem" }}>*</span>}</span>
          </label>
        )}
        <ValidationIcon currentValidation={currentValidation} showIcons={validation.showIcons ?? true} animationType={animationType} />
      </div>
      <ValidationMessage currentValidation={currentValidation} showMessages={validation.showMessages ?? true} fieldId={fieldId} />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────
// StandardField — Champ standard souligné
// ──────────────────────────────────────────────────────────────────────
export const StandardField: React.FC<BaseFieldProps> = ({
  label, placeholder = " ", type = "text", value = "", onChange,
  className = "", disabled = false, required = false, autoComplete, autoFocus,
  fieldIcon, validation = defaultValidation, onFocus, onBlur, onValidationChange,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [isFocused,  setIsFocused]  = useState(false)
  const { currentValidation, isAnimating, animationType } = useFieldValidation(inputValue, validation, onValidationChange)

  useEffect(() => { if (value !== inputValue) setInputValue(value) }, [value]) // eslint-disable-line

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInputValue(e.target.value); onChange?.(e.target.value) }
  const handleFocus  = (e: React.FocusEvent<HTMLInputElement>)  => { setIsFocused(true);  onFocus?.(e) }
  const handleBlur   = (e: React.FocusEvent<HTMLInputElement>)  => { setIsFocused(false); onBlur?.(e)  }

  const stateColor  = currentValidation ? VALIDATION_COLORS[currentValidation.type as keyof typeof VALIDATION_COLORS] : null
  const borderColor = stateColor?.border ?? (isFocused ? "var(--primary-400,#818cf8)" : "rgba(255,255,255,0.25)")
  const labelColor  = stateColor?.text   ?? (isFocused ? "var(--primary-300,#a5b4fc)" : "rgba(255,255,255,0.50)")
  const hasLeftIcon  = fieldIcon?.position === "left"
  const hasLabelIcon = fieldIcon?.position === "label"
  const fieldId = `standard_${label?.toLowerCase().replace(/\s+/g, "_") ?? "field"}`

  return (
    <div className={className}>
      <style>{FIELD_KEYFRAMES}</style>
      <div style={{ position: "relative", animation: isAnimating && animationType === "error" ? "fieldShake 0.5s ease-out" : "none" }}>
        {hasLeftIcon && (
          <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}>
            <FieldIconComponent fieldIcon={fieldIcon} color={labelColor} />
          </div>
        )}
        <input
          id={fieldId} type={type} value={inputValue}
          onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
          disabled={disabled} required={required} autoComplete={autoComplete} autoFocus={autoFocus}
          placeholder={placeholder}
          style={{
            display: "block", width: "100%", paddingTop: "0.625rem", paddingBottom: "0.5rem",
            paddingLeft: hasLeftIcon ? "1.5rem" : "0",
            paddingRight: validation.showIcons && currentValidation ? "2rem" : "0",
            fontSize: "var(--fs-sm,0.875rem)", background: "transparent",
            borderBottom: `2px solid ${borderColor}`, border: "none", borderBottomStyle: "solid",
            borderBottomWidth: "2px", borderBottomColor: borderColor,
            outline: "none", color: "#ffffff", transition: "border-color var(--dur-normal,200ms) ease",
            opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "text",
            WebkitBoxShadow: "0 0 0 1000px rgba(0,0,0,0) inset", WebkitTextFillColor: "#ffffff", colorScheme: "dark",
          } as React.CSSProperties}
        />
        {label && (
          <label htmlFor={fieldId} style={{
            position: "absolute", left: hasLeftIcon ? "1.5rem" : "0",
            top: inputValue || isFocused ? "-1rem" : "50%",
            transform: inputValue || isFocused ? "scale(0.78)" : "translateY(-50%) scale(1)",
            transformOrigin: "left center", transition: "all var(--dur-moderate,300ms) cubic-bezier(0.16,1,0.3,1)",
            fontSize: "var(--fs-sm,0.875rem)", fontWeight: "500", color: labelColor,
            zIndex: -1, pointerEvents: "none", display: "flex", alignItems: "center", gap: "0.25rem",
          }}>
            {hasLabelIcon && <FieldIconComponent fieldIcon={fieldIcon} color={labelColor} />}
            <span>{label}{required && <span style={{ color: "var(--error-400,#f87171)", marginLeft: "0.2rem" }}>*</span>}</span>
          </label>
        )}
        <ValidationIcon currentValidation={currentValidation} showIcons={validation.showIcons ?? true} animationType={animationType} />
      </div>
      <ValidationMessage currentValidation={currentValidation} showMessages={validation.showMessages ?? true} fieldId={fieldId} />
    </div>
  )
}
