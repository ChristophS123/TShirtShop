import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private client:HttpClient) {  }

  sendEmail(to:any, subject:any, body:any, imageData:any[]) {
    const emailContent = {
      to: to,
      subject: subject,
      body: body,
      images: imageData
    };
    this.client.post('http://localhost/TShirtBackend/index.php/api/send-email', emailContent).subscribe((response) => {
    }, (error) => {
      console.log(error);
      alert("Bestellung fehlgeschlagen!");
    });
  }

}
