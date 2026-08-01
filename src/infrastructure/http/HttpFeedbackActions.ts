/**
 * HttpFeedbackActions — Adapter (HTTP)
 *
 * @what     Implementa IFeedbackActions contra `POST /feedback`.
 * @receives descripcion
 * @processes El userId viaja en el token, no en el cuerpo.
 * @returns  —
 */
import type { IFeedbackActions } from '@core/ports/IFeedbackActions';

import { request } from './httpClient';

export class HttpFeedbackActions implements IFeedbackActions {
  async send(descripcion: string): Promise<void> {
    await request<{ id: string; createdAt: string }>('/feedback', {
      method: 'POST',
      body: { descripcion },
    });
  }
}
