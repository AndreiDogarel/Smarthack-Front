import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { FileUploadService } from '../../core/file-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-file.html',
  styleUrls: ['./upload-file.css']
})
export class FileUploadComponent {
  private router = inject(Router);
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  message: string = '';

  constructor(private uploadService: FileUploadService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.message = '';
  }

  onUpload() {
    if (!this.selectedFile) {
      this.message = '❗ Te rog selectează un fișier mai întâi.';
      return;
    }

    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.message = '✅ ' + event.body;
          this.uploadProgress = 0;
          this.selectedFile = null;
        }
      },
      error: (err) => {
        console.error(err);
        this.message = '❌ Eroare la upload!';
        this.uploadProgress = 0;
      }
    });
  }
  goHome() {
    this.router.navigate(['/']); // navighează către Home
  }
}
