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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
})
export class HarmonicProgressionComponent implements OnInit {
  progression: ProgressionChord[] = [];
  progressionName: string = '';
  autoAddEnabled: boolean = true;
  isProgressionLoaded: boolean = false;
  isPlaying = false;
  currentChordIndex = -1;
  bpm = 120;
  private timeoutId: any;

  constructor(private audioService: AudioService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  addChord(chord: ProgressionChord) {
    this.progression.push(chord);
    this.isProgressionLoaded = false; // Modificação na progressão indica que não é mais a versão salva
  }

  removeChord(index: number) {
    this.progression.splice(index, 1);
    this.isProgressionLoaded = false; // Modificação na progressão indica que não é mais a versão salva
  }

  playProgression() {
    if (this.progression.length === 0) return;

    this.isPlaying = true;
    this.currentChordIndex = 0;

    const playNextChord = () => {
      if (!this.isPlaying) {
        this.stopProgression();
        return;
      }

      // Reinicia a progressão se chegar ao fim (loop)
      if (this.currentChordIndex >= this.progression.length) {
        this.currentChordIndex = 0;
      }

      const chord = this.progression[this.currentChordIndex];
      this.audioService.playChord(chord.notes);

      this.currentChordIndex++;
      // Calcula o intervalo a cada passo para permitir a mudança de BPM em tempo real
      const interval = (60 / this.bpm) * 1000;
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
    this.isProgressionLoaded = true; // A progressão agora está salva e "carregada"

    // Poderíamos adicionar um feedback para o usuário aqui, como um snackbar.
    console.log(`Progressão '${this.progressionName}' salva!`);
  }

  loadProgressionDialog() {
    const savedProgressions = JSON.parse(localStorage.getItem('harmonic_progressions') || '{}');
    const progressionNames = Object.keys(savedProgressions);

    const dialogRef = this.dialog.open(LoadProgressionDialogComponent, {
      width: '250px',
      data: { progressionNames: progressionNames },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.progressionName = result;
        this.progression = savedProgressions[result];
        this.isProgressionLoaded = true;
      }
    });
  }

  deleteProgression() {
    if (!this.progressionName) return;

    const savedProgressions = JSON.parse(localStorage.getItem('harmonic_progressions') || '{}');
    delete savedProgressions[this.progressionName];
    localStorage.setItem('harmonic_progressions', JSON.stringify(savedProgressions));

    // Limpa o estado atual
    this.progressionName = '';
    this.progression = [];
    this.isProgressionLoaded = false;
  }
}
