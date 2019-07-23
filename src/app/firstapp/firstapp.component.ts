import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Product } from './product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-firstapp',
  templateUrl: './firstapp.component.html',
  styleUrls: ['./firstapp.component.scss']
})
export class FirstappComponent implements OnInit {
product: Product={
  name:'Shirt',
  price:20000,
  description:'Silk shirt is good for Hot weather'
};

products: Product[]=[
{
  name:'Under wear',
  price:5000,
  description:'Under wear is good for Hot weather'
},
{
  name:'Pant',
  price:30000,
  description:'Silk Pant is good for Hot weather'
},
{
  name:'TShirt',
  price:20000,
  description:'Silk shirt is good for Hot weather'
}
];

  constructor(private _dataService : DataService, private route : ActivatedRoute) { 
    
  }
  selectedproduct: string;
   ngOnInit() {
       this.selectedproduct ='Pant';
   
  }

onSelectedProuct(product){
  this.selectedproduct = product.name;
  console.log(product.name);
//window.alert(product.name+' Product added to Cart');
}
}
