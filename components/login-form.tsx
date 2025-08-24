"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center min-h-screen",
        className
      )}
      {...props}
    >
      <Card className="bg-black/50 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
            Truco Venezolano
          </CardTitle>
          <CardDescription className="text-white/90 drop-shadow-md">
            Ingresa tu correo para iniciar sesión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white drop-shadow-md">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@ejemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/40 border border-yellow-400/40 text-white placeholder:text-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="text-white drop-shadow-md"
                  >
                    Contraseña
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm text-yellow-300 hover:text-yellow-400 underline-offset-4 hover:underline drop-shadow-md"
                  >
                    ¿Olvidaste la contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/40 border border-yellow-400/40 text-white placeholder:text-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold shadow-lg hover:from-red-700 hover:to-yellow-600 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-white drop-shadow-md">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/auth/sign-up"
                className="text-yellow-300 hover:text-yellow-400 underline underline-offset-4 drop-shadow-md"
              >
                Regístrate
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
