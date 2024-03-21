import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import{Slider } from '../models/slider.model';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class SliderService {


  constructor(
    private http: HttpClient
  ) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }


  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }


  getSliders(){

    const url = `${base_url}/sliders`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, sliders: Slider[]}) => resp.sliders)
      )

  }


  getSliderById(_id: string){
    const url = `${base_url}/sliders/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, slider: Slider}) => resp.slider)
        );

  }


  crearSlider(slider: Slider){
    const url = `${base_url}/sliders`;
    return this.http.post(url, slider, this.headers);
  }

  actualizarSlider(slider: Slider){
    const url = `${base_url}/sliders/${slider._id}`;
    return this.http.put(url, slider, this.headers);
  }

  borrarSlider(_id:string){
    const url = `${base_url}/sliders/${_id}`;
    return this.http.delete(url, this.headers);
  }



}
