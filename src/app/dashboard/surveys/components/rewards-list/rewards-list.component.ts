import { Component, OnInit } from '@angular/core';
import { RewardsService } from '../../services/rewards.service';
import { Reward } from '../../models/reward.model';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IRewardDTO } from '../../dto/reward.dto';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { ElMessageService } from 'element-angular/release/message/message.service';

@Component({
  selector: 'app-rewards-list',
  templateUrl: './rewards-list.component.html',
  styleUrls: ['./rewards-list.component.scss']
})
export class RewardsListComponent implements OnInit {
  public isInAddRewardMode: boolean;
  public isInEditRewardMode: boolean;
  public isInDeleteRewardMode: boolean;
  public selectedReward: Reward | null;
  public rewardForm: FormGroup;
  public rewardData: IRewardDTO;

  constructor(private readonly formBuilder: FormBuilder,
              public readonly authenticationService: AuthenticationService,
              public readonly rewardsService: RewardsService,
              private readonly message: ElMessageService) {
    this.isInAddRewardMode = false;
    this.isInEditRewardMode = false;
    this.isInDeleteRewardMode = false;
    this.selectedReward = null;
    this.rewardData = {
      id: 0,
      company_id: 0,
      type: this.rewardsService.getRewardTypes().length > 0 ? this.rewardsService.getRewardTypes()[0].code : '',
      name: '',
      description: '',
      from: '',
      to: '',
      value: '',
      is_available: true
    };
  }

  ngOnInit() {
    this.rewardForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      from: ['', Validators.required],
      to: [''],
      value: ['', Validators.required]
    });
  }

  /**
   * Открытие модального окна добавления вознаграждения
   */
  openAddRewardDialog() {
    this.rewardData = {
      id: 0,
      company_id: 0,
      name: '',
      description: '',
      type: this.rewardsService.getRewardTypes().length > 0 ? this.rewardsService.getRewardTypes()[0].code : '',
      from: '',
      to: '',
      value: '',
      is_available: true
    };
    this.rewardForm.reset({
      name: this.rewardData.name,
      description: this.rewardData.description,
      type: this.rewardData.type,
      from: this.rewardData.from,
      to: this.rewardData.to,
      value: this.rewardData.value
    });
    this.isInAddRewardMode = true;
    console.log(this.rewardData);
  }

  /**
   * Закрытие модального окна добавления вознаграждения
   */
  closeAddRewardDialog() {
    this.isInAddRewardMode = false;
  }

  /**
   * Открытие модального окна изменения вознаграждения
   * @param {Reward} reward - Вознаграждение
   */
  openEditRewardDialog(reward: Reward) {
    this.selectedReward = reward;
    this.isInEditRewardMode = true;
  }

  /**
   * Закрытие модального окна изменения вознаграждения
   */
  closeEditRewardDialog() {
    this.isInEditRewardMode = false;
    this.selectedReward = null;
  }

  /**
   * Открытие модального окна подтверждения удаления вознаграждения
   * @param {Reward} reward - Вознаграждение
   */
  openDeleteRewardDialog(reward: Reward) {
    this.selectedReward = reward;
    this.isInDeleteRewardMode = true;
  }

  /**
   * Закрыие модального окна подтверждения удаления вознаграждения
   */
  closeDeleteRewardDialog() {
    this.isInDeleteRewardMode = false;
    this.selectedReward = null;
  }

  /**
   * Получение статуса элемента формы вознаграждении
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  rewardFormStatusCtrl(item: string): string {
    if (!this.rewardForm.controls[item]) { return; }
    const control: AbstractControl = this.rewardForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('pattern') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы вознаграждения
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  rewardFormMessageCtrl(item: string): string {
    if (!this.rewardForm.controls[item]) { return; }
    const control: AbstractControl = this.rewardForm.controls[item];
    switch (item) {
      case 'name':
        return control.dirty && control.hasError('required') ? 'Вы не указали наименование' : '';
      case 'type':
        return control.dirty && control.hasError('pattern') ? 'Вы не выбрали тип вознаграждения' : '';
      case 'from':
        return control.dirty && control.hasError('required')
          ? 'Вы не указали дату начала действия' : control.hasError('pattern')
            ? 'Время начала работы должно быть в формате ЧЧ:ММ' : '';
      case 'to':
        return control.dirty && control.hasError('required') ?
          'Вы не указали дату окончания действия' : control.hasError('pattern')
            ? 'Время начала работы должно быть в формате ЧЧ:ММ' : '';
      case 'value':
        return control.dirty && control.hasError('required') ? 'Вы не указали величину вознаграждения' : '';
    }
  }

  /**
   * Добавление вознаграждения
   * @returns {Promise<void>}
   */
  async addReward() {
    if (this.rewardData.description === '') {
      delete this.rewardData.description;
    }
    if (this.rewardData.to === '') {
      delete this.rewardData.to;
    }
    await this.rewardsService.addReward(this.rewardData, this.authenticationService.getCurrentUser().companyId)
      .then(() => {
        this.closeAddRewardDialog();
        this.message['success']('Вознаграждение добавлено');
      });
  }

  /**
   * Удаление вознаграждения
   * @returns {Promise<void>}
   */
  async deleteReward() {
    await this.rewardsService.deleteReward(this.selectedReward, this.authenticationService.getCurrentUser().companyId)
      .then(() => {
        this.closeDeleteRewardDialog();
        this.message['success']('Вознаграждение удалено');
      });
  }
}
