/**
 * IAuthRepository — Port
 *
 * @what     Contrato de autenticación. Define login y registro de usuarios.
 * @receives Credenciales del usuario por método.
 * @processes Define la interfaz — la implementación real va en features/auth/services/.
 * @returns  Promesa con entidad User autenticada.
 */
import type { User } from '@core/entities/User';

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  register(name: string, email: string, password: string): Promise<User>;
}
