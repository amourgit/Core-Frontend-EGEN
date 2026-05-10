import React, { useState, useRef, useEffect } from 'react';

interface SearchPopupProps {
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchPopup: React.FC<SearchPopupProps> = ({
  open: openProp,
  isOpen,

  onClose,
  onSearch,
  placeholder = 'Rechercher...',
}) => {
  const open = openProp ?? isOpen ?? false;
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose?.();
    if (e.key === 'Enter') onSearch?.(query);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--background, #1a1a2e)',
          borderRadius: '12px', padding: '16px', width: '560px', maxWidth: '90vw',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            fontSize: '18px', color: 'inherit', padding: '8px 0',
          }}
        />
      </div>
    </div>
  );
};

export default SearchPopup;
