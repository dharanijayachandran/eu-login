import { Observable } from 'rxjs/internal/Observable';
import { Menu } from '../../model/menu';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  pageMenus: Menu[];
  parentMenuId = null;

  constructor(private http: HttpClient) { }


  // Setting sidebar menus in globally
  setSideBarMenus(sideBarMenu) {
    this.pageMenus = sideBarMenu;
  }
  // Getting sidebar menus in globally
  getSideBarMenus() {
    return this.pageMenus;
  }

  GettingParentId(id: any) {
    this.parentMenuId = id;
    setTimeout(() => {
      this.parentMenuId = null;
    }, 2000)
  }
}
