import { Component, Input, OnChanges } from '@angular/core';
import { AudioService } from '../audio.service';

// Interface for a single piano key
export interface PianoKey {
  name: string;       // e.g., 'C', 'C#'
  altName?: string;    // e.g., 'D♭'
  type: 'white' | 'black';
  x: number;          // X position for SVG rendering
  width: number;
  isHighlighted: boolean;
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

  // Array representing the piano keys for one octave
  keys: PianoKey[] = [];
  
  // SVG viewbox dimensions
  viewBoxWidth = 245;
  viewBoxHeight = 120;

  private readonly sharpToFlat: { [key: string]: string } = {
    'C#': 'D♭', 'D#': 'E♭', 'F#': 'G♭', 'G#': 'A♭', 'A#': 'B♭'
  };

  constructor(private audioService: AudioService) {
    this.buildPianoKeys();
  }

  // This lifecycle hook detects when the input property changes
  ngOnChanges() {
    this.updateHighlightedKeys();
  }

  onKeyClick(key: PianoKey) {
    this.audioService.playNote(key.name);
  }

  private buildPianoKeys() {
    const whiteKeyWidth = 35;
    const blackKeyWidth = 20;
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeys: { [key: string]: string } = { 'C': 'C#', 'D': 'D#', 'F': 'F#', 'G': 'G#', 'A': 'A#' };

    // Create white keys
    for (let i = 0; i < whiteKeys.length; i++) {
      this.keys.push({
        name: whiteKeys[i],
        type: 'white',
        x: i * whiteKeyWidth,
        width: whiteKeyWidth,
        isHighlighted: false
      });
    }

    // Create black keys
    for (let i = 0; i < whiteKeys.length - 1; i++) {
      const keyName = whiteKeys[i];
      if (blackKeys[keyName]) {
        const sharpName = blackKeys[keyName];
        this.keys.push({
          name: sharpName,
          altName: this.sharpToFlat[sharpName],
          type: 'black',
          x: (i + 1) * whiteKeyWidth - (blackKeyWidth / 2),
          width: blackKeyWidth,
          isHighlighted: false
        });
      }
    }
  }

  private updateHighlightedKeys() {
    // First, clear all highlights
    this.keys.forEach(key => key.isHighlighted = false);

    // Then, set highlights for the new notes
    if (this.notesToHighlight && this.notesToHighlight.length > 0) {
      this.keys.forEach(key => {
        // Check if the key's name is in the highlight list
        // Handles both sharp (C#) and flat (Db) names
        if (this.notesToHighlight.includes(key.name) || (key.altName && this.notesToHighlight.includes(key.altName))) {
          key.isHighlighted = true;
        }
      });
    }
  }
}