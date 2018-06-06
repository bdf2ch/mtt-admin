import { ITimeTable } from '../interfaces/time-table.interface';
import { ITimeTableDTO } from '../dto/time-table.dto';

/**
 * Класс, реализцющий интерфейс времени работы ресторана
 */
export class TimeTable implements ITimeTable {
  id: number;                 // Идентификатор
  opening: string;            // открытие
  closing: string;            // Закрытие
  untilLastClient: boolean;   // Работа до последнего клиента

  /**
   * Конструктор
   * @param {ITimeTable} config - Параметры инициализации
   */
  constructor(config?: ITimeTableDTO) {
    this.id = config ? config.id : 0;
    this.opening = config ? config.from : '';
    this.closing = config ? config.to : '';
    this.untilLastClient = config ? config.until_last_client : false;
  }
}
