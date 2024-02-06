import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DynamicModalComponent } from '../../modal-components/dynamic-modal/dynamic-modal.component';
import { ModifyInputModalContentComponent } from '../../modal-components/modify-input-modal-content/modify-input-modal-content.component';
import { RankModalComponent } from '../../modal-components/rank-modal/rank-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  communityCards: string[] = []; 
  players = [];
  constructor(public dialog: MatDialog) {
   }

  ngOnInit(): void {
  }

  // Function that opens the modify/add input modal
  openModifyInputModal(): void {
    const modalData = {
      contentComponent: ModifyInputModalContentComponent,
      // Pass existing data to prepopulate the modal
      existingData: {
        community: this.communityCards,
        player: this.players
      }
    };
  
    //opens matDialog with dynamic modal component that loads the modify input modal content
    const dialogRef = this.dialog.open(DynamicModalComponent, {
      width: '50rem',
      height: '40rem',
      data: modalData
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result && result.cardsData) {
          // subscribing to data emitted from the modify input modal to set data objects for dashboard
          this.communityCards = result.cardsData.community;
          this.players = result.cardsData.player;
        }
    });
  }

  // Function that opens the player ranking modal
  openRankModal(): void {

      // opens matDialog with dynamic modal component that loads the player ranking modal content
      const dialogRef = this.dialog.open(DynamicModalComponent, {
      width: '50rem',
      height: '40rem',
      // passes appropriate data needed for rank calculation
      data: {        
        contentComponent: RankModalComponent,
        players: this.players,
        communityCards: this.communityCards 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // Handle any result or close actions if needed
    });
  }

  exit() {
    // Implement exit functionality
    this.communityCards = [];
    this.players = [];
  }

}
