import { Component, OnInit } from '@angular/core';
import { Student } from '../student';

@Component({
  selector: 'app-completeform',
  templateUrl: './completeform.component.html',
  styleUrls: ['./completeform.component.scss']
})
export class CompleteformComponent implements OnInit {
countries = ['Bangladesh','USA','Japan','Australia','canada'];
hobbis = ['readining','coding'];
model = new Student(1,'Sami','sami@gmail.com',new Date(23,7,2019),'m',this.countries[0],'Police Officer',this.hobbis);
titles = ['ID','Name', 'Email','Date Of Birth','Gender','Country','Comments','hobbies'];
submitted=false;
  constructor() { }

  ngOnInit() {
  }
onSubmit(){
  this.submitted=true;
  console.log(this.model.fname);
  }

  get diagonistic(){
    return JSON.stringify(this.model);
  }
}
