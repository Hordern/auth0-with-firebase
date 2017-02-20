import { Injectable } from '@angular/core';

@Injectable()
export class ProfileService {

    constructor() {

    }
    getProfile() {
      return JSON.parse(localStorage.getItem("profile"));
    }
}
