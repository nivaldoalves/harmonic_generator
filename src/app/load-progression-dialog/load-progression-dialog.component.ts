import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface DialogData {
  progressionNames: string[];
}

@Component({
  selector: 'app-load-progression-dialog',
  templateUrl: './load-progression-dialog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule],
})
export class LoadProgressionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LoadProgressionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(result?: string): void {
    this.dialogRef.close(result);
  }

}
