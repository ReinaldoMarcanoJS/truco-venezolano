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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState(""); // <-- Nuevo estado
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
    
      // Crear usuario en Supabase - el trigger automático creará el jugador
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected/lobby`,
          data: {
        name,
          },
        },
      });

      if (error) {
        setError(error.message);
        console.log("Error during sign up:", error);
        
      }
    
      if (data.user) {
        console.log('✅ Usuario creado exitosamente. El trigger automático creará el perfil de jugador.');
        
        // Redirigir al usuario
        router.push("/auth/login");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ha ocurrido un error");
      console.error("Error during sign up:", error);

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
            Crear cuenta
          </CardTitle>
          <CardDescription className="text-white/90 drop-shadow-md">
            Regístrate para jugar Truco Venezolano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-white drop-shadow-md">
                  Nombre
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/40 border border-yellow-400/40 text-white placeholder:text-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
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
                <Label htmlFor="password" className="text-white drop-shadow-md">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/40 border border-yellow-400/40 text-white placeholder:text-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="repeat-password"
                  className="text-white drop-shadow-md"
                >
                  Repite la contraseña
                </Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="bg-black/40 border border-yellow-400/40 text-white placeholder:text-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold shadow-lg hover:from-red-700 hover:to-yellow-600 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Registrarse"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-white drop-shadow-md">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="text-yellow-300 hover:text-yellow-400 underline underline-offset-4 drop-shadow-md"
              >
                Inicia sesión
              </Link>
            </div>
            <div className="mt-6 flex flex-col items-center">
              <Button
                type="button"
                className="w-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  setError(null);
                  const supabase = createClient();
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: "facebook",
                    options: {
                      redirectTo: `${window.location.origin}/protected/lobby`,
                    },
                  });
                  if (error) {
                    setError(error.message);
                    setIsLoading(false);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="mr-2"
                >
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0"/>
                </svg>
                Iniciar sesión con Facebook
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
