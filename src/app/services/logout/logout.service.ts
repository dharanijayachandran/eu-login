import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorData } from '../../model/ErrorData';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  baseUrl_User = environment.baseUrl_UserManagement;
  constructor(private http: HttpClient) { }

  logout(): Observable<ErrorData> { 
   /*  const options = {
      headers: new HttpHeaders({
        'userId': userId,
        'Authorization': sessionStorage.getItem("sessionId")
      })
    }; */
//    console.log(options)
  return this.http.get<ErrorData>(this.baseUrl_User + 'logout');
}

  getSignOnHistoryByUserId(userId): Observable<any> {
    return this.http.get<any>(this.baseUrl_User + 'users/signOnHistory/' + userId);
  }
  
}

