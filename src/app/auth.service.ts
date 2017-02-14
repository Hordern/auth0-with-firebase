import {Injectable}      from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {auth0Config, firebaseConfig} from './auth.config';
import {AngularFire} from "angularfire2";
import {Observable, Observer} from "rxjs";

// Avoid name not found warnings
declare var Auth0Lock: any;
declare var Auth0: any;
declare var firebase: any;

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock(auth0Config.clientID, auth0Config.domain, {});
  auth0 = new Auth0({domain: auth0Config.domain, clientID: auth0Config.clientID});

  getProfile$(authIdToken): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.lock.getProfile(authIdToken, (error, profile) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(profile);
        }
      });
    });
  }

  signInWithFirebase$(authIdToken): Observable<any> {

    let options = {
      id_token: authIdToken,
      api: 'firebase',
      scope: 'openid name email displayName',
      target: auth0Config.clientID
    };

    return Observable.create((observer: Observer<any>) => {
      this.auth0.getDelegationToken(options, (err, result) => {
        if (err) {
          observer.error(err);
        } else {
          const firebaseAuth$ = Observable.fromPromise(firebase.auth().signInWithCustomToken(result.id_token));
          firebaseAuth$.subscribe((result) => {
            observer.next(result);
          }, (err) => {
            observer.error(err);
          });
        }
      });
    });
  }

  constructor(private af: AngularFire) {

    firebase.initializeApp(firebaseConfig);

    let auth0Authenticated$ = Observable.fromEvent(this.lock, 'authenticated');

    let firebaseAuthentication$ = auth0Authenticated$
      .switchMap((authResult: any) => {
        return this.signInWithFirebase$(authResult.idToken);
      });

    let getProfile$ = auth0Authenticated$
      .switchMap((authResult: any) => {
        return this.getProfile$(authResult.idToken);
      });

    auth0Authenticated$.combineLatest(firebaseAuthentication$, getProfile$)
      .subscribe(([authResult, firebaseResult, profile]) => {
        localStorage.setItem('id_token', authResult['idToken']);
        localStorage.setItem('profile', JSON.stringify(profile));
      });
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  };

  public authenticated() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    firebase.auth().signOut().then(function () {
      console.log("Signout Successful")
    }, function (error) {
      console.log(error);
    });
  };
}
