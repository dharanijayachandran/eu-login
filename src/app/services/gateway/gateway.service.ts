import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  apiurl = environment.baseUrl_gatewayManagement;
  constructor(private http: HttpClient) { }
 
  clearGatewayIdentifier(gatewayIdentifier: String): Observable<void> {
    return this.http.delete<void>(`${this.apiurl + 'gateway/' + gatewayIdentifier}`, httpOptions);
  }
}
