import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-player-zone',
  templateUrl: './player-zone.component.html',
  styleUrls: ['./player-zone.component.css']
})
export class PlayerZoneComponent implements OnInit {
  @Input() players: any = [];

  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['players'] && changes['players'].currentValue) {
      console.log('Community Cards Updated:', changes['players'].currentValue);
    }
  }

}
