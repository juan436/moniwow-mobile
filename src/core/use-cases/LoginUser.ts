/**
 * LoginUser — UseCase
 *
 * @what     Valida credenciales de login antes de enviarlas al servicio.
 * @receives { email, password }
 * @processes Verifica que email tenga formato válido y password cumpla longitud mínima.
 * @returns  void — lanza Error con mensaje descriptivo si la validación falla.
 */
export class LoginUser {
  execute(params: { email: string; password: string }): void {
    if (!params.email.trim()) {
      throw new Error('El email es obligatorio');
    }
    if (!params.email.includes('@') || !params.email.includes('.')) {
      throw new Error('Email inválido');
    }
    if (params.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
  }
}
