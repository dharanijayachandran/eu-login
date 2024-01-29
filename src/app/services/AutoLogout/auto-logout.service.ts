import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, OnDestroy, OnInit, Output } from "@angular/core";
import { Router } from '@angular/router';
import { LogoutService } from "src/app/Login/services/logout/logout.service";
import Swal from "sweetalert2";
const MINUTES_UNITL_AUTO_LOGOUT = 30// in mins
const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY = 'lastAction';

@Injectable()
export class AutoLogoutService implements OnDestroy {
  currentSigOnTime: any;
  userId: string;
  inter: NodeJS.Timeout;
  POP_RISED: boolean = true;
  public getLastAction() {
    return parseInt(localStorage.getItem("lastAction"));
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  constructor(private router: Router, private logoutService: LogoutService, private httpClient: HttpClient) {
    this.sessionIdealTimeOut();
    this.initListener();
    this.initInterval();
    localStorage.setItem(STORE_KEY, Date.now().toString());
  }

  ngOnDestroy() {
    clearInterval(this.inter);
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    this.inter = setInterval(() => {
      this.sessionIdealTimeOut();
    }, CHECK_INTERVAL);
  }

  sessionIdealTimeOut() {
    this.userId = sessionStorage.getItem('userId');
    const now = Date.now();
    let lastAction = this.getLastAction();
    const timeleft = lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    if (this.currentSigOnTime != null || this.userId != undefined || this.userId != null) {
      if (isTimeout && this.POP_RISED) {
        this.POP_RISED = false;
        this.swalWarning("Your session is about to expire!");
      }
    }
  }

  logout() {
    this.logoutService.logout().subscribe(response => {
      localStorage.clear();
      localStorage.removeItem('pagemenu');
      sessionStorage.clear();
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userName');
    },
      error => {

      }
    );
  }


  // Modal window for Warning info (ex: Cancel/Reset/Tab navigation)
  @Output() modelNotificationWarning = new EventEmitter();
  swalWarning(message) {
    let timerInterval
    Swal.fire({
      title: message,
      html: '<p>You will be logged out in <b></b> seconds.</p><br?' + '<p>Do you want to stay signed in?</p>',
      timer: 100000,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Keep me signed in',
      cancelButtonText: 'No, Sign me out',
      timerProgressBar: true,
      imageHeight: 400,
      allowOutsideClick: false,
      reverseButtons: true,
      onOpen: () => {
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Math.ceil(Swal.getTimerLeft() / 1000).toString();
            }
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer || result.dismiss === Swal.DismissReason.cancel) {
        this.logout();
        this.POP_RISED = true;
      }
      else if (result.value === true) {
        this.reset();
        this.POP_RISED = true;
      }
    })

  }
}
