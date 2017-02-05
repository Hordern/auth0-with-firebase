import {Injectable}      from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {auth0Config, firebaseConfig} from './auth.config';
import {AngularFire} from "angularfire2";

// Avoid name not found warnings
declare var Auth0Lock: any;
declare var Auth0: any;
declare var firebase: any;

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock(auth0Config.clientID, auth0Config.domain, {});
  auth0 = new Auth0({domain: auth0Config.domain, clientID: auth0Config.clientID});


  constructor(private af: AngularFire) {
    // Initialize Firebase

    firebase.initializeApp(firebaseConfig);


    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
      this.lock.getProfile(authResult.idToken, (error, profile) => {

        if (error) {
          // handle error
          return;
        }

        localStorage.setItem('profile', JSON.stringify(profile));

        // Set the options to retreive a firebase delegation token
        let options = {
          id_token: authResult.idToken,
          api: 'firebase',
          scope: 'openid name email displayName',
          target: auth0Config.clientID
        };

        // Make a call to the Auth0 '/delegate'
        this.auth0.getDelegationToken(options, (err, result) => {
          if (!err) {
            // Exchange the delegate token for a Firebase auth token
            firebase.auth().signInWithCustomToken(result.id_token)
              .then((result) => {
                console.log(result);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      });
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
