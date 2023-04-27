/**
 * Tipo personalizado para enviar las respuestas al cliente
 */
export type Respuesta = {
  resultado: boolean,
  respuesta: string,
  respuestas?: string[]
}