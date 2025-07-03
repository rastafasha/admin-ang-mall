import { Injectable } from '@angular/core';

interface Grafico {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class GraficoService {

  constructor() { }


  private data: Grafico[]  = [
  {
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "France",
    "value": 7200000
  },
    {
    "name": "UK",
    "value": 6200000
  }
];

  getgraficoData(){
    return this.data;
  }

  randomData(){
      this.data = [
  {
    "name": "Germany",
    "value": Math.random() * 1000000
  },
  {
    "name": "USA",
    "value": Math.random() * 1000000
  },
  {
    "name": "France",
    "value": Math.random() * 1000000
  },
    {
    "name": "UK",
    "value": Math.random() * 1000000
  }
]
  }
}
