"use client";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Video,
  Type,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

type MenuItem = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ElementType;
  children?: {
    id: string;
    label: string;
    href: string;
    icon?: React.ElementType;
  }[];
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;


  const { data: session, status } = useSession();

  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // toggle largeur

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (!session || !session.user.superUser) {
    redirect("/login");
  }

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      id: "temoignages",
      label: "Témoignages",
      icon: Users,
      children: [
        { id: "video", label: "Vidéos", href: "/admin/temoignages/videos", icon: Video },
        { id: "texte", label: "Textes", href: "/admin/temoignages/texte", icon: Type },
      ],
    },
    {
      id: "articles-pages",
      label: "Articles & Pages",
      icon: FileText,
      children: [
        { id: "articles", label: "Articles", href: "/admin/rituels" },
        { id: "tags", label: "Tags", href: "/admin/tag" },
        { id: "categories", label: "Catégories", href: "/admin/categories" },
      ],
    },
    {
      id: "messages",
      label: "Messages reçus",
      icon: Mail,
      href: "/admin/messages",
    },
    {
      id: "parametres",
      label: "Paramètres",
      icon: Settings,
      href: "/admin/parametres",
    },
  ];

  return (
    <div className="flex h-screen bg-blue-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transform transition-all duration-300 lg:translate-x-0 
          ${sidebarExpanded ? "w-72" : "w-20"} 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-indigo-900 text-white`}
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-900 flex justify-between items-center">
          {sidebarExpanded ? (
            <h1 className="text-lg font-bold text-yellow-400">
              ⚡ Admin {siteName}
            </h1>
          ) : (
            <h1 className="text-yellow-400 font-bold text-xl">⚡</h1>
          )}
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.id ? null : item.id)
                    }
                    className={`w-full flex items-center ${sidebarExpanded ? "justify-between" : "justify-center"
                      } gap-3 px-4 py-3 rounded-xl transition ${openDropdown === item.id
                        ? "bg-orange-600 text-white"
                        : "text-gray-300 hover:bg-orange-500 hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      {Icon && <Icon className="w-5 h-5" />}
                      {sidebarExpanded && item.label}
                    </span>
                    {sidebarExpanded && (
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${openDropdown === item.id ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </button>

                  {/* Sous-menu (visible seulement si expanded) */}
                  {openDropdown === item.id && sidebarExpanded && (
                    <div className="ml-10 mt-2 space-y-2">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.id}
                            href={child.href}
                            onClick={() => {
                              setActive(child.id);
                              setSidebarOpen(false);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${active === child.id
                                ? "bg-orange-600 text-white"
                                : "text-gray-300 hover:bg-orange-500"
                              }`}
                          >
                            {ChildIcon && <ChildIcon className="w-4 h-4" />}
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href!}
                onClick={() => {
                  setActive(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center ${sidebarExpanded ? "gap-3 px-4" : "justify-center"
                  } py-3 rounded-xl transition ${active === item.id
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-orange-500 hover:text-white"
                  }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {sidebarExpanded && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer : bouton toggle + déconnexion */}
        <div className="p-4 border-t border-purple-900 flex flex-col gap-3">
          {/* Toggle Sidebar */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-full flex items-center justify-center gap-2 bg-purple-900 hover:bg-purple-800 py-2 rounded-lg transition"
          >
            {sidebarExpanded ? (
              <>
                <ChevronsLeft className="w-5 h-5" /> Réduire
              </>
            ) : (
              <ChevronsRight className="w-5 h-5" />
            )}
          </button>

          {/* Déconnexion */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 py-3 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" /> {sidebarExpanded && "Déconnexion"}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarExpanded ? "lg:pl-72" : "lg:pl-20"
          }`}
      >
        {/* Top bar */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <button
            className="lg:hidden text-indigo-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-7 h-7" />
          </button>
          <h2 className="text-xl font-bold text-indigo-900">
            Tableau de bord
          </h2>
        </header>

        {/* Contenu dynamique */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
