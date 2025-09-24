import { Component, OnInit, ViewChild } from '@angular/core';
import { MusicTheoryService, Chord } from './music-theory';
import { AudioService } from './audio.service';
import { HarmonicProgressionComponent, ProgressionChord } from './harmonic-progression/harmonic-progression.component';

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
  @ViewChild(HarmonicProgressionComponent) harmonicProgressionComponent!: HarmonicProgressionComponent;

  // State for Harmonic Field
  selectedNote: string = 'C';
  selectedMode: 'major' | 'minor' = 'major';
  useFlats: boolean = false;
  harmonicField: Chord[] = [];
  scaleNotes: string[] = [];
  scaleNotesWithDegrees: NoteWithDegree[] = [];

  selectedChordNotes: string[] = [];
  selectedChordName: string = '';
  isHarmonicFieldLocked: boolean = false;

  constructor(public musicTheoryService: MusicTheoryService, private audioService: AudioService) {}

  ngOnInit() {
    // O campo harmônico não será mais gerado automaticamente na inicialização
    // para permitir que o usuário defina a tonalidade primeiro.
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

  resetHarmonicField() {
    this.isHarmonicFieldLocked = false;
    this.harmonicField = [];
    this.scaleNotesWithDegrees = [];
    this.selectedChordName = '';
    this.selectedChordNotes = [];
  }

  // --- Chord Interaction Logic ---
  onChordGenerated(event: ProgressionChord) {
    this.selectedChordNotes = event.notes;
    this.selectedChordName = event.name;

    // Adiciona o acorde à lista de progressão
    if (this.harmonicProgressionComponent) {
      this.harmonicProgressionComponent.addChord(event);
    }
  }

  selectChordForPiano(chord: Chord) {
    this.selectedChordName = chord.name;
    const chordNotes = chord.notes.split(' - ');
    this.selectedChordNotes = chordNotes;
    this.playChord(chordNotes);

    // Adiciona o acorde à lista de progressão
    if (this.harmonicProgressionComponent) {
      this.harmonicProgressionComponent.addChord({ name: chord.name, notes: chordNotes });
    }
  }

  // --- Audio Logic ---
  playChord(notes: string[]) {
    this.audioService.playChord(notes);
  }

  playNote(note: string) {
    const parts = note.split('/');
    const noteName = parts[0];
    const octave = parts.length > 1 ? parseInt(parts[1], 10) : 4;
    this.audioService.playNote(noteName, octave);
  }
}
