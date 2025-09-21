
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext;
  private readonly baseFrequency = 440; // A4
  private readonly noteFrequencies: { [key: string]: number } = {};
  private readonly sharpToFlat: { [key: string]: string } = {
    'C#': 'D♭', 'D#': 'E♭', 'F#': 'G♭', 'G#': 'A♭', 'A#': 'B♭'
  };

  constructor() {
    this.audioContext = new AudioContext();
    this.generateNoteFrequencies();
  }

  private generateNoteFrequencies() {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    for (let i = 0; i < 12; i++) {
      const note = notes[i];
      const frequency = this.baseFrequency * Math.pow(2, (i - 9) / 12);
      this.noteFrequencies[note] = frequency;

      // Add flat equivalent
      const flatName = this.sharpToFlat[note];
      if (flatName) {
        this.noteFrequencies[flatName] = frequency;
      }
    }
  }

  private playNoteInternal(frequency: number, startTime: number, octave: number) {
    if (!frequency) return;

    const adjustedFrequency = frequency * Math.pow(2, octave - 4);

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // --- Timbre (Waveform + Filter) ---
    oscillator.type = 'sawtooth'; // Richer harmonic content
    filter.type = 'lowpass'; // To soften the sawtooth wave
    filter.frequency.value = 2000; // Cut off higher, harsh frequencies

    // --- ADSR Envelope ---
    const peakLevel = 0.4;
    const sustainLevel = 0.2;
    const attackTime = 0.02;
    const decayTime = 0.1;
    const duration = 0.5;

    gainNode.gain.setValueAtTime(0, startTime);
    // Attack
    gainNode.gain.linearRampToValueAtTime(peakLevel, startTime + attackTime);
    // Decay
    gainNode.gain.linearRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
    // Release
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // --- Connections ---
    oscillator.frequency.setValueAtTime(adjustedFrequency, startTime);
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // --- Playback ---
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  playChord(notes: string[]) {
    const now = this.audioContext.currentTime;
    notes.forEach(noteName => {
      const parts = noteName.split('/');
      const note = parts[0];
      const octave = parts.length > 1 ? parseInt(parts[1], 10) : 4; // Default to octave 4
      const frequency = this.noteFrequencies[note];
      this.playNoteInternal(frequency, now, octave);
    });
  }

  playNote(noteName: string, octave: number = 4) {
    const now = this.audioContext.currentTime;
    const note = noteName.split('/')[0];
    const frequency = this.noteFrequencies[note];
    this.playNoteInternal(frequency, now, octave);
  }
}
