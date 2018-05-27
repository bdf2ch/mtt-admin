import { ITimeTable } from '../interfaces/time-table.interface';

/**
 * Класс, реализцющий интерфейс времени работы ресторана
 */
export class TimeTable implements  ITimeTable {
  id: number;           // Идентификатор
  opening: string;      // открытие
  closing: string;      // Закрытие

  /**
   * Конструктор
   * @param {ITimeTable} config - Параметры инициализации
   */
  constructor(config?: ITimeTable) {
    this.id = config ? config.id : 0;
    this.opening = config ? config.opening : '';
    this.closing = config ? config.closing : '';
  }
}
