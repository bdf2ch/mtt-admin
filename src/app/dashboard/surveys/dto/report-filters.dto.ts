export interface IReportFiltersDTO {
  date_from?: string;
  date_to?: string;
  restaurants_ids?: number[];
  questions_ids?: number[];
  page?: number;
}
