import { Injectable } from '@angular/core';
import { CompanyResource } from '../resources/company.resource';
import { Company } from '../models/company.model';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { ICompanyDTO } from '../dto/company.dto';
import { PaymentRequisites } from '../models/payment-requisites.model';
import { IPaymentRequisitesDTO } from '../dto/payment-requisites.dto';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private company: Company | null;
  private isCompanyEditingInProgress: boolean;
  private isAddingPaymentRequisitesInProgress: boolean;
  private isEditingPaymentRequisitesInProgress: boolean;
  private isDeletingPaymentRequisitesInProgress: boolean;

  constructor(private readonly resource: CompanyResource) {
    this.company =  null;
    this.isCompanyEditingInProgress = false;
    this.isAddingPaymentRequisitesInProgress = false;
    this.isEditingPaymentRequisitesInProgress = false;
    this.isDeletingPaymentRequisitesInProgress = false;
  }

  /**
   * Получение компании по идентификатору
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<Company | null>}
   */
  async fetchCompanyById(companyId: number): Promise<Company | null> {
    try {
      const result = await this.resource.getCompanyById(null, {with_payment_requisites: true}, {id: companyId}, null);
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
      const result = await this.resource.editCompanyById(company, null, {id: company.id});
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
   * Добавление платежных реквизитов
   * @param {IPaymentRequisitesDTO} requisites - Информация о платежных реквизитах
   * @param {number} companyId - Идентфиикатор компании
   * @returns {Promise<PaymentRequisites | null>}
   */
  async addPaymentRequisites(requisites: IPaymentRequisitesDTO, companyId: number): Promise<PaymentRequisites | null> {
    this.isAddingPaymentRequisitesInProgress = true;
    try {
      const result: IServerResponse<IPaymentRequisitesDTO> = await this.resource.addPaymentRequisites(requisites, null, {id: companyId});
      console.log(result);
      if (result.data) {
        const paymentRequisites = new PaymentRequisites(result.data);
        this.company.paymentRequisites.push(paymentRequisites);
        return paymentRequisites;
      }
    } catch (error) {
      console.error(error);
      this.isAddingPaymentRequisitesInProgress = false;
      return null;
    }
  }

  /**
   * Изменение платежных реквизитов
   * @param {IPaymentRequisitesDTO} requisites - Информация о платежных реквизитах
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<boolean>}
   */
  async editPaymentRequisites(requisites: IPaymentRequisitesDTO, companyId: number): Promise<boolean> {
    this.isEditingPaymentRequisitesInProgress = true;
    try {
      const result = await this.resource.editPaymentRequisites(requisites, null, {id: companyId, requisitesId: requisites.id});
      if (result.data) {
        return true;
      }
    } catch (error) {
      console.error(error);
      this.isEditingPaymentRequisitesInProgress = false;
      return false;
    }
  }

  async deletePaymentRequisites(companyId: number, requisitesId: number): Promise<boolean> {
    this.isDeletingPaymentRequisitesInProgress = true;
    try {
      const result = await this.resource.deletePaymentRequisites(null, null, {id: companyId, requisitesId: requisitesId});
      if (result.meta['success'] && result.meta['success'] === true) {
        this.company.paymentRequisites.forEach((item: PaymentRequisites, index: number, array: PaymentRequisites[]) => {
          if (item.id === requisitesId) {
            array.splice(index, 1);
          }
        });
        return true;
      }
      console.log(result);
    } catch (error) {
      console.error(error);
      this.isDeletingPaymentRequisitesInProgress = false;
      return false;
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

  /**
   * Выполняется ли добавление платежных реквизитов
   * @returns {boolean}
   */
  addingPaymentRequisitesInProgress(): boolean {
    return this.isAddingPaymentRequisitesInProgress;
  }
}
