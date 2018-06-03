/**
 * TimeTable DTO interface
 */
export interface ITimeTableDTO {
  id: number;
  restaurant_id: number;
  from: string;
  to?: string;
  until_last_client: boolean;
}
