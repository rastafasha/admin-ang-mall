import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter,   map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy,  OnInit {

  public tituloPage: string;
  public tituloSub$: Subscription;

  constructor(
    private router: Router
    ) {

    this.tituloSub$ = this.getArgumentosRuta().subscribe(({tituloPage})=>{ //muestra la info
      this.tituloPage = tituloPage;
      document.title = `Admin-Pro | ${tituloPage}`;
    });

  }

  ngOnDestroy(){
    this.tituloSub$.unsubscribe();//limpia la info de argumentos al salir de la app
  }

  getArgumentosRuta(){
  return this.router.events
    .pipe(
      filter( (event: any) => event instanceof ActivationEnd ),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
      map( (event: ActivationEnd) => event.snapshot.data),
    )
  }

  ngOnInit(): void {
  }

}
