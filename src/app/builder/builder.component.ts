import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { HomeComponent } from '../home/home.component';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [FormsModule, HttpClientModule, HomeComponent, RouterLink],
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.scss'
})
export class BuilderComponent {
  isCreateAnswer = false;
  tempAnswer = '';
  isShowSuccess = false;
  data = {
    id: 0,
    questionContent: '',
    answerTypeId: 0,
    answerTypeCode: 'ReplyText',
    answerContent: '',
    answerOptionDTOs: [] as { optionAnswerContent: string }[]
  };
  apiUrl = 'https://localhost:7245';
  constructor(private http: HttpClient, private router: Router){};
  handleClickSaveQuestion()
  {
    this.http.post(this.apiUrl + '/api/Question',this.data).subscribe((response) => {
      this.isShowSuccess = true;
      //reset
      this.data.id = 0;
      this.data.questionContent = '';
      this.data.answerTypeId = 0;
      this.data.answerTypeCode = 'ReplyText';
      this.data.answerContent = '';
      this.data.answerOptionDTOs = [];
      //     this.router.navigate(['']);
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }
  handleChangeChoseAnswers(isCreateAnswerInput: boolean, answerTypeCode: string) {
    this.isCreateAnswer = isCreateAnswerInput;
    this.data.answerTypeCode = answerTypeCode;
  }
  handleClickAddAnswers()
  {
    this.data.answerOptionDTOs.push({optionAnswerContent: this.tempAnswer});
    this.tempAnswer = ''
  }
  handleClickAddDelete(item:any)
  {
    const index = this.data.answerOptionDTOs.indexOf(item);
    this.data.answerOptionDTOs.splice(index, 1);
  }
}
