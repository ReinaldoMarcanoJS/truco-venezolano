"use client";

export default function TerminosYCondiciones() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Términos y Condiciones de Servicio</h1>

      <p className="mb-3">
        Bienvenido a <strong>MiAplicación</strong>. Al acceder o utilizar
        nuestra aplicación aceptas cumplir con los siguientes términos y
        condiciones. Te recomendamos leerlos con atención.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Uso del servicio</h2>
      <p className="mb-3">
        Nuestra aplicación se proporciona con el objetivo de ofrecer una
        experiencia de autenticación segura mediante Facebook Login. El usuario
        se compromete a utilizar el servicio de forma legal y adecuada.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Cuentas de usuario</h2>
      <p className="mb-3">
        Al registrarte mediante Facebook, aceptas que eres responsable de
        mantener la confidencialidad de tu cuenta. No compartimos tus datos con
        terceros sin tu consentimiento.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Limitación de responsabilidad</h2>
      <p className="mb-3">
        No nos hacemos responsables por fallas en el servicio, interrupciones,
        pérdidas de datos o accesos no autorizados que puedan ocurrir fuera de
        nuestro control razonable.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Modificaciones</h2>
      <p className="mb-3">
        Nos reservamos el derecho de modificar estos términos en cualquier
        momento. Los cambios serán efectivos a partir de su publicación en esta
        página.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Contacto</h2>
      <p>
        Si tienes preguntas sobre estos términos, escríbenos a:{" "}
        <a
          href="reinaldomarcano4@gmail.com"
          className="text-blue-600 underline"
        >
          reinaldomarcano4@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
