import { Injectable } from '@angular/core';
import { Chord } from './music-theory';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly storageKey = 'harmonic-progressions';

  constructor() { }

  getSavedProgressions(): Chord[][] {
    const savedData = localStorage.getItem(this.storageKey);
    return savedData ? JSON.parse(savedData) : [];
  }

  saveProgression(progression: Chord[]): Chord[][] {
    if (!progression || progression.length === 0) {
      return this.getSavedProgressions();
    }
    const savedProgressions = this.getSavedProgressions();
    savedProgressions.push(progression);
    localStorage.setItem(this.storageKey, JSON.stringify(savedProgressions));
    return savedProgressions;
  }

  deleteProgression(index: number): Chord[][] {
    const savedProgressions = this.getSavedProgressions();
    if (index >= 0 && index < savedProgressions.length) {
      savedProgressions.splice(index, 1);
      localStorage.setItem(this.storageKey, JSON.stringify(savedProgressions));
    }
    return savedProgressions;
  }

}