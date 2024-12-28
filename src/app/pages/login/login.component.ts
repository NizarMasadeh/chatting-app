import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localStorage/localstorage.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {

  constructor(
    private _authService: AuthService,
    private localStorage: LocalstorageService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _messageService: MessageService
  ) { }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', (Validators.required, Validators.email)),
    password: new FormControl('', Validators.required)
  })

  registerForm: FormGroup = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  isLoggingIn = false;
  isRegistering = false;

  formToggle = false;

  onLogin() {
    if (this.loginForm.invalid) {
      console.error("Fill all the required stuff");

    } else {
      this.isLoggingIn = true;

      this._authService.onLogin(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.localStorage.setItem('userToken', res.token);
          this.localStorage.setItem('userName', res.user.fullName);
          this.localStorage.setItem('userEmail', res.user.email);
          this.localStorage.setItem('userId', res.user.id);

          this.isLoggingIn = false;

          this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Heyyyyyyyy'
          })
          setTimeout(() => {
            this._router.navigate(['/chat']);
          }, 1200);
        }, error: (error) => {
          console.error("Error logging in: ", error);
          this.isLoggingIn = false;
        }
      })
    }
  }

  onRegister() {
    if (this.registerForm.invalid) {
      console.error("Fill the form dude!");
    } else {
      const registerData = {
        ...this.registerForm.value,
        userType: 'Chat User'
      }

      this.isRegistering = true;

      this._authService.onRegister(registerData).subscribe({
        next: () => {
          this.isRegistering = false;
          this.registerForm.reset();
          this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account registered!'
          })
          setTimeout(() => {
            this.formToggle = false;
            this._cdr.detectChanges();
          }, 800);
        },
        error: (error) => {
          console.error("Error registering:", error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error creating account!'
          })
          this.isRegistering = false;
        }
      })
    }
  }

  onToggle() {
    if (!this.formToggle) {
      this.formToggle = false
    } else {
      this.formToggle = true;
    }
  }
}
