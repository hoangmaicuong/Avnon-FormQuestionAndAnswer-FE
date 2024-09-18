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
    Questions : [] as { 
      question_id: 0,
      answer_id: 0,
      answer_option_id: 0,
      question_content: '',
      answer_content: '',
      option_answer_content: '',
      answer_type_id: 0,
      answer_type_code: '',
      answer_option :  any []
    }[]
  };
  apiUrl = 'https://localhost:7245';
  constructor(private http: HttpClient, private router: Router){};
  ngOnInit(): void {
    this.http.get(this.apiUrl + '/api/Home').subscribe((response : any) => {
      for (let i = 0; i < response.Questions.length; i++) {
        if(i == 0 || response.Questions[i].question_id != response.Questions[i - 1].question_id)
        {
          response.Questions[i].answer_option = [];
          this.data.Questions.push(response.Questions[i]);
          if(response.Questions[i].answer_option_id > 0)
          {
            this.data.Questions[this.data.Questions.length - 1].answer_option.push(response.Questions[i]);
          }
        }
        else if(response.Questions[i].question_id == response.Questions[i - 1].question_id)
        {
          this.data.Questions[this.data.Questions.length - 1].answer_option.push(response.Questions[i]);
        }
      }
      // this.data = response;
      console.log('this.data', this.data)
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }
}
