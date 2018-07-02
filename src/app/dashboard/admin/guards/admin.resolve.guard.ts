import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { Company } from '../../company/models/company.model';

@Injectable({
  providedIn: 'root'
})
export class AdminResolveGuard implements Resolve<Company[]> {
  constructor(private readonly adminService: AdminService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Company[]> {
    const result = await this.adminService.fetchCompanies();
    return result;
  }
}
