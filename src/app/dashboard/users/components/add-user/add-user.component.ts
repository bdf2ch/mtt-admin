import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  @Input() visible: boolean;
  @Output() close = new EventEmitter<void>();

  constructor() {
    //this.visible = false;
    //this.close = new EventEmitter<void>();
    console.log(this.close);
  }

  ngOnInit() {}

  handle() {
    setTimeout(() => {
      console.log('close', this.close);
      this.close.emit();
    });
  }

}
