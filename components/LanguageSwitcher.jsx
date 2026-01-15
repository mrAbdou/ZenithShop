'use client';
import { setLanguage } from '@/app/actions/i18n';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';

export default function LanguageSwitcher() {
    const router = useRouter();
    const { locale: currentLocale } = useTranslation();

    const changeLang = async (lang) => {
        await setLanguage(lang);
        router.refresh(); // Important: Reloads server data with new locale
    };

    const languages = [
        { code: 'en', name: 'EN', fullName: 'English', flag: '🇺🇸' },
        { code: 'fr', name: 'FR', fullName: 'Français', flag: '🇫🇷' },
        { code: 'ar', name: 'العربية', fullName: 'العربية', flag: '🇸🇦' }
    ];

    return (
        <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
            <div className="flex gap-1">
                {languages.map((lang) => {
                    const isActive = currentLocale === lang.code;
                    return (
                        <button
                            key={lang.code}
                            onClick={() => changeLang(lang.code)}
                            className={`
                                relative px-2 py-1 text-xs font-medium rounded-md transition-all duration-200
                                flex items-center gap-1 min-w-[45px] justify-center
                                ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm transform scale-105'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }
                                focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                            title={lang.fullName}
                            aria-label={`Switch to ${lang.fullName}`}
                        >
                            <span className="text-sm leading-none">{lang.flag}</span>
                            <span className={`font-semibold text-xs ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                {lang.name}
                            </span>
                            {isActive && (
                                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-white rounded-full"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Language indicator - simplified for smaller size */}
            <div className="hidden lg:flex items-center gap-1 ml-1 pl-1 border-l border-gray-200">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-500 font-medium">
                    {languages.find(lang => lang.code === currentLocale)?.fullName}
                </span>
            </div>
        </div>
    );
}
