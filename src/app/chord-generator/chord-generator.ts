import { Component, EventEmitter, Output } from '@angular/core';
import { MusicTheoryService, Chord } from '../music-theory';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-chord-generator',
  standalone: false,
  templateUrl: './chord-generator.html',
  styleUrls: ['./chord-generator.scss'],
})
export class ChordGenerator {
  @Output() chordGenerated = new EventEmitter<{ name: string; notes: string[] }>();

  chordTypes: { name: string; value: string }[] = [
    { name: 'Maior', value: 'major' }, // M
    { name: 'Menor', value: 'minor' }, // m
    { name: 'Aumentado', value: 'augmented' }, // aug
    { name: 'Diminuto', value: 'diminished' }, // dim
    { name: 'Sétima Dominante (7)', value: 'dominant-seventh' }, // 7
    { name: 'Sétima Menor (m7)', value: 'minor-seventh' }, // m7
    { name: 'Sétima Maior (maj7)', value: 'major-seventh' }, // maj7
    { name: 'Sétima Diminuta (dim7)', value: 'diminished-seventh' }, // dim7
    { name: 'Meio-Diminuto (m7b5)', value: 'half-diminished' }, // m7b5
    { name: 'Suspenso (sus4)', value: 'sus4' }, // sus4
    { name: 'Suspenso (sus2)', value: 'sus2' }, // sus2
    { name: 'Sétima com 4ª Suspensa (7sus4)', value: 'dominant-seventh-sus4' }, // 7sus4
    { name: 'Sexta (6)', value: 'major-sixth' }, // 6
    { name: 'Sexta Menor (m6)', value: 'minor-sixth' }, // m6
    { name: 'Nona (9)', value: 'dominant-ninth' }, // 9
    { name: 'Nona Menor (m9)', value: 'minor-ninth' }, // m9
    { name: 'Nona Maior (maj9)', value: 'major-ninth' }, // maj9
    { name: 'Décima Primeira (11)', value: 'dominant-eleventh' }, // 11
    { name: 'Décima Primeira Menor (m11)', value: 'minor-eleventh' }, // m11
    { name: 'Décima Terceira (13)', value: 'dominant-thirteenth' }, // 13
    { name: 'Décima Terceira Menor (m13)', value: 'minor-thirteenth' }, // m13
    { name: 'Décima Terceira Maior (maj13)', value: 'major-thirteenth' }, // maj13
    { name: 'Com Nona Adicionada (add9)', value: 'add-ninth' }, // add9
    { name: 'Sexta com Nona (6/9)', value: 'sixth-ninth' }, // 6/9
    { name: 'Power Chord (5)', value: 'power-chord' }, // 5
    { name: 'Sétima com 5ª bemol (7b5)', value: 'dominant-seventh-flat-five' }, // 7(b5)
    { name: 'Sétima com 9ª bemol (7b9)', value: 'dominant-seventh-flat-nine' }, // 7(b9)
    { name: 'Sétima com 9ª aumentada (7#9)', value: 'dominant-seventh-sharp-nine' }, // 7(#9)
  ];
  inversions = [
    { name: 'Fundamental', value: 0 },
    { name: '1ª Inversão', value: 1 },
    { name: '2ª Inversão', value: 2 },
    { name: '3ª Inversão', value: 3 },
  ];

  private chordCipherMap: { [key: string]: string } = {
    major: '',
    minor: 'm',
    augmented: 'aug',
    diminished: 'dim',
    'dominant-seventh': '7',
    'minor-seventh': 'm7',
    'major-seventh': 'maj7',
    'diminished-seventh': 'dim7',
    'half-diminished': 'm7(b5)',
    sus4: 'sus4',
    sus2: 'sus2',
    'dominant-seventh-sus4': '7sus4',
    'major-sixth': '6',
    'minor-sixth': 'm6',
    'dominant-ninth': '9',
    'minor-ninth': 'm9',
    'major-ninth': 'maj9',
    'dominant-eleventh': '11',
    'minor-eleventh': 'm11',
    'dominant-thirteenth': '13',
    'minor-thirteenth': 'm13',
    'major-thirteenth': 'maj13',
    'add-ninth': 'add9',
    'sixth-ninth': '6/9',
    'power-chord': '5',
    'dominant-seventh-flat-five': '7(b5)',
    'dominant-seventh-flat-nine': '7(b9)',
    'dominant-seventh-sharp-nine': '7(#9)',
  };

  selectedRoot: string = 'C';
  selectedChordType: string = 'major';
  selectedInversion: number = 0;
  useFlats: boolean = false;

  constructor(private musicTheoryService: MusicTheoryService, private audioService: AudioService) {}

  get notes(): string[] {
    return this.useFlats ? this.musicTheoryService.notesFlat : this.musicTheoryService.notesSharp;
  }

  onAccidentalChange() {
    if (!this.notes.includes(this.selectedRoot)) {
      this.selectedRoot = 'C';
    }
  }

  generateAndPlayChord() {
    const chordNotes = this.musicTheoryService.getChordNotes(
      this.selectedRoot,
      this.selectedChordType,
      this.selectedInversion,
      this.useFlats
    );

    if (chordNotes) {
      const cipher = this.chordCipherMap[this.selectedChordType] ?? this.selectedChordType;
      const chordName = `${this.selectedRoot}${cipher}`;

      this.audioService.playChord(chordNotes);
      this.chordGenerated.emit({ name: chordName, notes: chordNotes });
    }
  }
}
