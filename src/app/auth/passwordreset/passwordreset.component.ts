import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-passwordreset',
  standalone:false,
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {
  email = new FormControl();

  submitted = false;
  errors:any = null;

  public formSumitted = false;
  public resetpaswordForm = this.fb.group({
    email: [ null, [Validators.required] ],
    // terminos: [false, Validators.required],

  });

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit(): void {

  }

  resetPassword(){

  this.accountService.forgotPassword(this.resetpaswordForm.value).subscribe(
    resp =>{
      console.log(resp);
      Swal.fire('Exito!', `Favor revisa tu Correo`, 'success');
    },(error) => {
      Swal.fire('Error', error.error.message, 'error');
      this.errors = error.error.message;
    }
    )
    // console.log(this.user)
    return false;
}

}
