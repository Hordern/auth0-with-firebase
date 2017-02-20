import {NgModule}            from '@angular/core';
import {BrowserModule}      from '@angular/platform-browser';
// import {AUTH_PROVIDERS}      from 'angular2-jwt';

import {AppComponent}        from './app.component';
import {HomeComponent}       from './home.component';
import {
  routing,
  appRoutingProviders
} from './app.routes';
import {AngularFireModule} from "angularfire2";
import {firebaseConfig} from "./auth.config";
import {ProfileService} from "./profile.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [
    appRoutingProviders,
    // AUTH_PROVIDERS,
    ProfileService
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    routing,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
