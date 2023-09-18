import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';

@Component({
  selector: 'app-text-dialog',
  templateUrl: './text-dialog.component.html',
  styleUrls: ['./text-dialog.component.scss']
})
export class TextDialogComponent {

  color: string = '#000000';
  text: string = '';
  textType: string = '';

  constructor(public dialogRef: MatDialogRef<TextDialogComponent>, private cpService: ColorPickerService) {}

  onSubmit(): void {
    this.dialogRef.close({ text: this.text, textType: this.textType, color: this.color });
  }

  onCancel(): void {
    this.dialogRef.close({ canceled: true });
  }

  onColorChange(target: EventTarget|null): void {
    if(target == null)
      return;
      if (target instanceof HTMLInputElement) {
        this.color = target.value;
      }
  }

}
