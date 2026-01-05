'use client';

import UsersFilters from "@/components/admin/UsersFilters";
import UsersTable from "@/components/admin/UsersTable";
import UserProvider from "@/context/usersContext";

export default function UsersManagement({ users = [] }) {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            <UserProvider>
                <UsersFilters />
                <UsersTable initialData={users} />
            </UserProvider>
        </div>
    );
}