import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SaveCardsDataEvent } from '../../shared/models/cards-input-data';

@Component({
  selector: 'app-modify-input-modal-content',
  templateUrl: './modify-input-modal-content.component.html',
  styleUrls: ['./modify-input-modal-content.component.css']
})
export class ModifyInputModalContentComponent implements OnInit {
  @Output() saveCardsData = new EventEmitter<SaveCardsDataEvent>();
  communityCardsForm!: FormGroup;
  playerCardsForm!: FormGroup;
  cardValues: string[] = [];
  suits: string[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService, public dialogRef: MatDialogRef<ModifyInputModalContentComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.cardValues = dataService.cardValues;
    this.suits = dataService.suits;
    // Check if there is existing data and prepopulate the forms
    if (data && data.existingData) {
      this.initializeForms(data.existingData);
    } else {
      this.initializeForms();
    }
  }

  ngOnInit(): void {
  }

  initializeForms(existingData?: any): void {
    this.communityCardsForm = this.fb.group({
      card1: this.createCardFormGroup(existingData?.community[0]),
      card2: this.createCardFormGroup(existingData?.community[1]),
      card3: this.createCardFormGroup(existingData?.community[2]),
      card4: this.createCardFormGroup(existingData?.community[3]),
      card5: this.createCardFormGroup(existingData?.community[4]),
    });
  
    this.playerCardsForm = this.fb.group({
      player: this.fb.array([])
    });
  
    if (existingData) {
      const playerArray = this.playerCardsForm.get('player') as any;
      for (const player of existingData.player) {
        const playerGroup = this.fb.group({
          name: player.name,
          card1: this.createCardFormGroup(player.cards[0]),
          card2: this.createCardFormGroup(player.cards[1]),
        });
        playerArray.push(playerGroup);
      }
    }
  }
  
  private createCardFormGroup(cardData?: string): FormGroup {
    return this.fb.group({
      value: [cardData ? cardData.slice(0, -1) : '', Validators.required],
      suit: [cardData ? cardData.slice(-1) : '', Validators.required]
    });
  }
  

  addPlayer() {
    const playerArray = this.playerCardsForm.get('player') as any;
    playerArray.push(
      this.fb.group({
        name: ['', Validators.required],
        card1: this.fb.group({
          value: ['', Validators.required],
          suit: ['', Validators.required]
        }),
        card2: this.fb.group({
          value: ['', Validators.required],
          suit: ['', Validators.required]
        })
      })
    );
  }

  removePlayer(index: number) {
    const playerArray = this.playerCardsForm.get('player') as any;
    playerArray.removeAt(index);
  }

  private getCommunityCards() {
    const cards = [];
    for (let i = 1; i <= 5; i++) {
      const cardGroup = this.communityCardsForm.get(`card${i}`) as any;
      const value = cardGroup.get('value').value;
      const suit = cardGroup.get('suit').value;
      cards.push(`${value.toUpperCase()}${suit}`);
    }
    return cards;
  }

  private getPlayerData() {
    const playerData = [];
    const playerArray = this.playerCardsForm.get('player') as any;
    for (const playerGroup of playerArray.controls) {
      const personData = {
        name: playerGroup.get('name').value,
        cards: [
          `${playerGroup.get('card1.value').value.toUpperCase()}${playerGroup.get('card1.suit').value}`,
          `${playerGroup.get('card2.value').value.toUpperCase()}${playerGroup.get('card2.suit').value}`
        ]
      };
      playerData.push(personData);
    }
    return playerData;
  }
  onSave() {

    const data: SaveCardsDataEvent = {
      community: this.getCommunityCards(),
      player: this.getPlayerData()
    };
    this.saveCardsData.emit(data);
    this.dialogRef.close();
  }


}
