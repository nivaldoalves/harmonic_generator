import { Component, OnInit } from '@angular/core';
import { MusicTheoryService, Chord } from './music-theory';
import { AudioService } from './audio.service';

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
  // State for Harmonic Field
  selectedNote: string = 'C';
  selectedMode: 'major' | 'minor' = 'major';
  useFlats: boolean = false;
  harmonicField: Chord[] = [];
  scaleNotes: string[] = [];
  scaleNotesWithDegrees: NoteWithDegree[] = [];

  selectedChordNotes: string[] = [];
  selectedChordName: string = '';

  constructor(public musicTheoryService: MusicTheoryService, private audioService: AudioService) {}

  ngOnInit() {
    this.generateHarmonicField();
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
  }

  // --- Harmonic Field Logic ---
  onChordGenerated(event: { name: string; notes: string[] }) {
    this.selectedChordNotes = event.notes;
    this.selectedChordName = event.name;
  }

  selectChordForPiano(chord: Chord) {
    this.selectedChordName = chord.name;
    this.selectedChordNotes = chord.notes.split(' - ');
    this.playChord(chord);
  }

  // --- Audio Logic ---
  playChord(chord: Chord) {
    const notes = chord.notes.split(' - ');
    this.audioService.playChord(notes);
  }

  playNote(note: string) {
    const parts = note.split('/');
    const noteName = parts[0];
    const octave = parts.length > 1 ? parseInt(parts[1], 10) : 4;
    this.audioService.playNote(noteName, octave);
  }
}
