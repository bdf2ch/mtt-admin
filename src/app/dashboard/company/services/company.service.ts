import { Injectable } from '@angular/core';
import { CompanyResource } from '../resources/company.resource';
import { Company } from '../models/company.model';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { ICompanyDTO } from '../dto/company.dto';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private company: Company | null;
  private isCompanyEditingInProgress: boolean;

  constructor(private readonly resource: CompanyResource) {
    this.company =  null;
    this.isCompanyEditingInProgress = false;
  }

  /**
   * Получение компании по идентификатору
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<Company | null>}
   */
  async fetchCompanyById(companyId: number): Promise<Company | null> {
    try {
      const result: IServerResponse<ICompanyDTO> = await this.resource.getCompanyById(null, {withPaymentRequisites: true}, {id: companyId}, null);
      console.log(result);
      if (result.data) {
        this.company = new Company(result.data);
        console.log(this.company);
        return this.company;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Изменение компании
   * @param {ICompanyDTO} company - данные компании
   * @returns {Promise<Company | null>}
   */
  async editCompanyById(company: ICompanyDTO): Promise<Company | null> {
    this.isCompanyEditingInProgress = true;
    try {
      const result: IServerResponse<ICompanyDTO> = await this.resource.editCompanyById(company, null, {id: company.id});
      this.isCompanyEditingInProgress = false;
      if (result.data) {
        this.company = new Company(result.data);
        return this.company;
      }
    } catch (error) {
      console.error(error);
      this.isCompanyEditingInProgress = false;
      return null;
    }
  }

  /**
   * Возвращает компанию
   * @returns {Company | null}
   */
  getCompany(): Company | null {
    return this.company;
  }

  /**
   * Выполняется ли изменение данных о компании
   * @returns {boolean}
   */
  editingCompanyInProgress(): boolean {
    return this.isCompanyEditingInProgress;
  }
}
