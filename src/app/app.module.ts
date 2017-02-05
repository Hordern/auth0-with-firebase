import {NgModule}            from '@angular/core';
import {BrowserModule}      from '@angular/platform-browser';
import {AUTH_PROVIDERS}      from 'angular2-jwt';

import {AppComponent}        from './app.component';
import {HomeComponent}       from './home.component';
import {
  routing,
  appRoutingProviders
} from './app.routes';
import {AngularFireModule} from "angularfire2";
import {firebaseConfig} from "./auth.config";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [
    appRoutingProviders,
    AUTH_PROVIDERS
  ],
  imports: [
    BrowserModule,
    routing,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
