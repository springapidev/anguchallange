import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopnavComponent } from './topnav/topnav.component';
import { HomeComponent } from './home/home.component';
import { FirstappComponent } from './firstapp/firstapp.component';
import { DataService } from './data.service';
import { TformComponent } from './tform/tform.component';
import { CompleteformComponent } from './completeform/completeform.component';
import { CheckboxexComponent } from './checkboxex/checkboxex.component';

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    HomeComponent,
    FirstappComponent,
    TformComponent,
    CompleteformComponent,
    CheckboxexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
