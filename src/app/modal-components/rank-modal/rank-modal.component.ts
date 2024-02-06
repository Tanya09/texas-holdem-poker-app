import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaveCardsDataEvent } from '../../shared/models/cards-input-data';
import { PokerService } from '../../shared/services/poker.service';

@Component({
  selector: 'app-rank-modal',
  templateUrl: './rank-modal.component.html',
  styleUrls: ['./rank-modal.component.css']
})
export class RankModalComponent implements OnInit {
  saveCardsData = new EventEmitter<SaveCardsDataEvent>();

  playersData: any;
  communityCards: string[] = [];
  rankedPlayers: any[] = [];

  constructor(public dialogRef: MatDialogRef<RankModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pokerService: PokerService) { 

    this.playersData = data.players;
    this.communityCards = data.communityCards;
  }

  ngOnInit(): void {
    this.calculateRanks();
  }

  calculateRanks() {
     this.rankedPlayers = this.pokerService.calculateRanks(this.playersData, this.communityCards);
  }
  onClose() {
    // Close the modal
    this.dialogRef.close();
  }

}
