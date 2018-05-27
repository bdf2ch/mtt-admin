import { IAddress } from '../interfaces/address.interface';

/**
 * Класс, реализующий интерфейс адрема ресторана
 */
export class Address implements IAddress {
  id: number;             // Идентификатор
  city: string;           // Город
  street: string;         // Улица
  building: string;       // Дом
  comment: string;        // Примечание
  latitude: number;       // Широта
  longitude: number;      // Долгота

  /**
   * Конструктор
   * @param {IAddress} config - Параметры инициализации
   */
  constructor(config?: IAddress) {
    this.id = config ? config.id : 0;
    this.city = config ? config.city : '';
    this.street = config ? config.street : '';
    this.building = config ? config.building : '';
    this.comment = config ? config.comment : '';
    this.latitude = config ? config.latitude : 0;
    this.longitude = config ? config.longitude : 0;
  }
}
