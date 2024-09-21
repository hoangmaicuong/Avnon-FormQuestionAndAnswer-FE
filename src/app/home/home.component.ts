import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  data = {
    QuestionTitles :  [] as any
  };
  apiUrl = 'https://localhost:7245';
  constructor(private http: HttpClient, private router: Router){};
  ngOnInit(): void {
    this.http.get(this.apiUrl + '/api/Home').subscribe((response : any) => {
      this.data.QuestionTitles = response.QuestionTitles;
      // console.log('response', response)
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }
}
