import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

  /**
   * Ask user to confirm an action. `message` explains the action and choices.
   * Returns Prmose resolving to `true`=confirm or `false`=cancel
   */

  //  Warning - when unsaved changes done ask user to confirm/cancel. 
  alertMessage(title, text): Promise<any> {
    return new Promise((resolve) => {
      Swal.fire({
        title: "Are you sure?",
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        showCloseButton: true,
        customClass: {
          confirmButton: 'btn btn-warning',
          container: 'warning_info',
        }
      }).then((result) => {
        if (result.value) {
          this.navigateAwaySelection$.next(true);
          return resolve(true);
        }
      })
    })
  }

}
