//start next import -----------------------------------------------
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
//end next import -------------------------------------------------

//start services import -------------------------------------------
import { fetchUser } from "@/services/users.server";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";
//end services import ---------------------------------------------

export async function generateMetadata({ params }) {
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    // Get headers for authentication
    const h = await headers();
    const cookieHeader = h.get('cookie');

    const { userId } = await params;
    const user = await fetchUser({ id: userId }, cookieHeader);

    if (!user) {
        return {
            title: dict.admin.users.userNotFound || "User Not Found",
            description: dict.admin.users.userNotFoundDesc || "The requested user could not be found.",
        };
    }

    return {
        title: `${user.name} ${dict.admin.users.userDetails} | ${dict.admin.common.adminPanel}`,
        description: `${dict.admin.users.detailedInfo || "Detailed information about user"} ${user.name} - ${user.email}`,
    };
}

export default async function UserDetailsPage({ params }) {
    const locale = await getLocale();
    const dict = await getDictionary(locale);

    const { userId } = await params;

    // Validate userId parameter
    if (!userId || typeof userId !== 'string') {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {dict.admin.users.invalidUserId || "Invalid user ID parameter. Please provide a valid user ID."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    let cookieHeader = '';
    try {
        const h = await headers();
        const session = await auth.api.getSession({
            headers: h
        });
        cookieHeader = h.get('cookie');

        if (!session || !(session?.user?.role === Role.ADMIN)) {
            redirect("/");
        }
    } catch (error) {
        console.error('Auth error : ', error);
        redirect("/");
    }
    // Fetch user data
    const user = await fetchUser({ id: userId }, cookieHeader);

    // If user not found, show 404
    if (!user) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-8">
                <Link href="/control-panel" className="hover:text-blue-600">{dict.admin.common.controlPanel}</Link>
                <span className="mx-2">→</span>
                <Link href="/control-panel/users" className="hover:text-blue-600">{dict.admin.users.management}</Link>
                <span className="mx-2">→</span>
                <span className="text-gray-800">{user.name}</span>
            </nav>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8">
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${user.role === 'ADMIN'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-blue-100 text-blue-800'}`}>
                                    {user.role === 'ADMIN' ? dict.admin.users.admin : dict.admin.users.customer}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                                <p className="text-gray-600 text-lg">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* User Details Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Basic Information */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 text-lg border-b border-gray-200 pb-2">{dict.admin.users.basicInfo || "Basic Information"}</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{dict.admin.users.userId}</p>
                                    <p className="text-gray-800 font-medium">{user.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{dict.admin.users.fullName || "Full Name"}</p>
                                    <p className="text-gray-800 font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{dict.admin.users.emailAddress || "Email Address"}</p>
                                    <p className="text-gray-800 font-medium break-all">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{dict.admin.users.accountRole || "Account Role"}</p>
                                    <p className={`text-gray-800 font-medium ${user.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'}`}>
                                        {user.role === 'ADMIN' ? dict.admin.users.admin : dict.admin.users.customer}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 text-lg border-b border-gray-200 pb-2">{dict.admin.users.contactInfo || "Contact Information"}</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{dict.admin.users.phoneNumber || "Phone Number"}</p>
                                    <p className="text-gray-800 font-medium">{user.phoneNumber || dict.admin.users.notProvided || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{dict.admin.users.addressLabel || "Address"}</p>
                                    <p className="text-gray-800 font-medium whitespace-pre-line">{user.address || dict.admin.users.notProvided || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Users Button */}
                    <div className="mt-8">
                        <Link
                            href="/control-panel/users"
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 font-semibold"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            {dict.admin.users.backToUsers || "Back to Users"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}