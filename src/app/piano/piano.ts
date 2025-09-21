import { Component, Input, OnChanges } from '@angular/core';
import { AudioService } from '../audio.service';

// Interface for a single piano key
export interface PianoKey {
  name: string;       // e.g., 'C', 'C#'
  altName?: string;    // e.g., 'D♭'
  displayName: string; // The name to be displayed on the key
  type: 'white' | 'black';
  x: number;          // X position for SVG rendering
  width: number;
  isHighlighted: boolean;
  octave: number; // Add octave property
}

@Component({
  selector: 'app-piano',
  templateUrl: './piano.html',
  standalone: false,
  styleUrls: ['./piano.scss']
})
export class PianoComponent implements OnChanges {
  // Input property to receive notes from the parent component
  @Input() notesToHighlight: string[] = [];
  @Input() useFlats: boolean = false;

  // Array representing the piano keys for one octave
  keys: PianoKey[] = [];
  
  // SVG viewbox dimensions
  viewBoxWidth = 490; // Adjusted for 14 white keys (2 octaves)
  viewBoxHeight = 120;

  private readonly sharpToFlat: { [key: string]: string } = {
    'C#': 'D♭', 'D#': 'E♭', 'F#': 'G♭', 'G#': 'A♭', 'A#': 'B♭'
  };

  constructor(private audioService: AudioService) {
    this.buildPianoKeys();
  }

  // This lifecycle hook detects when the input property changes
  ngOnChanges() {
    this.updateKeyNames();
    this.updateHighlightedKeys();
  }

  onKeyClick(key: PianoKey) {
    this.audioService.playNote(key.name, key.octave);
  }

  private buildPianoKeys() {
    const whiteKeyWidth = 35;
    const blackKeyWidth = 20;
    const keySpacing = 1; // Spacing between keys
    const whiteKeyNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeyNotes: { [key: string]: string } = { 'C': 'C#', 'D': 'D#', 'F': 'F#', 'G': 'G#', 'A': 'A#' };

    for (let octave = 0; octave < 2; octave++) {
      // Create white keys
      for (let i = 0; i < whiteKeyNotes.length; i++) {
        this.keys.push({
          name: whiteKeyNotes[i],
          displayName: whiteKeyNotes[i],
          type: 'white',
          x: (i + octave * 7) * whiteKeyWidth,
          width: whiteKeyWidth - keySpacing,
          isHighlighted: false,
          octave: 4 + octave
        });
      }

      // Create black keys
      for (let i = 0; i < whiteKeyNotes.length - 1; i++) {
        const keyName = whiteKeyNotes[i];
        if (keyName === 'E' || keyName === 'B') continue; // No black key after E or B

        const sharpName = blackKeyNotes[keyName];
        this.keys.push({
          name: sharpName,
          altName: this.sharpToFlat[sharpName],
          displayName: this.useFlats ? this.sharpToFlat[sharpName] : sharpName,
          type: 'black',
          x: (i + octave * 7 + 1) * whiteKeyWidth - (blackKeyWidth / 2),
          width: blackKeyWidth,
          isHighlighted: false,
          octave: 4 + octave
        });
      }
    }
  }

  private updateKeyNames() {
    this.keys.forEach(key => {
      if (key.type === 'black') {
        key.displayName = this.useFlats ? key.altName! : key.name;
      }
    });
  }

  private updateHighlightedKeys() {
    // First, clear all highlights
    this.keys.forEach(key => key.isHighlighted = false);

    // Then, set highlights for the new notes
    if (this.notesToHighlight && this.notesToHighlight.length > 0) {
      this.notesToHighlight.forEach(noteToHighlight => {
        const parts = noteToHighlight.split('/');
        const noteName = parts[0];
        const octave = parts.length > 1 ? parseInt(parts[1], 10) : 4; // Default to octave 4

        const keyToHighlight = this.keys.find(key => 
          (key.name === noteName || key.altName === noteName) && key.octave === octave
        );

        if (keyToHighlight) {
          keyToHighlight.isHighlighted = true;
        }
      });
    }
  }
}
