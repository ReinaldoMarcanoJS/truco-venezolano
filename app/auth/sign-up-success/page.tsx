import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[url(@/public/naipes.png)] bg-cover bg-center">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="bg-black/50 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
                ¡Gracias por registrarte! 🎉
              </CardTitle>
              <CardDescription className="text-white/90 drop-shadow-md">
                Revisa tu correo para confirmar tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/80 drop-shadow-md leading-relaxed">
                Te has registrado exitosamente. Por favor revisa tu bandeja de
                entrada y confirma tu cuenta antes de iniciar sesión.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
