# Hybrid i18n Implementation Plan: Dictionary + Context Provider

This guide outlines a hybrid approach to internationalization (i18n) for Next.js App Router.
- **Server Components:** Use the **Dictionary Pattern** for performance (direct text rendering).
- **Client Components:** Use a **React Context Provider** + `useTranslation` hook to avoid prop drilling.

## Phase 1: Server-Side Infrastructure (The Dictionary)

### 1. Create the Dictionary Loader
Helper to load JSON files on the server.

**File:** `lib/i18n/dictionary.js`
```javascript
import 'server-only';

const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default),
  fr: () => import('./locales/fr.json').then((module) => module.default),
  ar: () => import('./locales/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  const loader = dictionaries[locale] || dictionaries['en'];
  return loader();
};
```

### 2. Cookie-based Locale Detection
Helper to get the current language from cookies.

**File:** `lib/i18n/server.js`
```javascript
import { cookies } from 'next/headers';

export async function getLocale() {
  const cookieStore = await cookies();
  return cookieStore.get('NEXT_LOCALE')?.value || 'en';
}
```

## Phase 2: Client-Side Infrastructure (The Provider)

### 3. Create the Translation Context and Hook
This creates a Client Component that provides translations to all children, and a hook to access them securely.

**File:** `lib/i18n/context.js`
```javascript
'use client';

import React, { createContext, useContext } from 'react';

const I18nContext = createContext(null);

export function I18nProvider({ children, dictionary, locale }) {
  return (
    <I18nContext.Provider value={{ dictionary, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  
  const { dictionary } = context;

  // Helper function to resolve nested keys like "home.title"
  const t = (key) => {
    const keys = key.split('.');
    let result = dictionary;
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    return result;
  };

  return { t, locale: context.locale };
}
```

## Phase 3: Integration (Global Setup)

### 4. Integrate in Root Layout
Fetch the dictionary *once* on the server and pass it to the client provider. This makes translations available everywhere.

**File:** `app/layout.js`
```javascript
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
         <I18nProvider dictionary={dictionary} locale={locale}>
            {children}
         </I18nProvider>
      </body>
    </html>
  );
}
```

## Phase 4: Usage Guide

### Usage in Server Components (Performance)
Directly await the dictionary. No overhead.

```javascript
/* page.js (Server Component) */
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function Page() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return <h1>{t.dashboard.title}</h1>;
}
```

### Usage in Client Components (Developer Experience)
Use the hook. No prop drilling!

```javascript
/* Component.jsx (Client Component) */
'use client';
import { useTranslation } from "@/lib/i18n/context";

export default function MyComponent() {
  const { t } = useTranslation();

  return <button>{t('common.submit')}</button>;
}
```

## Phase 5: Language Switcher

### 5. Server Action to Switch Language
**File:** `app/actions/i18n.js`
```javascript
'use server';
import { cookies } from 'next/headers';

export async function setLanguage(locale) {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', locale, { maxAge: 31536000 });
}
```

### 6. Switcher Component
**File:** `components/LanguageSwitcher.jsx`
```javascript
'use client';
import { setLanguage } from '@/app/actions/i18n';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();

  const changeLang = async (lang) => {
    await setLanguage(lang);
    router.refresh(); // Important: Reloads server data with new locale
  };

  return (
    <>
      <button onClick={() => changeLang('en')}>EN</button>
      <button onClick={() => changeLang('fr')}>FR</button>
    </>
  );
}
```
