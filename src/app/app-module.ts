import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { App } from './app';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PianoComponent } from './piano/piano';
import { AudioService } from './audio.service';
import { ChordGenerator } from './chord-generator/chord-generator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { HarmonicProgressionComponent } from './harmonic-progression/harmonic-progression.component';
import { LoadProgressionDialogComponent } from './load-progression-dialog/load-progression-dialog.component';


@NgModule({
  declarations: [
    App,
    PianoComponent,
    ChordGenerator
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSliderModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
    HarmonicProgressionComponent, // Moved here
    LoadProgressionDialogComponent // Moved here
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    AudioService
  ],
  bootstrap: [App]
})
export class AppModule { }