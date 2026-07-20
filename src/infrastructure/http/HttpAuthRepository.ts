/**
 * HttpAuthRepository — Adapter (HTTP)
 *
 * @what     Implementa IAuthRepository contra la API real. Reemplaza al mock `authService`.
 * @receives Credenciales por método.
 * @processes Llama a `/auth/login` o `/auth/register`, **guarda el token** y devuelve el usuario.
 *           Guardar el token es parte de autenticarse: sin eso el login "funciona" y la siguiente
 *           petición da 401.
 * @returns  Promise<User>
 *
 * El `User` de mobile no tiene `passwordHash` — la API tampoco lo manda. Los campos coinciden.
 */
import { User } from '@core/entities/User';
import type { UserRole } from '@core/entities/User';
import type { IAuthRepository } from '@core/ports/IAuthRepository';

import { request } from './httpClient';
import { tokenStore } from './tokenStore';

/** Forma exacta del JSON que devuelve la API. Se traduce a entidad, no se usa tal cual. */
interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; role: string; workspaceId: string };
}

function toUser(dto: AuthResponse['user']): User {
  return new User({
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: dto.role as UserRole,
    workspaceId: dto.workspaceId,
  });
}

export class HttpAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const res = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      anonymous: true,
    });
    await tokenStore.save(res.token);
    return toUser(res.user);
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const res = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
      anonymous: true,
    });
    await tokenStore.save(res.token);
    return toUser(res.user);
  }

  /**
   * Quién soy según el token guardado. Se usa al arrancar: si el token caducó o el servidor no
   * responde, `request` lanza y la app manda a login.
   */
  async me(): Promise<User> {
    const dto = await request<AuthResponse['user']>('/auth/me');
    return toUser(dto);
  }

  async logout(): Promise<void> {
    await tokenStore.clear();
  }
}
