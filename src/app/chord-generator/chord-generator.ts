import { Component, EventEmitter, Output } from '@angular/core';
import { MusicTheoryService, Chord } from '../music-theory';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-chord-generator',
  standalone: false,
  templateUrl: './chord-generator.html',
  styleUrls: ['./chord-generator.scss']
})
export class ChordGenerator {
  @Output() chordGenerated = new EventEmitter<string[]>();

  notes: string[];
  chordTypes = [
    { name: 'Maior', value: 'major' },
    { name: 'Menor', value: 'minor' },
    { name: 'Aumentado', value: 'augmented' },
    { name: 'Diminuto', value: 'diminished' },
    { name: 'Suspenso (sus2)', value: 'sus2' },
    { name: 'Suspenso (sus4)', value: 'sus4' },
    { name: 'Sétima Dominante', value: 'dominant-seventh' },
    { name: 'Sétima Maior', value: 'major-seventh' },
    { name: 'Sétima Menor', value: 'minor-seventh' },
  ];
  inversions = [
    { name: 'Fundamental', value: 0 },
    { name: '1ª Inversão', value: 1 },
    { name: '2ª Inversão', value: 2 },
    { name: '3ª Inversão', value: 3 },
  ];

  selectedRoot: string = 'C';
  selectedChordType: string = 'major';
  selectedInversion: number = 0;

  constructor(
    private musicTheoryService: MusicTheoryService,
    private audioService: AudioService
  ) {
    this.notes = this.musicTheoryService.notesSharp;
  }

  generateAndPlayChord() {
    const chordNotes = this.musicTheoryService.getChordNotes(
      this.selectedRoot,
      this.selectedChordType,
      this.selectedInversion
    );

    if (chordNotes) {
      this.audioService.playChord(chordNotes);
      this.chordGenerated.emit(chordNotes);
    }
  }
}