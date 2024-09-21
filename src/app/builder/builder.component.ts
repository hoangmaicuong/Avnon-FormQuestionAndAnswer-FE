import { Component, OnInit } from '@angular/core';
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
export class BuilderComponent implements OnInit {
  tempAnswer = '';
  isShowSuccess = false;
  data = {
    questionTitleId: 0,
    questionTitleContent: '',
    questions: [] as {
      questionId: 0;
      questionContent: '';
      isRequired: boolean;
      answerTypeId: 0;
      answerTypeCode: string;
      answerContent: '';
      optionAnswerContent: string;
      answerOptionDTOs: {
        optionAnswerContent: '';
      }[];
    }[]
  };
  apiUrl = 'https://localhost:7245';
  constructor(private http: HttpClient, private router: Router){};
  handleClickSaveQuestion()
  {
    console.log('this.data', this.data)
    this.http.post(this.apiUrl + '/api/Question',this.data).subscribe((response) => {
      this.isShowSuccess = true;
      //reset
      // this.data.id = 0;
      // this.data.questionContent = '';
      // this.data.answerTypeId = 0;
      // this.data.answerTypeCode = 'ReplyText';
      // this.data.answerContent = '';
      // this.data.answerOptionDTOs = [];
      //     this.router.navigate(['']);
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }
  handleClickAddQuestionNew(){
    this.data.questions.unshift({
      questionId: 0,
      questionContent: '',
      isRequired: true,
      answerTypeId: 0,
      answerTypeCode: 'ReplyText',
      answerContent: '',
      optionAnswerContent: '',
      answerOptionDTOs: [],
    });
  }
  handleChangeChoseAnswers(answerTypeCode: string, item: any) {
    let index = this.data.questions.indexOf(item);
    this.data.questions[index].answerTypeCode = answerTypeCode;
  }
  handleClickDeleteQuestion(index:number)
  {
    this.data.questions.splice(index, 1);
  }
  handleClickAddOptionAnswer(item: any)
  {
    item.answerOptionDTOs.unshift({optionAnswerContent: item.optionAnswerContent});
    item.optionAnswerContent = ''
  }
  handleClickDeleteOptionAnswer(item:any, itemAnswerOption: any, index: number)
  {
    let indexQuestion = this.data.questions.indexOf(item);
    this.data.questions[indexQuestion].answerOptionDTOs.splice(index, 1);
  }
  ngOnInit(): void {
    
    
  }
}
