import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {
  apiurl = environment.baseUrl_consumerAuth;

  constructor(private http: HttpClient) { }
  getServiceConsumerKeys(): Observable<any> {
    return this.http.get<any>('/assets/serviceConsumer/Keys.json');
  }

  getAuthToken(key): Observable<any> {
    return this.http.get(this.apiurl + '?key=' + key, { responseType: 'text' });
  }
  
}
