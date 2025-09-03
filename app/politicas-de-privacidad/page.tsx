"use client";

export default function PoliticaDePrivacidad() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidad</h1>
      <p className="mb-3">
        En <strong>MiAplicación</strong>, respetamos y protegemos la
        privacidad de nuestros usuarios. Esta política explica cómo usamos y
        almacenamos la información que obtenemos a través del inicio de sesión
        con Facebook.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Información Recopilada</h2>
      <p className="mb-3">
        Al iniciar sesión con Facebook, podemos recibir tu nombre, correo
        electrónico y foto de perfil. Estos datos se usan únicamente para
        identificarte dentro de la aplicación y mejorar tu experiencia.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Uso de la Información</h2>
      <p className="mb-3">
        La información obtenida se utiliza exclusivamente para autenticar tu
        cuenta y no se comparte con terceros bajo ninguna circunstancia.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Eliminación de Datos</h2>
      <p className="mb-3">
        Puedes solicitar la eliminación de tus datos en cualquier momento
        visitando nuestra{" "}
        <a
          href="/eliminar-datos"
          className="text-blue-600 underline"
        >
          página de eliminación de datos
        </a>{" "}
        o escribiendo a{" "}
        <a
          href="reinaldomarcano4@gmail.com"
          className="text-blue-600 underline"
        >
          reinaldomarcano4@gmail.com
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Contacto</h2>
      <p>
        Si tienes preguntas sobre esta política, puedes escribirnos a:{" "}
        <a
          href="reinaldomarcano4@gmail.com"
          className="text-blue-600 underline"
        >
          soporte@miapp.com
        </a>
        .
      </p>
    </div>
  );
}
