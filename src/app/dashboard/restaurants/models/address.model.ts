import { IAddress } from '../interfaces/address.interface';
import { IAddressDTO } from '../dto/address.dto';

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
  addressLabel: string;

  /**
   * Конструктор
   * @param {IAddress} config - Параметры инициализации
   */
  constructor(config?: IAddressDTO) {
    this.id = config ? config.id : 0;
    this.city = config ? config.city : '';
    this.street = config ? config.street : '';
    this.building = config ? config.building_number : '';
    this.comment = config ? config.comment : '';
    this.latitude = config ? config.latitude : 0;
    this.longitude = config ? config.longitude : 0;
    this.addressLabel = `${this.city}, ${this.street}, д. ${this.building}`;
  }
}
