import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FirstappComponent } from './firstapp/firstapp.component';
import { TformComponent } from './tform/tform.component';
import { CompleteformComponent } from './completeform/completeform.component';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { CheckboxexComponent } from './checkboxex/checkboxex.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'firstapp',component:FirstappComponent},
  {path:'tform',component:TformComponent},
  {path:'signup',component:CompleteformComponent},
  {path:'checkbox',component:CheckboxexComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
