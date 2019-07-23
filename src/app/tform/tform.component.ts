import { Component, OnInit } from '@angular/core';
import { Hero } from './hero';

@Component({
  selector: 'app-tform',
  templateUrl: './tform.component.html',
  styleUrls: ['./tform.component.scss']
})
export class TformComponent implements OnInit {
  powers = ['Really Smart', 'Super Flexible',
            'Super Hot', 'Weather Changer'];

 model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');   
 
 submitted=false;

  constructor() { }

  onSubmit() { this.submitted = true; 
  console.log(this.model.name);
  }

  ngOnInit() {
    
  }
 // TODO: Remove this when we're done
 get diagnostic() { return JSON.stringify(this.model); }

 newHero() {
  this.model = new Hero(42, '', '');
}

}
