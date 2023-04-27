/**
 * Interfaz para definir un Funko
 */
export interface FunkoInterface {
  id: number,
  nombre: string,
  desc: string,
  tipo: string,
  genero: string,
  franquicia: string,
  numero: number,
  exclusivo: boolean,
  caracteristica_esp: string, 
  valor: number
}