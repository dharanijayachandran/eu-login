import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import pageSettings from 'src/app/config/page-settings';
import { Menu } from 'src/app/model/menu';
import Swal from 'sweetalert2';
import { ForgotPassword } from '../../model/forgotPassword';
import { loginInput, UserData } from '../../model/UserData';
import { AuthService } from '../../services/auth/auth.service';
import { EncrDecrService } from '../../services/encrDecr/encr-decr.service';
import { LogoutService } from '../../services/logout/logout.service';
import $ from 'jquery';
import { MenuService } from 'src/app/services/menu/menu.service';
import { AutoLogoutService } from 'src/app/services/AutoLogout/auto-logout.service';
import { globalSharedService } from 'src/app/services/global/globalSharedService';
import { UIModalNotificationPage } from 'src/app/pages/modal-notification/modal-notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild(UIModalNotificationPage) modelNotification;
  userCreds: loginInput
  pageSettings = pageSettings;
  userData: UserData;
  loginErrorMessage: string;
  logoutSuccessMessage: string;
  dataSource: any;
  loginText: string;
  forgotPassword: ForgotPassword;
  passDiv = true;
  recoverPass: boolean = false;
  passwordresetsuccess: string;
  passwordresetfailure: string;
  encrypted = false;
  disableForm = false;
  organizationId: number;
  credentialsForm: FormGroup;
  loginInput: loginInput;
  features: any[];
  loginUrl: string;
  themeJson: string;
  topMenu: string;
  sideBarMenu: string;
  logout: string;
  constructor(private router: Router, private renderer: Renderer2, private auth: AuthService, private menu: MenuService, private route: ActivatedRoute, private logoutService: LogoutService, private globalService: globalSharedService,
    private encrDecrService: EncrDecrService, private cdr: ChangeDetectorRef, private autoLogout: AutoLogoutService, private formBuilder: FormBuilder,) {
    this.userCreds = new loginInput();
    this.renderer.addClass(document.body, 'bg-white');
    this.userData = new UserData();

  }

  treeControl = new NestedTreeControl<Menu>(node => node.menus);

  hasChild = (_: number, node: Menu) => !!node.menus && node.menus.length > 0;

  ngOnDestroy() {
    this.pageSettings.pageEmpty = false;
    this.renderer.removeClass(document.body, 'bg-white');
  }
  ngOnInit() {
    this.userCredsForm();
    this.passwordresetsuccess = sessionStorage.getItem("passwordChange");
    this.passwordresetfailure = this.auth.failure;
    this.encrypted = false;

  }
  userCredsForm() {
    this.credentialsForm = this.formBuilder.group({
      signonId: ['', [Validators.required]],
      signonPassword: ['', [Validators.required]]
    })
  }
  ngAfterViewInit() {
    this.loginText = "Sign me in";
    this.cdr.detectChanges();
    $('app-login').siblings('.ps__rail-y').hide();
  }
  login() {
    this.loginUrl = sessionStorage.getItem("loginUrl");
    this.themeJson = sessionStorage.getItem('theamName');
    this.topMenu = sessionStorage.getItem("topMenu");
    this.sideBarMenu = sessionStorage.getItem("sidebarMenu");
    this.logout = sessionStorage.getItem('logout');
    localStorage.clear();
    sessionStorage.clear();
    this.passwordresetsuccess = null;
    this.disableForm = true;
    if (this.loginText === "Sign me in") {

      this.loginErrorMessage = null;

      localStorage.clear();
      sessionStorage.clear();
 
      if (this.credentialsForm.get('signonId').value === undefined || this.credentialsForm.get('signonPassword').value === undefined) {
        this.disableForm = false;
        this.loginErrorMessage = 'Username or Password should not be blank.';
        this.router.navigate(['']);
      }

      else if (this.credentialsForm.get('signonId').value === "" || this.credentialsForm.get('signonPassword').value === "") {
        this.disableForm = false;
        this.loginErrorMessage = 'Username or Password should not be blank.';
        this.router.navigate(['']);
      }
      else {
        if (!this.encrypted) {
          this.encrypted = true;
          this.credentialsForm.controls['signonPassword'].setValue(this.encrDecrService.encryptUsingAES(this.credentialsForm.get('signonPassword').value));
        }
        this.userCreds = <loginInput>this.credentialsForm.value;
        this.auth.validateUserCredentials(this.userCreds).subscribe(response => {
          if (this.logout) {
            sessionStorage.setItem('logout', 'true');
          }
          this.pageSettings.pageEmpty = false;
          sessionStorage.setItem('pageEmpty', 'false');
          sessionStorage.setItem('loginUrl', this.loginUrl);
          sessionStorage.setItem('userId', response.userId);
          sessionStorage.setItem('beTypeId', response.beTypeId);
          sessionStorage.setItem('beType', response.beType);
          sessionStorage.setItem('beId', response.beId);
          sessionStorage.setItem('userName', response.userName);
          sessionStorage.setItem('isAdmin', response.isAdmin);
          sessionStorage.setItem('isSystemAdmin', response.isSystemAdmin);
          sessionStorage.setItem('firstName', response.firstName);
          sessionStorage.setItem('middleName', response.middleName);
          sessionStorage.setItem('lastName', response.lastName);
          sessionStorage.setItem('beName', response.beName);
          sessionStorage.setItem('gender', response.gender);
          sessionStorage.setItem("sessionId", response.sessionId);
          sessionStorage.setItem("authenticationType", response.authenticationType);
          sessionStorage.setItem("theamName", this.themeJson);
          sessionStorage.setItem("topMenu", this.topMenu);
          sessionStorage.setItem("sidebarMenu", this.sideBarMenu)
          let menu = response.loggedinMenus;
          sessionStorage.setItem("loggedinMenus", JSON.stringify(response.loggedinMenus));
          if (response != null || response != undefined) {
            this.getFeaturesByOrganizationId(+response.beId);
          }
          this.menu.setSideBarMenus(response.loggedinMenus);
          this.autoLogout.initListener();
          this.globalService.landingMenuUrl(response.landingMenuUrl);
          sessionStorage.setItem("landingMenuUrl", '#/' + response.landingMenuUrl);
          window.location.href = '#/' + response.landingMenuUrl;
          $('.ps__rail-y').show();
          this.encrypted = false;
        },
          error => {
            if (error.status === 0) {
              this.loginErrorMessage = 'Server is unavailable'
              this.userCredsForm();
              this.encrypted = false;
              this.disableForm = false;
            }
            else if (error.status === 409) {
              this.disableForm = false;
              let userId = error.error.userId;
              sessionStorage.setItem('userId', userId);
              sessionStorage.setItem("sessionId", error.error.sessionId);
              this.swalWarningSession(error.error.message);
            }
            else if (error.status === 403) {
              this.loginErrorMessage = error.error.message;
              this.userCredsForm();
              this.encrypted = false;
              this.disableForm = false;
            }
            else if (error.status === 401) {
              this.loginErrorMessage = error.error.message;
              this.userCredsForm();
              this.encrypted = false;
              this.disableForm = false;
            }
            else if (error.status === 500) {
              this.loginErrorMessage = error.error;
              this.userCredsForm();
              this.encrypted = false;
              this.disableForm = false;
            }
            else {
              this.loginErrorMessage = error.error.message;
              this.userCredsForm();
              this.encrypted = false;
              this.disableForm = false;
            }
          });
      }
    }
    else if (this.loginText === "Recover Password") {

      if (this.credentialsForm.get('signonId').value === undefined || this.credentialsForm.get('signonId').value === "") {
        this.loginErrorMessage = 'Username should not be Blank';
        this.router.navigate(['']);
      }
      else {
        this.forgotPassword = new ForgotPassword();
        this.forgotPassword.signonId = this.credentialsForm.get('signonId').value;
        this.auth.forgotPasswordProcess(this.forgotPassword).subscribe(response => {
          this.loginErrorMessage = "";
          this.passwordresetsuccess = response;
        },
        error => {
          this.loginErrorMessage = error.error;
          // this.loginErrorMessage = "Reset Password Mail failed, Try again later";
        });
      }
    }
  }
  generateEmailToResetPass(emailId: string) {
    //To-Do :call same API which we are using for new User registration
  }


  generateForgetPassword() {
    //To-Do :change visible fields according to forget password
    this.loginErrorMessage = null;
    this.passwordresetsuccess = null;
    this.passDiv = false;
    this.recoverPass = true;
    this.loginText = "Recover Password";
    this.cdr.detectChanges();
  }

  cancelRecoverPass() {
    this.loginErrorMessage = null;
    this.passwordresetsuccess = null;
    this.recoverPass = false;
    this.loginText = "Sign me in";
    this.cdr.detectChanges();
  }

  closingCurrentSession() {

    this.disableForm = false;
    this.logoutService.logout().subscribe(response => {
      localStorage.clear();
      localStorage.removeItem('pagemenu');
      sessionStorage.clear();
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userName');
      sessionStorage.setItem('loginUrl', 'eu-login');
      sessionStorage.setItem('pageEmpty', 'false');
      sessionStorage.setItem('logout', 'true');
      sessionStorage.setItem("theamName", this.themeJson);
      sessionStorage.setItem("topMenu", this.topMenu);
      sessionStorage.setItem("sidebarMenu", this.sideBarMenu)
      this.login()
    },
      error => {

      }
    );
  }
  swalWarningSession(message) {
    Swal.fire({
      title: 'Warning!',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      showCloseButton: true,
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'btn btn-warning',
        container: 'warning_info',
      },
      // customClass: 'warning_info'
    }).then((result) => {
      if (result.value) {
        this.closingCurrentSession();
      }
    })
  }


  getFeaturesByOrganizationId(organizationId: number) {
    this.auth.getFeaturesByOrganizationId(organizationId).subscribe(res => {
      if (res != null) {
        this.features = res;
        this.features.forEach(element => {
          if (element.name === "feature.i18n.enabled") {
            sessionStorage.setItem("isI18nEnabled", element.value);
          } else if (element.name === "feature.add.new.user.from.ad") {
            sessionStorage.setItem("isAddNewUserFromAdEnabled", element.value);
          } else if (element.name === "feature.email.notification.user") {
            sessionStorage.setItem("isEmailNotificationUserEnabled", element.value);
          }
        });
      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
}


