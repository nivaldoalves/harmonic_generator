import { Component, OnInit } from '@angular/core';
import { MusicTheoryService, Chord } from './music-theory';
import { StorageService } from './storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class App implements OnInit {
  // Static data
  notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

  // State for Harmonic Field
  selectedNote: string = 'C';
  selectedMode: 'major' | 'minor' = 'major';
  harmonicField: Chord[] = [];

  // State for Current Progression
  progressionLength: number = 4;
  progression: Chord[] = [];
  selectedChordNotes: string[] = [];

  // State for Saved Progressions
  savedProgressions: Chord[][] = [];

  constructor(
    private musicTheoryService: MusicTheoryService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.savedProgressions = this.storageService.getSavedProgressions();
    this.generateHarmonicField();
  }

  // --- Harmonic Field Logic ---
  generateHarmonicField() {
    const rootNote = this.selectedNote.split('/')[0];
    this.harmonicField = this.musicTheoryService.generateHarmonicField(rootNote, this.selectedMode);
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
  }

  // --- Saved Progressions Logic ---
  saveCurrentProgression() {
    this.savedProgressions = this.storageService.saveProgression(this.progression);
  }

  deleteSavedProgression(index: number) {
    this.savedProgressions = this.storageService.deleteProgression(index);
  }

  // --- Piano Logic ---
  selectChordForPiano(chord: Chord) {
    const notes = chord.notes.split(' - ');
    const allNotes: string[] = [];
    notes.forEach(note => {
      const variants = note.split('/');
      allNotes.push(...variants);
    });
    this.selectedChordNotes = allNotes;
  }

  // --- Utility --- 
  // This is for the template to be able to show the saved progression chords
  formatProgression(prog: Chord[]): string {
    return prog.map(c => c.name).join(' - ');
  }
}