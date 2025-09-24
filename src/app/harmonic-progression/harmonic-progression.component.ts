import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AudioService } from '../audio.service';
import { Chord, MusicTheoryService } from '../music-theory';
import { LoadProgressionDialogComponent } from '../load-progression-dialog/load-progression-dialog.component';

// Importações para Standalone Component
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Interface para representar um acorde salvo na progressão
export interface ProgressionChord {
  name: string;
  notes: string[];
}

@Component({
  selector: 'app-harmonic-progression',
  templateUrl: './harmonic-progression.html',
  styleUrls: ['./harmonic-progression.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class HarmonicProgressionComponent implements OnInit {

  progression: ProgressionChord[] = [];
  progressionName: string = '';
  isPlaying = false;
  currentChordIndex = -1;
  bpm = 120;
  private timeoutId: any;

  constructor(
    private audioService: AudioService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  addChord(chord: ProgressionChord) {
    this.progression.push(chord);
  }

  removeChord(index: number) {
    this.progression.splice(index, 1);
  }

  playProgression() {
    if (this.progression.length === 0) return;

    this.isPlaying = true;
    this.currentChordIndex = 0;
    const interval = (60 / this.bpm) * 1000; // Converte BPM para milissegundos

    const playNextChord = () => {
      if (!this.isPlaying || this.currentChordIndex >= this.progression.length) {
        this.stopProgression();
        return;
      }

      const chord = this.progression[this.currentChordIndex];
      this.audioService.playChord(chord.notes);

      this.currentChordIndex++;
      this.timeoutId = setTimeout(playNextChord, interval);
    };

    playNextChord();
  }

  stopProgression() {
    this.isPlaying = false;
    this.currentChordIndex = -1;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // O AudioService não tem um método stop, então apenas paramos o loop.
  }

  saveProgression() {
    if (!this.progressionName || this.progression.length === 0) return;

    const savedProgressions = JSON.parse(localStorage.getItem('harmonic_progressions') || '{}');
    savedProgressions[this.progressionName] = this.progression;
    localStorage.setItem('harmonic_progressions', JSON.stringify(savedProgressions));

    // Poderíamos adicionar um feedback para o usuário aqui, como um snackbar.
    console.log(`Progressão '${this.progressionName}' salva!`);
  }

  loadProgressionDialog() {
    const savedProgressions = JSON.parse(localStorage.getItem('harmonic_progressions') || '{}');
    const progressionNames = Object.keys(savedProgressions);

    const dialogRef = this.dialog.open(LoadProgressionDialogComponent, {
      width: '250px',
      data: { progressionNames: progressionNames }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.progressionName = result;
        this.progression = savedProgressions[result];
      }
    });
  }
}
