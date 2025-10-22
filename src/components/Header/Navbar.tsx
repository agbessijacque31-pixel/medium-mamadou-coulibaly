// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";  // Next 15, App Router
import { menuLinks } from "../MenuLinks/menuLinks";

export default function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Fermer le menu quand on change de page
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const handleToggle = () => {
        setIsMobileOpen((prev) => !prev);
    };
    const handleClose = () => {
        setIsMobileOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-4 py-6 bg-black/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" onClick={handleClose} className="flex items-center space-x-2">
                    <span className=" text-yellow-400 text-2xl">🌙</span> <span className="text-2xl font-bold bg-gradient-text whitespace-nowrap"> Mamadou Coulibaly </span>
                </Link>

                {/* Menu Desktop (visible depuis lg) */}
                <div className="hidden lg:flex space-x-8">
                    {menuLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-yellow-400 transition-colors duration-300 font-medium"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Bouton Hamburger (visible < lg) */}
                <button
                    aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={isMobileOpen}
                    aria-controls="mobile-menu"
                    className="lg:hidden z-50 p-2 rounded-md border border-slate-200 bg-white/10"
                    onClick={handleToggle}
                >
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Menu mobile + tablette */}
            <div
                id="mobile-menu"
                className={`lg:hidden absolute top-20 left-0 right-0 bg-purple-800 bg-opacity-95 backdrop-blur-sm rounded-lg mx-4 py-4 z-40 transition-all duration-200 transform ${isMobileOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                    }`}
            >
                {menuLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 hover:text-yellow-400 transition-colors duration-300"
                        onClick={handleClose}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
