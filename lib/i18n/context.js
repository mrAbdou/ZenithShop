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