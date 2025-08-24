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
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ha ocurrido un error");
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
      {success ? (
        <Card className="bg-black/50 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
              Revisa tu correo 📩
            </CardTitle>
            <CardDescription className="text-white/90 drop-shadow-md">
              Te enviamos instrucciones para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/80 drop-shadow-md leading-relaxed">
              Si te registraste usando correo y contraseña, recibirás un email
              con el enlace para restablecer tu contraseña.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-black/50 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
              Restablece tu contraseña
            </CardTitle>
            <CardDescription className="text-white/90 drop-shadow-md">
              Escribe tu correo y te enviaremos un enlace para cambiarla
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
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
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold shadow-lg hover:from-red-700 hover:to-yellow-600 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar enlace"}
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
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
