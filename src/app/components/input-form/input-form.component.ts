import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { InputData } from '../../models/fuzzy.interface';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule
  ],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss'
})
export class InputFormComponent {
  @Output() formSubmit = new EventEmitter<InputData>();
  
  fuzzyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.fuzzyForm = this.fb.group({
      satisfaccion: [8, [Validators.required, Validators.min(0), Validators.max(10)]],
      aprendizaje: [8, [Validators.required, Validators.min(0), Validators.max(10)]],
      desempeno: [8, [Validators.required, Validators.min(0), Validators.max(10)]],
      clima: [7, [Validators.required, Validators.min(0), Validators.max(10)]],
      disciplina: [8, [Validators.required, Validators.min(0), Validators.max(10)]],
      economicos: [6, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  onSubmit() {
    if (this.fuzzyForm.valid) {
      this.formSubmit.emit(this.fuzzyForm.value);
    }
  }

  formatLabel(value: number): string {
    return value.toString();
  }
}
