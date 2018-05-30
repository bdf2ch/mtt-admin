import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Company } from '../models/company.model';
import { CompanyService } from '../services/company.service';
import { AuthenticationService } from '../../authentication/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyResolveGuard implements Resolve<Promise<Company | null>> {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly companyService: CompanyService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Company | null> {
    const result = await this.companyService.fetchCompanyById(this.authenticationService.getCurrentUser().companyId);
    return result;
  }

}
