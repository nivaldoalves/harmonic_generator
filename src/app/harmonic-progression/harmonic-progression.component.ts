import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AudioService } from '../audio.service';
import { Chord, MusicTheoryService } from '../music-theory';
import { LoadProgressionDialogComponent } from '../load-progression-dialog/load-progression-dialog.component';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

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
  autoAddEnabled: boolean = false;
  isProgressionLoaded: boolean = false;
  isPlaying = false;
  currentChordIndex = -1;
  bpm = 120;
  @Output() chordPlayedInProgression = new EventEmitter<string[]>(); // Novo EventEmitter
  private timeoutId: any;

  constructor(private audioService: AudioService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  openHelpDialog(title: string, content: string): void {
    this.dialog.open(HelpDialogComponent, {
      width: '400px',
      data: { title, content },
    });
  }

  addChord(chord: ProgressionChord) {
    this.progression.push(chord);
    this.isProgressionLoaded = false; // Modificação na progressão indica que não é mais a versão salva
  }

  removeChord(index: number) {
    this.progression.splice(index, 1);
    this.isProgressionLoaded = false; // Modificação na progressão indica que não é mais a versão salva
  }

  clearProgression() {
    this.progression = [];
    this.progressionName = '';
    this.isProgressionLoaded = false;
  }

  playSingleChord(chord: ProgressionChord) {
    this.audioService.playChord(chord.notes);
    this.chordPlayedInProgression.emit(chord.notes);
  }

  playProgression() {
    if (this.progression.length === 0) return;

    this.bpm = 60; // Define o BPM para 80 ao iniciar a reprodução
    this.isPlaying = true;
    this.currentChordIndex = 0;
    let nextChordIndex = 0;

    const playNextChord = () => {
      if (!this.isPlaying) {
        this.stopProgression();
        return;
      }

      // Atualiza o índice do acorde que está tocando *agora*
      this.currentChordIndex = nextChordIndex % this.progression.length;

      const chord = this.progression[this.currentChordIndex];
      this.chordPlayedInProgression.emit(chord.notes); // Emite as notas para o piano
      this.audioService.playChord(chord.notes);

      // Prepara o índice para o *próximo* acorde
      nextChordIndex = this.currentChordIndex + 1;

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
    this.chordPlayedInProgression.emit([]); // Limpa o destaque do piano ao parar
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
