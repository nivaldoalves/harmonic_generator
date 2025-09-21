import { Component, OnInit } from '@angular/core';
import { MusicTheoryService, Chord } from './music-theory';
import { StorageService } from './storage';
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

  // State for Current Progression
  progressionLength: number = 4;
  progression: Chord[] = [];
  selectedChordNotes: string[] = [];
  selectedChordName: string = '';

  // State for Saved Progressions
  savedProgressions: Chord[][] = [];

  // Playback State
  isPlaying = false;
  playbackInterval: any;
  currentChordIndex = 0;

  constructor(
    public musicTheoryService: MusicTheoryService,
    private storageService: StorageService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.savedProgressions = this.storageService.getSavedProgressions();
    this.generateHarmonicField();
  }

  get notes(): string[] {
    return this.useFlats
      ? this.musicTheoryService.notesFlat
      : this.musicTheoryService.notesSharp;
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
      displayName: note.split('/')[0]
    }));
    this.clearCurrentProgression();
  }

  // --- Current Progression Logic ---
  generateRandomProgression() {
    if (this.harmonicField.length === 0) return;
    const newProgression: Chord[] = [];
    for (let i = 0; i < this.progressionLength; i++) {
      const randomIndex = Math.floor(Math.random() * this.harmonicField.length);
      newProgression.push(this.harmonicField[randomIndex]);
    }
    this.progression = newProgression;
  }

  clearCurrentProgression() {
    this.progression = [];
    this.selectedChordNotes = [];
    this.stopProgression();
  }

  // --- Saved Progressions Logic ---
  saveCurrentProgression() {
    this.savedProgressions = this.storageService.saveProgression(
      this.progression
    );
  }

  deleteSavedProgression(index: number) {
    this.savedProgressions = this.storageService.deleteProgression(index);
  }

  // --- Piano Logic ---
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

  playProgression() {
    if (this.progression.length === 0) return;

    this.isPlaying = true;
    this.currentChordIndex = 0;

    const playNextChord = () => {
      if (this.currentChordIndex < this.progression.length) {
        const chord = this.progression[this.currentChordIndex];
        this.selectChordForPiano(chord);
        this.currentChordIndex++;
      } else {
        this.stopProgression();
      }
    };

    this.playbackInterval = setInterval(playNextChord, 1000); // Play subsequent chords every second
  }

  stopProgression() {
    this.isPlaying = false;
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  // --- Utility ---
  // This is for the template to be able to show the saved progression chords
  formatProgression(prog: Chord[]): string {
    return prog.map((c) => c.name).join(' - ');
  }
}