import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-community-table',
  templateUrl: './community-table.component.html',
  styleUrls: ['./community-table.component.css']
})
export class CommunityTableComponent implements OnInit {
  @Input() communityCards: string[] = [];

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['communityCards'] && changes['communityCards'].currentValue) {
      console.log('Community Cards Updated:', changes['communityCards'].currentValue);
    }
  }

}
