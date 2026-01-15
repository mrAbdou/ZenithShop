import { cookies } from 'next/headers';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const locales = { en, fr, ar };

export async function getLocale() {
    const cookieStore = await cookies();
    return cookieStore.get('NEXT_LOCALE')?.value || 'en';
}

export async function getTranslations(namespace = 'common') {
    const locale = await getLocale();
    const localeData = locales[locale] || locales.en;
    return localeData[namespace] || {};
}