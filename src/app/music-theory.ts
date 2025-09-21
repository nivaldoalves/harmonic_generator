import { Injectable } from '@angular/core';

export interface Chord {
  degree: string;
  name: string;
  notes: string;
  type: 'major' | 'minor' | 'dominant' | 'diminished';
}

@Injectable({
  providedIn: 'root'
})
export class MusicTheoryService {

  readonly notesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  readonly notesFlat = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];

  constructor() { }

  getNoteName(index: number, useFlats: boolean): string {
    const notes = useFlats ? this.notesFlat : this.notesSharp;
    return notes[index % 12];
  }

  generateHarmonicField(rootNote: string, mode: 'major' | 'minor', useFlats: boolean): Chord[] {
    const notes = useFlats ? this.notesFlat : this.notesSharp;
    const rootIndex = notes.indexOf(rootNote.split('/')[0]);
    if (rootIndex === -1) {
      return [];
    }

    const majorScaleIntervals = [2, 2, 1, 2, 2, 2, 1];
    const minorScaleIntervals = [2, 1, 2, 2, 1, 2, 2];
    const intervals = mode === 'major' ? majorScaleIntervals : minorScaleIntervals;

    const scaleNotes: number[] = [rootIndex];
    let currentNoteIndex = rootIndex;
    for (let i = 0; i < 6; i++) {
      currentNoteIndex += intervals[i];
      scaleNotes.push(currentNoteIndex);
    }

    const majorChordQualities = ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'];
    const minorChordQualities = ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', '7'];
    const chordQualities = mode === 'major' ? majorChordQualities : minorChordQualities;
    
    const romanNumeralsMajor = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const romanNumeralsMinor = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const romanNumerals = mode === 'major' ? romanNumeralsMajor : romanNumeralsMinor;

    const harmonicField: Chord[] = [];

    for (let i = 0; i < 7; i++) {
      const chordRootIndex = scaleNotes[i];
      const thirdIndex = scaleNotes[(i + 2) % 7];
      const fifthIndex = scaleNotes[(i + 4) % 7];
      const seventhIndex = scaleNotes[(i + 6) % 7];

      const chordRootOctave = 4 + Math.floor(chordRootIndex / 12);
      const thirdOctave = 4 + Math.floor(thirdIndex / 12);
      const fifthOctave = 4 + Math.floor(fifthIndex / 12);
      const seventhOctave = 4 + Math.floor(seventhIndex / 12);

      const chordRootNote = `${this.getNoteName(chordRootIndex, useFlats)}/${chordRootOctave}`;
      const thirdNote = `${this.getNoteName(thirdIndex, useFlats)}/${thirdOctave}`;
      const fifthNote = `${this.getNoteName(fifthIndex, useFlats)}/${fifthOctave}`;
      const seventhNote = `${this.getNoteName(seventhIndex, useFlats)}/${seventhOctave}`;

      let chordType: Chord['type'] = 'major';
      if (chordQualities[i].includes('m7b5')) {
        chordType = 'diminished';
      } else if (chordQualities[i] === 'm7') {
        chordType = 'minor';
      } else if (chordQualities[i] === '7') {
        chordType = 'dominant';
      }

      harmonicField.push({
        degree: romanNumerals[i],
        name: `${this.getNoteName(chordRootIndex, useFlats)}${chordQualities[i].replace('maj', '')} `,
        notes: `${chordRootNote} - ${thirdNote} - ${fifthNote} - ${seventhNote}`,
        type: chordType
      });
    }

    return harmonicField;
  }

  getScaleNotes(rootNote: string, mode: 'major' | 'minor', useFlats: boolean): string[] {
    const notes = useFlats ? this.notesFlat : this.notesSharp;
    const rootIndex = notes.indexOf(rootNote.split('/')[0]);
    if (rootIndex === -1) {
      return [];
    }

    const majorScaleIntervals = [2, 2, 1, 2, 2, 2, 1];
    const minorScaleIntervals = [2, 1, 2, 2, 1, 2, 2];
    const intervals = mode === 'major' ? majorScaleIntervals : minorScaleIntervals;

    const scaleNoteIndices: number[] = [rootIndex];
    let currentNoteIndex = rootIndex;
    for (let i = 0; i < 6; i++) {
      currentNoteIndex += intervals[i];
      scaleNoteIndices.push(currentNoteIndex);
    }

    const scaleWithOctaves = scaleNoteIndices.map(index => {
      const octave = 4 + Math.floor(index / 12);
      return `${this.getNoteName(index, useFlats)}/${octave}`;
    });

    const octaveRootIndex = rootIndex + 12;
    const octaveRootOctave = 4 + Math.floor(octaveRootIndex / 12);
    scaleWithOctaves.push(`${this.getNoteName(octaveRootIndex, useFlats)}/${octaveRootOctave}`);

    return scaleWithOctaves;
  }
}