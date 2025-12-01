"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Role } from "@prisma/client";
export default function NavigationBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [session, setSession] = useState(null);
    const currentPath = usePathname();
    useEffect(() => {
        const getSession = async () => {
            try {
                const session = await authClient.getSession();
                setSession(session);
            } catch (error) {
                console.error("Failed to fetch session", error);
            }
        }
        getSession();
    }, []);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    // TODO: i think i need to create another navLinks array for the admin panel
    let navLinks = [];

    if (session?.user?.role === Role.CUSTOMER) {
        navLinks = [
            {
                href: "/",
                label: "Home",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                )
            },
            {
                href: "/products",
                label: "Products",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                )
            },
            {
                href: "/about",
                label: "About",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            },
            {
                href: "/contact",
                label: "Contact",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                )
            },
            {
                href: "/cart",
                label: "Cart",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                )
            },
            {
                href: "/checkout",
                label: "Checkout",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                )
            }
        ]
    } else {
        navLinks = [
            {
                href: "/control-panel/dashboard",
                label: "Dashboard",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                )
            },
            {
                href: "/control-panel/products",
                label: "Products",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                )
            },
            {
                href: "/control-panel/orders",
                label: "Orders",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                )
            },
            {
                href: "/control-panel/users",
                label: "Users",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                )
            },
            // this logout link needs to be taking care of differently (better Auth way!)
            {
                href: "/control-panel/logout",
                label: "Logout",
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                )
            }
        ]
    };
    return (
        <>
            {/* زر فتح القائمة - يظهر فقط في الشاشات الصغيرة */}
            <button
                onClick={toggleMenu}
                className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-110 transition-all duration-200"
                aria-label="فتح القائمة"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* الخلفية الداكنة (Backdrop) - تظهر فقط عند فتح القائمة في الشاشات الصغيرة */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-all duration-300"
                    onClick={closeMenu}
                />
            )}

            {/* القائمة الجانبية */}
            <nav
                className={`
                    bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
                    shadow-2xl p-6 flex flex-col
                    lg:relative lg:w-72 lg:h-full lg:translate-x-0
                    fixed top-0 left-0 h-full w-80 z-50 
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* زر الإغلاق - يظهر فقط في الشاشات الصغيرة */}
                <button
                    onClick={closeMenu}
                    className="lg:hidden absolute top-4 right-4 text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-all duration-200"
                    aria-label="إغلاق القائمة"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Header مع Logo */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
                        <Image
                            src='/next.svg'
                            alt='Logo'
                            className="w-full"
                            width={100}
                            height={100}
                        />
                    </div>
                    <h1 className="text-center text-white font-bold text-lg bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        E-Commerce
                    </h1>
                    <p className="text-center text-gray-400 text-xs mt-1">Premium Shopping</p>
                </div>

                {/* الروابط */}
                <ul className="flex flex-col gap-2 flex-1">
                    {navLinks.map((link) => {
                        const isActive = currentPath === link.href;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={closeMenu}
                                    className={`
                                        group flex items-center gap-3 px-4 py-3 rounded-xl
                                        font-medium transition-all duration-200
                                        ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                                            : 'text-gray-300 hover:bg-slate-700 hover:text-white hover:translate-x-1'
                                        }
                                    `}
                                >
                                    <span className={`
                                        transition-transform duration-200
                                        ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                                    `}>
                                        {link.icon}
                                    </span>
                                    <span>{link.label}</span>
                                    {isActive && (
                                        <span className="ml-auto">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Footer */}
                <Link href="/control-panel">
                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                A
                            </div>
                            <div className="flex-1">
                                <p className="text-white text-sm font-semibold">Admin</p>
                                <p className="text-gray-400 text-xs">Online</p>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </Link>
            </nav>
        </>
    );
}
