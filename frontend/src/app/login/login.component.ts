import { NgModule } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { UserVo } from '../vo/user-vo';
import { RestService } from '../service/rest-service';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
//import { ButtonModule } from 'primeng/components/button/button';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


@NgModule({
  imports: [ButtonModule]
})

export class LoginComponent {

  public userVo: UserVo;

  @ViewChild('loginForm')
  loginForm: NgForm;

  constructor(private restService: RestService, private messageService: MessageService, private router: Router) {
    this.userVo = new UserVo();
    const message = {summary:'Service Message', detail:'Via MessageService', severity: 'error', key: 'main'};

  }

  public handleLoginClicked(): void {
    if (this.loginForm.form.valid) {
      this.login();
    } else {
      this.showLoginError();
    }
  }

  public goToRegistration(): void {
    this.router.navigate(['/register']);
  }

  private login(): void {
    this.restService.post('login', this.userVo)
      .then(response => {
        this.restService.setToken(response.token);
        this.restService.setLoggedInUser(response.user);
        this.router.navigate(['/main']);
      });
  }

  private showLoginError(): void {
    this.messageService.add({detail: 'Hibás a form!', severity: 'error'});
  }

}
