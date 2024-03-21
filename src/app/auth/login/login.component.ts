import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

declare const gapi: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSumitted = false;
  public auth2: any;

  loginForm: FormGroup;



  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

ngOnInit(){
  this.renderButton();
  this.usuarioService.getLocalStorage();
}

  login(){

    this.usuarioService.login(this.loginForm.value).subscribe(
      resp =>{
        if(this.loginForm.get('remember').value){
          localStorage.setItem('email', this.loginForm.get('email').value);
        }else{
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/dashboard');
      },(err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    )

  }



  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();
  }

  async startApp(){
    this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) =>{
          const id_token = googleUser.getAuthResponse().id_token;

          this.usuarioService.loginGoogle(id_token).subscribe(
            resp=>{

              this.ngZone.run(()=>{
                this.router.navigateByUrl('/dashboard');
              })
            }
          );


        }, (error) =>{
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
