import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class profileService {
  apiurl = environment.baseUrl_UserManagement;

  constructor(private http: HttpClient) { }

  getUserInformationByUserId(userId) {
    return this.http.get<User>(this.apiurl + 'user/' + userId);
  }
}

