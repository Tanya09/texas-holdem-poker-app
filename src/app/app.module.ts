import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; 

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard-components/dashboard/dashboard.component';
import { CommunityTableComponent } from './dashboard-components/community-table/community-table.component';
import { PlayerZoneComponent } from './dashboard-components/player-zone/player-zone.component';
import { DynamicModalComponent } from './modal-components/dynamic-modal/dynamic-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ModifyInputModalContentComponent } from './modal-components/modify-input-modal-content/modify-input-modal-content.component';
import { RankModalComponent } from './modal-components/rank-modal/rank-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CommunityTableComponent,
    PlayerZoneComponent,
    DynamicModalComponent,
    ModifyInputModalContentComponent,
    RankModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,  
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
