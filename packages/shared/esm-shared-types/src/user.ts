/** Profil utilisateur complet */
export interface IUser {
  id: string;
  username: string;
  email?: string;
  nom?: string;
  prenom?: string;
  displayName?: string;
  avatar?: string;
  realm: string;
  locale?: string;
  preferences?: IUserPreferences;
}

/** Préférences utilisateur */
export interface IUserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  notificationsEnabled?: boolean;
}
