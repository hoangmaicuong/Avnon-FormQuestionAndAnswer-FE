import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { isEmpty } from 'rxjs';

@Component({
  selector: 'app-answers',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule],
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.scss'
})
export class AnswersComponent implements OnInit {
  config = {
    isDisabledSave : false
  }
  dataNew = {
    questionTitleId: 0,
    questionTitleContent: '',
    questions: [] as {
      questionId: number;
      questionContent: '';
      isRequired: boolean;
      showNotificationRequired: boolean;
      answerTypeId: 0;
      answerTypeCode: string;
      answerContent: '';
      optionAnswerContent: string;
      answerOptionId: number;
      answerOptionDTOs: {
        answerId : number;
        answerOptionId: number;
        optionAnswerContent: '';
      }[];
      answerOptionChosed: {
        answerId : number,
        answerOptionId : number,
        optionAnswerContent: ''
      }[];
    }[]
  };
  isShowSuccess = false;
  questionTitleId = 0;
  apiUrl = 'https://localhost:7245';
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute){
    this.route.queryParams.subscribe(params => {
      this.questionTitleId = params['questionTitleId'];
  });};
  handleChangeOptionAnswerContent(evt:any, item : any, itemOption : any) {
    if(evt.target.checked == true)
    {
      item.answerOptionChosed.unshift(itemOption)
    }
    else if(evt.target.checked == false)
    {
      let answerOptionChosed = item.answerOptionChosed.find((x: any) => x.answerOptionId == itemOption.answerOptionId);
      if(itemOption.answerOptionId != null)
      {
        let index = item.answerOptionChosed.indexOf(answerOptionChosed);
        item.answerOptionChosed.splice(index, 1);
      }
    }
  };
  handleCheckedOptionAnswer(item : any, itemOption: any) : boolean
  {
    let answerOption = item.answerOptionChosed.find((x : any) => x.answerOptionId == itemOption.answerOptionId);
    if(answerOption != null)
    {
      return true;
    }
    else return false;
  }
  handleClickSaveAnswer(){
    // check required
    this.config.isDisabledSave = true;
    for(var item of this.dataNew.questions)
    {
      if(item.isRequired)
      {
        if(item.answerTypeCode.trim() == 'ReplyText' && (item.answerContent == null || item.answerContent.trim() == ''))
        {
          item.showNotificationRequired = true;
          this.config.isDisabledSave = false;
          return;
        }
        else if(item.answerTypeCode.trim() == 'ChooseAS' && item.answerOptionChosed.length < 1)
        {
          item.showNotificationRequired = true;
          this.config.isDisabledSave = false;
          return;
        }

      }
    }
    this.http.post(this.apiUrl + '/api/Answer',this.dataNew).subscribe((response) => {
      this.isShowSuccess = true;
      this.config.isDisabledSave = false;
      window.location.reload();
    },
    (error) => {
      this.config.isDisabledSave = false;
      console.error('Error fetching data:', error);
    });
  }
  ngOnInit(): void {
    this.http.get(this.apiUrl + '/api/Answer/' + this.questionTitleId).subscribe((response : any) => {
      let item;
      let question;
      if(response.View.length > 0)
      {
        this.dataNew.questionTitleId = response.View[0].questionTitleId;
        this.dataNew.questionTitleContent = response.View[0].questionTitleContent;
      }
      // fillter question
      for (let i = 0; i < response.View.length; i++) {
        item = response.View[i];
        question = {
          questionId: item.questionsId,
          questionContent: item.questionContent,
          isRequired: item.isRequired,
          showNotificationRequired: false,
          answerTypeId: item.answerTypeId,
          answerTypeCode: item.answerTypeCode,
          answerContent: item.answerContent,
          optionAnswerContent: item.optionAnswerContent,
          answerOptionId: item.answerOptionId,
          answerOptionDTOs: [],
          answerOptionChosed: []
        }
        if(i == 0)
        {
          this.dataNew.questions.unshift(question);
          if(question.answerOptionId != null)
          {
            this.dataNew.questions[0].answerOptionDTOs.unshift({answerId: 0, answerOptionId: question.answerOptionId, optionAnswerContent : question.optionAnswerContent})
          }
        }
        else if(item.questionsId != this.dataNew.questions[0].questionId)
        {
          this.dataNew.questions.unshift(question);
          if(question.answerOptionId != null)
          {
            this.dataNew.questions[0].answerOptionDTOs.unshift({answerId: 0, answerOptionId: question.answerOptionId, optionAnswerContent : question.optionAnswerContent})
          }
        }
        else if(item.questionsId == this.dataNew.questions[0].questionId)
        {
          this.dataNew.questions[0].answerOptionDTOs.unshift({answerId: 0, answerOptionId: question.answerOptionId, optionAnswerContent : question.optionAnswerContent})
        }
      }
      // fillter answer
      for(let i = 0; i < this.dataNew.questions.length; i++)
      {
        item = this.dataNew.questions[i];
        let itemAnswerOption;
        let answerOption;
        for(let j = 0; j < response.Answer.length; j++)
        {
          itemAnswerOption = response.Answer[j];
          if(itemAnswerOption.questionsId == item.questionId)
          {
            answerOption = {
              answerId: itemAnswerOption.answerId,
              answerOptionId: itemAnswerOption.answerOptionId,
              optionAnswerContent: itemAnswerOption.optionAnswerContent
            }
            item.answerOptionChosed.unshift(answerOption)
          }
        }
      }
      
      console.log('response', response)
      console.log('this.dataNew', this.dataNew)
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }
}
