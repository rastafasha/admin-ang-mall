import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-install-pwa',
  templateUrl: './install-pwa.component.html',
  styleUrls: ['./install-pwa.component.css']
})
export class InstallPwaComponent implements OnInit {

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.closeMenu();
  }

}
