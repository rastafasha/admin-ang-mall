import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css'],
    standalone: false
})
export class LoadingComponent {
    @Input() loadingTitle!: string;
    constructor() {}
}
