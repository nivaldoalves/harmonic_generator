import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface HelpDialogData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class HelpDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<HelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HelpDialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
