/**
 * Интерфейс, описывающий адрес ресторана
 */
export interface IAddress {
  id: number;             // Идентификатор
  city: string;           // Город
  street: string;         // Улица
  building: string;       // Дом
  comment: string;        // Примечание
  longitude: number;      // Долгота
  latitude: number;       // Широта
  addressLabel: string;   // Адрес одной строкой
}
