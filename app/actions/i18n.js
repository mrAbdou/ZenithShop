'use server';
import { cookies } from 'next/headers';

export async function setLanguage(locale) {
    const cookieStore = await cookies();
    cookieStore.set('NEXT_LOCALE', locale, { maxAge: 31536000 });
}
