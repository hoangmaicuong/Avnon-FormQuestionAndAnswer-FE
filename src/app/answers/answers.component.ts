import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-answers',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule],
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.scss'
})
export class AnswersComponent implements OnInit {
  data = {
    Question : { 
      question_id: 0,
      question_content : '',
      answer_content : '',
      answer_type_id : 0,
      answer_type_code : '',
      answer_option_id : 0,
      option_answer_content : '',
      answer_option : [] as any,
      answer_option_chosed: [] as {answer_option_id : number, option_answer_content: ''}[]
    }
  };
  isShowSuccess = false;
  question_id = 0;
  apiUrl = 'https://localhost:7245';
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute){
    this.route.queryParams.subscribe(params => {
      this.question_id = params['id'];
  });};
  handleChangeOptionAnswerContent(evt:any, item : any) {
    let answerOptionChosed = {
      answer_option_id : item.answer_option_id,
      option_answer_content : item.option_answer_content
    }
    if(evt.target.checked == true)
    {
      this.data.Question.answer_option_chosed.push(answerOptionChosed);
    }
    else if(evt.target.checked == false)
    {
      let index = this.data.Question.answer_option_chosed.indexOf(answerOptionChosed);
      this.data.Question.answer_option_chosed.splice(index, 1);
    }
    console.log(this.data.Question.answer_option_chosed)
  };
  handleClickSaveAnswer(){
    let dataRequest = {
      question_id: this.data.Question.question_id,
      answer_content: this.data.Question.answer_content ?? '',
      answerOptionChosed: this.data.Question.answer_option_chosed
    }
    this.http.post(this.apiUrl + '/api/Answer',dataRequest).subscribe((response) => {
      this.isShowSuccess = true;
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }
  ngOnInit(): void {
    this.http.get(this.apiUrl + '/api/Answer/' + this.question_id).subscribe((response : any) => {
      for (let i = 0; i < response.Question.length; i++) {
        this.data.Question.question_id = response.Question[i].question_id;
        this.data.Question.question_content = response.Question[i].question_content;
        this.data.Question.answer_content = response.Question[i].answer_content;
        this.data.Question.answer_type_id = response.Question[i].answer_type_id;
        this.data.Question.answer_type_code = response.Question[i].answer_type_code;
        this.data.Question.answer_option_id = response.Question[i].answer_option_id;
        this.data.Question.option_answer_content = response.Question[i].option_answer_content;
        this.data.Question.answer_option.push(response.Question[i]);
      }
      console.log('this.data', this.data)
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }
}
