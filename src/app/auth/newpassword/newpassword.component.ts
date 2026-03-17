import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AccountService } from 'src/app/services/account.service';
@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css']
})
export class NewpasswordComponent implements OnInit {

  errors:any = null;

  public formSumitted = false;

  public passwordForm = {

    email: null,
    password: null,
    password2: null,
    resetToken: null,
  };

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private accountService: AccountService,
  ) {

    activatedRouter.queryParams.subscribe(params =>{
      this.passwordForm.resetToken = params['token']
    })
  }

  ngOnInit(): void {
  }


passwordNoValido(){
  // const pass1 = this.passwordForm.get('password').value;
  // const pass2 = this.passwordForm.get('password2').value;

  // if((pass1 !== pass2) && this.formSumitted){
  //   return true;
  // }else{
  //   return false;
  // }
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

newPassword(){

  this.accountService.changePassword(this.passwordForm).subscribe(
    resp =>{

      Swal.fire('Exito!', `Contraseña Actualizada`, 'success');
      // this.passwordForm.reset();
      this.router.navigateByUrl('/login');

    },(error) => {
      Swal.fire('Error', error.error.message, 'error');
      this.errors = error.error.message;
    }
    )
    // console.log(this.user)
    return false;
}

}
