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
    const dateRegExp = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
    this.rewardForm = this.formBuilder.group({
      name: [this.rewardData.name, Validators.required],
      description: [this.rewardData.description],
      reward_type: [this.rewardData.type, Validators.required],
      from: [this.rewardData.from, [Validators.required, Validators.pattern(dateRegExp)]],
      to: [this.rewardData.to, Validators.pattern(dateRegExp)],
      value: [this.rewardData.value, Validators.required],
      is_available: [this.rewardData.is_available]
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
      reward_type: this.rewardsService.getRewardTypes().length > 0 ? this.rewardsService.getRewardTypes()[0].code : '',
      from: this.rewardData.from,
      to: this.rewardData.to,
      value: this.rewardData.value
    });
    this.isInAddRewardMode = true;
    console.log(this.rewardData);
    console.log(this.rewardForm);
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
    this.rewardData.id = reward.id;
    this.rewardData.name = reward.title;
    this.rewardData.description = reward.description;
    this.rewardData.type = reward.type;
    this.rewardData.from = `${reward.start.getFullYear()}-${reward.start.getMonth() < 10 ? '0' + (reward.start.getMonth() + 1).toString() : reward.start.getMonth()}-${reward.start.getDate()}`;
    this.rewardData.to = reward.end ? `${reward.end.getFullYear()}-${reward.end.getMonth() < 10 ? '0' + (reward.end.getMonth() + 1).toString() : reward.end.getMonth()}-${reward.end.getDate()}` : null;
    this.rewardData.value = reward.value;
    this.rewardForm.reset({
      name: this.rewardData.name,
      description: this.rewardData.description,
      reward_type: this.rewardData.type,
      from: this.rewardData.from,
      to: this.rewardData.to,
      value: this.rewardData.value
    });
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
      case 'reward_type':
        return control.dirty && control.hasError('required') ? 'Вы не выбрали тип вознаграждения' : '';
      case 'from':
        return control.dirty && control.hasError('required')
          ? 'Вы не указали дату начала действия' : control.hasError('pattern')
            ? 'Дата начала должна быть в формате ГГГГ-М-ДД' : '';
      case 'to':
        return control.dirty && control.hasError('required') ?
          'Вы не указали дату окончания действия' : control.hasError('pattern')
            ? 'Дата окончания должна быть в формате ГГГГ-ММ-ДД' : '';
      case 'value':
        return control.dirty && control.hasError('required') ? 'Вы не указали величину вознаграждения' : '';
    }
  }

  /**
   * Изменение доступности вознаграждения
   * @param {boolean} value - Значение
   */
  changeRewardAvailable(value: boolean) {
    this.rewardForm.markAsDirty();
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
   * Изменение вознаграждения
   * @returns {Promise<void>}
   */
  async editReward() {
    if (this.rewardData.description === '') {
      delete this.rewardData.description;
    }
    if (this.rewardData.to === '') {
      delete this.rewardData.to;
    }
    await this.rewardsService.editReward(this.rewardData, this.authenticationService.getCurrentUser().companyId)
      .then(() => {
        this.closeEditRewardDialog();
        this.message['success']('Вознаграждение изменено');
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
