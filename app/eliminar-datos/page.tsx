"use client";

export default function EliminarDatos() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Eliminación de Datos de Usuario</h1>

      <p className="mb-3">
        En <strong>MiAplicación</strong>, respetamos tu derecho a la privacidad.
        Si deseas eliminar tu cuenta y todos los datos asociados recopilados
        mediante el inicio de sesión con Facebook, puedes hacerlo de la
        siguiente manera:
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Solicitud de eliminación</h2>
      <p className="mb-3">
        Envía un correo electrónico a{" "}
        <a
          href="reinaldomarcano4@gmail.com"
          className="text-blue-600 underline"
        >
          reinaldomarcano4@gmail.com
        </a>{" "}
        con el asunto <strong>Eliminar datos</strong> y el correo con el que
        iniciaste sesión.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Tiempo de respuesta</h2>
      <p className="mb-3">
        Procesaremos tu solicitud y eliminaremos tus datos en un plazo máximo de{" "}
        <strong>7 días hábiles</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Confirmación</h2>
      <p>
        Una vez completada la eliminación, recibirás un correo de confirmación.
      </p>
    </div>
  );
}
