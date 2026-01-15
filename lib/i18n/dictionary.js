import 'server-only';

const dictionaries = {
    en: () => import('./locales/en.json').then((module) => module.default),
    fr: () => import('./locales/fr.json').then((module) => module.default),
    ar: () => import('./locales/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
    // Default to 'en' if the locale is not found
    const loader = dictionaries[locale] || dictionaries['en'];
    return loader();
};