import { Component, OnInit } from '@angular/core';
import { Hobby } from './hobby';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkboxex',
  templateUrl: './checkboxex.component.html',
  styleUrls: ['./checkboxex.component.scss']
})
export class CheckboxexComponent implements OnInit {
  hobby = new Hobby(1, 'writing');


    constructor() { }

  ngOnInit() {
  }
  get diagonistic() {
    return JSON.stringify(this.hobby);
  }
}
