import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  apiurl = environment.baseUrl_empyrealUniverseImage;
  constructor(private http: HttpClient) { }
  getImage():Observable<any>{
    return this.http.get<any>(this.apiurl+'image');
 }
}
