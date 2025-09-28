import { Component, OnInit, ViewChild } from '@angular/core';
import { MusicTheoryService, Chord } from './music-theory';
import { AudioService } from './audio.service';
import {
  HarmonicProgressionComponent,
  ProgressionChord,
} from './harmonic-progression/harmonic-progression.component';
import { PianoComponent } from './piano/piano'; // Importar PianoComponent para ViewChild
import { MatDialog } from '@angular/material/dialog';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';

interface NoteWithDegree {
  note: string;
  degree: string;
  displayName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss'],
})
export class App implements OnInit {
  @ViewChild(HarmonicProgressionComponent)
  harmonicProgressionComponent!: HarmonicProgressionComponent;
  @ViewChild(PianoComponent) pianoComponent!: PianoComponent; // Adicionar ViewChild para PianoComponent

  // State for Harmonic Field
  selectedNote: string = 'C';
  selectedMode: 'major' | 'minor' = 'major';
  useFlats: boolean = false;
  harmonicField: Chord[] = [];
  scaleNotes: string[] = [];
  scaleNotesWithDegrees: NoteWithDegree[] = [];

  selectedChordName: string = '';
  isHarmonicFieldLocked: boolean = false;

  currentPianoHighlightNotes: string[] = []; // Nova propriedade para controlar o destaque do piano

  currentYear: number = new Date().getFullYear(); // Adicionar propriedade para o ano atual

  constructor(public musicTheoryService: MusicTheoryService, private audioService: AudioService, public dialog: MatDialog) {}

  ngOnInit() {
    // O campo harmônico não será mais gerado automaticamente na inicialização
    // para permitir que o usuário defina a tonalidade primeiro.
  }

  openHelpDialog(title: string, content: string): void {
    this.dialog.open(HelpDialogComponent, {
      width: '400px',
      data: { title, content },
    });
  }

  get notes(): string[] {
    return this.useFlats ? this.musicTheoryService.notesFlat : this.musicTheoryService.notesSharp;
  }

  onAccidentalChange() {
    if (!this.notes.includes(this.selectedNote)) {
      this.selectedNote = 'C';
    }
    this.generateHarmonicField();
  }

  // --- Harmonic Field Logic ---
  generateHarmonicField() {
    const rootNote = this.selectedNote.split('/')[0];
    this.harmonicField = this.musicTheoryService.generateHarmonicField(
      rootNote,
      this.selectedMode,
      this.useFlats
    );
    this.scaleNotes = this.musicTheoryService.getScaleNotes(
      rootNote,
      this.selectedMode,
      this.useFlats
    );
    const degrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
    this.scaleNotesWithDegrees = this.scaleNotes.map((note, index) => ({
      note,
      degree: degrees[index],
      displayName: note.split('/')[0],
    }));
    this.isHarmonicFieldLocked = true;
  }

  resetApp() {
    this.selectedNote = 'C';
    this.selectedMode = 'major';
    this.useFlats = false;
    this.resetHarmonicField();
    if (this.harmonicProgressionComponent) {
      this.harmonicProgressionComponent.clearProgression();
    }
  }

  resetHarmonicField() {
    this.isHarmonicFieldLocked = false;
    this.harmonicField = [];
    this.scaleNotesWithDegrees = [];
    this.selectedChordName = '';
    this.currentPianoHighlightNotes = []; // Limpa o destaque do piano ao resetar o campo harmônico
  }

  // --- Chord Interaction Logic ---
  onChordGenerated(event: ProgressionChord) {
    // Quando um acorde é gerado (ex: do ChordGenerator), atualiza o destaque do piano
    this.currentPianoHighlightNotes = event.notes;
    this.selectedChordName = event.name;

    // Adiciona o acorde à lista de progressão somente se a chave estiver ligada
    if (this.harmonicProgressionComponent && this.harmonicProgressionComponent.autoAddEnabled) {
      this.harmonicProgressionComponent.addChord(event);
    }
  }

  selectChordForPiano(chord: Chord) {
    this.selectedChordName = chord.name;
    const chordNotes = chord.notes.split(' - ');
    // Quando um acorde é selecionado do campo harmônico, atualiza o destaque do piano
    this.currentPianoHighlightNotes = chordNotes;
    this.playChord(chordNotes);

    // Adiciona o acorde à lista de progressão somente se a chave estiver ligada
    if (this.harmonicProgressionComponent && this.harmonicProgressionComponent.autoAddEnabled) {
      this.harmonicProgressionComponent.addChord({ name: chord.name, notes: chordNotes });
    }
  }

  // --- Audio Logic ---
  playChord(notes: string[]) {
    // Este método é chamado ao tocar um único acorde, então atualiza o destaque do piano
    this.currentPianoHighlightNotes = notes;
    this.audioService.playChord(notes);
  }

  playNote(note: string) {
    const parts = note.split('/');
    const noteName = parts[0];
    const octave = parts.length > 1 ? parseInt(parts[1], 10) : 4;
    this.audioService.playNote(noteName, octave);
    // Ao tocar uma única nota, atualiza o destaque do piano
    this.currentPianoHighlightNotes = [note];
  }

  // Novo método para lidar com acordes tocados pelo HarmonicProgressionComponent
  onChordPlayedInProgression(notes: string[]) {
    this.currentPianoHighlightNotes = notes;
  }
}