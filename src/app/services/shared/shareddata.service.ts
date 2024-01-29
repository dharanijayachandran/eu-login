import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareddataService {

  constructor() { }

  private messageSource = new Subject<boolean>();
  private subject = new Subject();
  // currentMessage = this.messageSource.asObservable();
  private categorySubject = new Subject();

  private rackAssetSubject = new Subject();

  changeMessage(message: boolean) {
    this.messageSource.next(message)
  }

  getChangedMessage():Observable<boolean>{
    return this.messageSource.asObservable();
  }

  setData(data: any){
    this.subject.next(data);
  }

  getData(){
    return this.subject.asObservable();
  }

  setCategory(data: any){
    this.categorySubject.next(data);
  }

  getCategory(){
    return this.categorySubject.asObservable();
  }

  setRackAsset(data){
    this.rackAssetSubject.next(data);
  }

  getRackAsset(){
    return this.rackAssetSubject.asObservable();
  }
}
