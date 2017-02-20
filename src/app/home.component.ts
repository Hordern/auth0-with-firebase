import {Component}  from '@angular/core';
import {Auth}       from './auth.service';
import {ProfileService} from "./profile.service";
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Observable, BehaviorSubject} from "rxjs";

@Component({
  selector: 'home',
  template: `
    <h4 *ngIf="auth.authenticated()">You are logged in</h4>
    <h4 *ngIf="!auth.authenticated()">You are not logged in, please click 'Log in' button to login</h4>
  
      <div *ngIf="auth.authenticated()">
      <input type="text" [(ngModel)]="messageText">
      <button (click)="saveText($event)">Save message</button>
      
      <ul>
        <li *ngFor="let message of messages$ | async">
            {{message?.text}}
        </li>
      </ul>  
    </div>
  `
})

export class HomeComponent {
  messageText: string;
  messages$: FirebaseListObservable<any>;

  constructor(private auth: Auth, private profile: ProfileService, private af: AngularFire) {
    if (this.auth.authenticated()) {
      this.messages$ = this.af.database.list(`/user-messages/${profile.getProfile().user_id}`);
    }
  }

  saveText($event: any): void {
    let postData = {
      text: this.messageText,
      user: this.profile.getProfile().user_id
    };

    // Get a key for a new Message.
    let newMessageKey = this.af.database.list('/messages').push(postData).key;
    this.af.database.object('/user-messages/' + this.profile.getProfile().user_id + '/' + newMessageKey).set(postData)
  }
}
