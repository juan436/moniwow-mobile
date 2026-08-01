/**
 * IFeedbackActions — Port
 *
 * @what     Contrato de escritura de feedback (buzón de desarrollo, cualquier usuario).
 * @receives —
 * @processes Sin lectura: nadie lee feedback desde la app.
 * @returns  —
 */
export interface IFeedbackActions {
  send(descripcion: string): Promise<void>;
}
