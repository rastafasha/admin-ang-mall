import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {

  public formSumitted = false;
  currentStep = 1;

  registerForm:FormGroup;




  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      email: [ '', [Validators.required, Validators.email, Validators.minLength(3)] ],
      password: ['', [Validators.required, Validators.minLength(3)]],
      password2: ['', [Validators.required, Validators.minLength(3)]],
      terminos: [false, Validators.required],

    }, {
      validators: this.passwordsIguales('password', 'password2')

    });

  }




  ngOnInit(): void {
  }

  crearUsuario(){
    if (this.currentStep !== 2) {
      return;
    }

    this.formSumitted = true;
    console.log(this.registerForm.value);

    if(this.registerForm.invalid){
      return;
    }

    //realizar el posteo del usuario
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      resp =>{
        console.log(resp);
        this.router.navigateByUrl('/login');
      },(err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );

  }


  campoNoValido(campo: string): boolean {
    if(this.registerForm.get(campo).invalid && this.formSumitted){
      return true;
    }else{
      return false;
    }


  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSumitted;
  }

  passwordNoValido(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if((pass1 !== pass2) && this.formSumitted){
      return true;
    }else{
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string){
    return (formGroup: FormGroup) =>{
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null)
      }else{
        pass2Control.setErrors({noEsIgual: true});
      }
    }
  }

  nextStep() {
    if (this.isStep1Valid()) {
      this.currentStep = 2;
    } else {
      this.formSumitted = true;
    }
  }

  prevStep() {
    this.currentStep = 1;
  }

  isStep1Valid(): boolean {
    const firstName = this.registerForm.get('first_name');
    const lastName = this.registerForm.get('last_name');
    return firstName.valid && lastName.valid;
  }

}
