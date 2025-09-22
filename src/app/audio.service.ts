import { Injectable } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private sampler: Tone.Sampler;
  private isLoaded = false;

  constructor() {
    this.sampler = new Tone.Sampler(
      {
        A0: 'A0.mp3',
        C1: 'C1.mp3',
        'D#1': 'Ds1.mp3',
        'F#1': 'Fs1.mp3',
        A1: 'A1.mp3',
        C2: 'C2.mp3',
        'D#2': 'Ds2.mp3',
        'F#2': 'Fs2.mp3',
        A2: 'A2.mp3',
        C3: 'C3.mp3',
        'D#3': 'Ds3.mp3',
        'F#3': 'Fs3.mp3',
        A3: 'A3.mp3',
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',
        C5: 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',
        C6: 'C6.mp3',
        'D#6': 'Ds6.mp3',
        'F#6': 'Fs6.mp3',
        A6: 'A6.mp3',
        C7: 'C7.mp3',
        'D#7': 'Ds7.mp3',
        'F#7': 'Fs7.mp3',
        A7: 'A7.mp3',
        C8: 'C8.mp3',
      },
      {
        release: 1,
        baseUrl: 'https://tonejs.github.io/audio/salamander/',
        onload: () => {
          this.isLoaded = true;
        },
      }
    ).toDestination();
  }

  private async ensureLoaded() {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    if (!this.isLoaded) {
      // This is a fallback, but the onload callback should handle it.
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (this.isLoaded) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }
  }

  private formatNote(noteName: string, octave: number): string {
    return `${noteName.replace('/', '')}${octave}`;
  }

  async playChord(notes: string[]) {
    await this.ensureLoaded();
    const now = Tone.now();
    const formattedNotes = notes.map((noteName) => {
      const parts = noteName.split('/');
      const note = parts[0];
      const octave = parts.length > 1 ? parseInt(parts[1], 10) : 4;
      return this.formatNote(note, octave);
    });
    this.sampler.triggerAttackRelease(formattedNotes, '1n', now);
  }

  async playNote(noteName: string, octave: number = 4) {
    await this.ensureLoaded();
    const now = Tone.now();
    const formattedNote = this.formatNote(noteName, octave);
    this.sampler.triggerAttackRelease([formattedNote], '1n', now);
  }
}