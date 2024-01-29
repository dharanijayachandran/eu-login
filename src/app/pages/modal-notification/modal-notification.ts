import { Component, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import $ from 'jquery';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-notification',
  templateUrl: './modal-notification.html'
})

export class UIModalNotificationPage {
  closeResult: string;
  inputField = false;
  remark: any;

  constructor(private modalService: NgbModal) {

  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  // Handling response comes from API
  alertMessage(messageType, message) {
    switch (messageType) {
      case 'Success': {
        // Modal window for success (ex:Created successful , Deleted successful)
        this.swalSuccess(message);
        break;
      }
      case 'Failed': {
        let error;
        // Modal window for failed scenario(ex: Not saved)
        if (message.status === 401) {
          error = message.error.message
        }
        else if (message.status === 0) {
          error = "Not able to process request, Please try after some time."
        }
        else {
          error = message;
        }
        this.swalErrorInfo(error);
        break;
      }
      case 'Info': {
        // Information
        this.swalInfo(message);
        break;
      }
      case 'Warning': {
        // Modal window for Warning info (ex: Cancel/Reset/Tab navigation)
        this.swalWarning(message);
        break;
      }
      case 'Error': {
        // Modal window for delete
        this.swalDanger(message);
        break;
      }
      case 'AlarmMessage': {
        // Modal window for delete
        this.swalAlarmMessage(message);
        break;
      }
      case 'ClearMessage': {
        // Modal window for delete
        this.swalClearMessage(message);
        break;
      }
      default: {
        break;
      }
    }

  }



  // Information
  @Output() modelNotificationInfo = new EventEmitter();
  swalInfo(message) {
    Swal.fire({
      title: "Information",
      text: message,
      icon: 'info',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      showCloseButton: true,
      allowOutsideClick: true,
      customClass: {
        confirmButton: 'btn btn-success',
        // cancelButton: 'btn btn-danger'
      }
    }).then((result) => {
      if (result.value) {
        this.modelNotificationInfo.emit();
      }
    })
  }


  // Modal window for success (ex:Created successful/Deleted successful)
  @Output() modelNotificationSuccess = new EventEmitter();
  swalSuccess(message) {
    Swal.fire({
      title: 'Successful!',
      text: message,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      showCloseButton: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        this.modelNotificationSuccess.emit();
      }
    })
  }

  // Modal window for Warning info (ex: Cancel/Reset/Tab navigation)
  @Output() modelNotificationWarning = new EventEmitter();
  swalWarning(message) {
    Swal.fire({
      title: 'Warning!',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      showCloseButton: true,
      customClass: {
        confirmButton: 'btn btn-warning',
        container: 'warning_info',
      },
      // customClass: 'warning_info'
    }).then((result) => {
      if (result.value) {
        this.modelNotificationWarning.emit();
      }
    })
  }


  // Modal window for Warning info (ex: Cancel/Reset/Tab navigation)
  @Output() modelNotificationWarningAlarm = new EventEmitter();
  swalWarningAlarm(message) {
    Swal.fire({
      title: 'Are you sure?',
      html: message + ''
        + '<br /><textarea *ngIf="inputField" #remark style="height:50px!important" id="remark" class="form-control m-input col-md-8 mt-2 mx-auto" type="text" name="remark" placeholder="Enter Remark"></textarea>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      showCloseButton: true,
      customClass: {
        confirmButton: 'btn btn-warning',
        container: 'warning_info',
      },
      // customClass: 'warning_info'
    }).then((result) => {
      if (result.value) {
        if (this.inputField) {
          this.remark = document.getElementById('remark')['value'];
          this.modelNotificationWarningAlarm.emit(this.remark);
        } else this.modelNotificationWarningAlarm.emit();
      }
    })
  }


  // Modal window for delete
  @Output() modelNotificationDanger = new EventEmitter();
  swalDanger(message) {
    Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      showCloseButton: true,
      customClass: {
        confirmButton: 'btn btn-danger',
      }
    }).then((result) => {
      if (result.value) {
        this.modelNotificationDanger.emit();
      }
    })
  }

  // Modal window for failed scenario(ex: Not saved)
  swalErrorInfo(message) {
    Swal.fire({
      title: "Failed!",
      text: message,
      icon: 'info',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      showCloseButton: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        container: 'error_info'
      }
    }).then((result) => {
      if (result.value) {
      }
    })
  }


  // Modal window for help (ex: Format of alarm message)
  @Output() modelNotificationAlarmMessage = new EventEmitter();
  swalAlarmMessage(message) {
    Swal.fire({
      title: 'Alarm Message Format!',
      html: message,
      showCancelButton: false,
      showCloseButton: true,
      allowOutsideClick: true,
      allowEnterKey: true,
    }).then((result) => {
      if (result.value) {
        this.modelNotificationAlarmMessage.emit();
      }
    })
  }

  // Modal window for help (ex: Format of alarm message)
  @Output() modelNotificationClearMessage = new EventEmitter();
  swalClearMessage(message) {
    Swal.fire({
      title: 'Clear Message Format!',
      html: message,
      showCancelButton: false,
      showCloseButton: true,
      allowOutsideClick: true,
      allowEnterKey: true,
    }).then((result) => {
      if (result.value) {
        this.modelNotificationAlarmMessage.emit();
      }
    })
  }

  helpMessage(message) {
    this.swalHelp(message);
  }

  swalHelp(message) {
    Swal.fire({
      position: 'top-end',
      showConfirmButton: false,
      html: message,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
    }).then((result) => {
      if (result.value) {
        this.modelNotificationInfo.emit();
      }
    })
  }

}

