import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Driver } from 'src/app/models/driverp.model';
import { Usuario } from 'src/app/models/usuario.model';
import { DriverpService } from 'src/app/services/driverp.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

// Initialize with empty object to prevent undefined errors
const defaultDriver: Driver = {
  user: {} as Usuario,
  tipo_vehiculo: '',
  placa: '',
  color: '',
  year: '',
  marca: '',
  modelo: '',
  asignaciones: {} as any,
  status: '',
  licencianum: '',
  img: ''
};

@Component({
  selector: 'app-driverp-edit',
  standalone:false,
  templateUrl: './driverp-edit.component.html',
  styleUrls: ['./driverp-edit.component.css']
})
export class DriverpEditComponent implements OnInit {

  @Input() usertiendaSeleccionado: any;

  public driverProfileForm: FormGroup;
  public usuario: Usuario;
  public driver: Driver;
  public driverSeleccionado: Driver | null = null;
  public imagenSubir: File;
  public imgTemp: any = null;
  uid: string;
  pageTitle: string;
  cargando = false;
  cargandoImagen = false;

  user: any = [];
  user_id: any;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverpService,
    private fileUploadService: FileUploadService
  ) {
  }

  ngOnInit(): void {
    console.log('user: ', this.usertiendaSeleccionado);
    
    this.validarFormulario();
    this.getDriverProfile();
  }

  getDriverProfile() {
  if (!this.usertiendaSeleccionado || !this.usertiendaSeleccionado.uid) return;

  this.driverService.getByUserId(this.usertiendaSeleccionado.uid).subscribe({
    next: (resp: any) => {
      // 🚀 CAPTURAMOS LA RESPUESTA REAL DEL BACKEND
      // Nota: Revisa si tu API devuelve el objeto directo o dentro de un campo (ej: resp.driver)
      const driver = resp.driver || resp; 
      this.driverSeleccionado = driver;
      
      console.log('driver recuperado con éxito: ', this.driverSeleccionado);

      if (this.driverSeleccionado && this.driverSeleccionado._id) {
        this.pageTitle = 'Editando Driver';

        // 📝 RELLENAMOS EL FORMULARIO EN TIEMPO REAL
        // Usamos patchValue en lugar de setValue por seguridad, por si falta algún campo en la DB
        this.driverProfileForm.patchValue({
          marca: driver.marca || '',
          modelo: driver.modelo || '',
          color: driver.color || '',
          year: driver.year || '',
          tipo_vehiculo: driver.tipo_vehiculo || 'MOTO', // Tu segmentación hermosa de vehículos
          placa: driver.placa || '',
          licencianum: driver.licencianum || '',
          status: driver.status || 'ACTIVE',
          user: driver.user?._id || driver.user || this.usertiendaSeleccionado.uid,
        });

      } else {
        this.pageTitle = 'Creando Driver';
      }
    },
    error: (err) => {
      console.error('Error al obtener el perfil del conductor:', err);
      this.pageTitle = 'Creando Driver';
    }
  });
}


  validarFormulario() {
    this.driverProfileForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: [''],
      year: ['', Validators.required],
      tipo_vehiculo: ['', Validators.required],
      placa: ['', Validators.required],
      licencianum: ['', Validators.required],
      asignaciones: [''],
      status: ['PENDING'],
      user: [this.usertiendaSeleccionado?.uid || ''],
    });
  }


  
  onSubmit() {
    if (!this.driverProfileForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.driverProfileForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    if (this.driverSeleccionado) {
      //actualizar
      const data = {
        ...this.driverProfileForm.value,
        _id: this.driverSeleccionado._id,
      };
      this.driverService.actualizar(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `Actualizado correctamente`, 'success');
        }
      );
    } else {
      //crear
      const data = {
        ...this.driverProfileForm.value,
      };
      this.driverService.create(data)
        .subscribe((resp: any) => {
          this.driverSeleccionado = resp.driver;
          console.log(resp)
          Swal.fire('Creado', `Creado correctamente`, 'success');
          this.ngOnInit();
        });
    }
  }



  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.cargandoImagen = true;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'drivers', this.driverSeleccionado._id)
      .then(img => {
        this.usuario.img = img;
        this.cargandoImagen = false;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');
      }).catch(err => {
        this.cargandoImagen = false;
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })
  }

}
