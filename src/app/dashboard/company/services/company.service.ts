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

  constructor(private readonly resource: CompanyResource) {
    this.company =  null;
  }

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
   * Возвращает компанию
   * @returns {Company | null}
   */
  getCompany(): Company | null {
    return this.company;
  };
}
