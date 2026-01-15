'use client';

import UsersFilters from "@/components/admin/UsersFilters";
import UsersTable from "@/components/admin/UsersTable";
import UserProvider from "@/context/usersContext";
import { I18nProvider } from "@/lib/i18n/context";

export default function UsersManagement({ users = [], dictionary, locale }) {
    return (
        <I18nProvider dictionary={dictionary} locale={locale}>
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
                <UserProvider>
                    <UsersFilters />
                    <UsersTable initialData={users} />
                </UserProvider>
            </div>
        </I18nProvider>
    );
}