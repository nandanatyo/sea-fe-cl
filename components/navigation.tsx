"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Heart, LogOut, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";

const navigation = [
  { name: "🏠 Beranda", href: "/" },
  { name: "🍽️ Menu", href: "/menu" },
  { name: "📝 Langganan", href: "/subscription" },
  { name: "💬 Testimoni", href: "/testimonial" },
  { name: "📞 Kontak", href: "/contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-3 rounded-2xl shadow-lg">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                SEA Catering
              </span>
              <div className="text-xs text-gray-500 -mt-1">
                Makanan Sehat Indonesia
              </div>
            </div>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <span className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              SEA Catering
            </span>
            <div className="text-xs text-gray-500 -mt-1">
              Makanan Sehat Indonesia
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all hover:text-emerald-600 hover:scale-105 px-3 py-2 rounded-lg",
                pathname === item.href
                  ? "text-emerald-600 bg-emerald-50 shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50"
              )}>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">
                Halo, {user?.name || user?.fullName}!
              </span>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-emerald-600">
                <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                  <Settings className="h-4 w-4 mr-2" />
                  {isAdmin ? "Admin Panel" : "Dashboard"}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Regular User Login */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-emerald-600">
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  Masuk
                </Link>
              </Button>

              {/* Admin Login Button */}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Link href="/admin/login">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>

              {/* Register Button */}
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl">
                <Link href="/register">🚀 Daftar Sekarang</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-6 mt-8">
              <div className="text-center pb-4 border-b">
                <div className="text-xl font-bold text-emerald-600">
                  SEA Catering
                </div>
                <div className="text-sm text-gray-500">
                  Makanan Sehat Indonesia
                </div>
                {isAuthenticated && (
                  <div className="text-sm text-gray-600 mt-2">
                    Halo, {user?.name || user?.fullName}!
                  </div>
                )}
              </div>

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-emerald-600 py-3 px-4 rounded-lg",
                    pathname === item.href
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-600"
                  )}>
                  {item.name}
                </Link>
              ))}

              <div className="border-t pt-6 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-left">
                      <Link
                        href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                        onClick={() => setIsOpen(false)}>
                        <Settings className="h-4 w-4 mr-2" />
                        {isAdmin ? "Admin Panel" : "Dashboard Saya"}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-left">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Login User
                      </Link>
                    </Button>

                    {/* Mobile Admin Login */}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start text-left text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Link
                        href="/admin/login"
                        onClick={() => setIsOpen(false)}>
                        <Shield className="h-4 w-4 mr-2" />
                        Login Admin
                      </Link>
                    </Button>

                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        🚀 Daftar Sekarang
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
