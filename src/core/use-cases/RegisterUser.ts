/**
 * RegisterUser — UseCase
 *
 * @what     Valida los campos del formulario de registro.
 * @receives { name, email, password, confirmPassword }
 * @processes Verifica nombre no vacío, email con formato válido, contraseña mínima
 *            y coincidencia de confirmación. Sin acceso a red ni estado.
 * @returns  void — lanza Error con mensaje descriptivo si la validación falla.
 */
export class RegisterUser {
  execute(params: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): void {
    if (!params.name.trim()) {
      throw new Error('El nombre es obligatorio');
    }
    if (!params.email.trim() || !params.email.includes('@') || !params.email.includes('.')) {
      throw new Error('Email inválido');
    }
    if (params.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (params.password !== params.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }
  }
}
