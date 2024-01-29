
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { tap } from "rxjs/operators";

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  isJsonContainsVal(json, value) {
    let contains = false;
    Object.keys(json).some(key => {
      contains = typeof json[key] === 'object' ? this.isJsonContainsVal(json[key], value) : json[key] === value;
      return contains;
    });
    return contains;
  }
  constructor(private router: Router) { }

  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('resetpass') || request.url.includes('userResetPassword') || request.url.includes('forgotPassword') || request.url.includes('login') || request.url.includes('assets/json')) {
      //alert("userId found......"+sessionStorage.getItem('userId'))
      let urlString = location.href;
      let urlLocation = urlString.substring(urlString.lastIndexOf('/') + 1);
      //replace below list with API response and develope UI to add exception page list --Version V2
      let excepList = [{ 'name': 'v3' }, { 'name': 'aboutus' }, { 'name': 'home' }, { 'name': 'v1' }, { 'name': '#' }];
      //let exceptionList=JSON.parse(excepList);
      let hasMatch = false;
      for (let i = 0; i < excepList.length; ++i) {
        let pageName = excepList[i].name;
        if (pageName == urlLocation) {
          hasMatch = true;
          break;
        }
      }
      //logging the updated Parameters to browser's console
      return next.handle(request).pipe(
        tap(
          event => {
            //logging the http response to browser's console in case of a success
            if (event instanceof HttpResponse) {

            }
          },
          error => {
            //logging the http response to browser's console in case of a failuer
            if (event instanceof HttpErrorResponse) {
              // 
              alert("call failed.....")
            }
          }
        )
      );
    }
    else if (sessionStorage.getItem("userId") != undefined && sessionStorage.getItem("userId") != null) {
      const userId = sessionStorage.getItem("userId");
      let options = {
        headers : new HttpHeaders({
          'userId': userId
        })
      }
        const authToken = localStorage.getItem("user-management-auth-token");
        if (authToken != undefined && authToken != null) {
          options.headers = options.headers.append('Authorization', authToken);
        }
        const updatedRequest = request.clone({
          //if we need. to pass any page level and module/API specific key/Auth, we will use this code.
          headers: options.headers
        });
      //logging the updated Parameters to browser's consoleupdatedRequest
      return next.handle(updatedRequest).pipe(
        tap(
          event => {
            //logging the http response to browser's console in case of a success
            if (event instanceof HttpResponse) {

            }
          },
          error => {
            //logging the http response to browser's console in case of a failuer
            if (error instanceof HttpErrorResponse) {
              // 
              if (error.status === 401) {
                this.router.navigate(['/']);
              }
            }
          }
        )
      )
    }
    else {
      this.router.navigate(['/']);
      return next.handle(request.clone());
    }
  }
}