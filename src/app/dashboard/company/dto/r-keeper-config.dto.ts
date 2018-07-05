/**
 * R-Keeper config DTO interface
 */
export interface IRKeeperConfigDTO {
  id?: number;                   // Идентификатор
  reward_code_from?: number;     // Начало диапазона генерируемых кодов
  reward_code_to?: number;       // Конец диапазона генерируемых кодов
  discount_types?: {             // Коды соответствия типо вознаграждений
    product: number;
    money: number;
    discount: number;
    loyalty: number;
  };
  discount?: {             // Коды соответствия типо вознаграждений
    product: number;
    money: number;
    discount: number;
    loyalty: number;
  };
}

