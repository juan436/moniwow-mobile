/**
 * authService — Service
 *
 * @what     Implementación mock de IAuthRepository. Simula llamadas al backend.
 * @receives Credenciales por método.
 * @processes Simula delay de red. Retorna User hardcodeado. Sin lógica de negocio.
 * @returns  Promise<User>
 */
import { User } from '@core/entities/User';
import type { IAuthRepository } from '@core/ports/IAuthRepository';

function simulateDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 600));
}

export const authService: IAuthRepository = {
  async login(email: string, _password: string): Promise<User> {
    await simulateDelay();
    return new User({
      id: 'mock-1',
      name: 'Usuario',
      email,
      role: 'representante',
      workspaceId: 'ws-mock',
    });
  },

  async register(name: string, email: string, _password: string): Promise<User> {
    await simulateDelay();
    return new User({
      id: 'mock-1',
      name,
      email,
      role: 'representante',
      workspaceId: 'ws-mock',
    });
  },
};
