import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpService } from '../../../Shared/http.service';
import { PhaseComponent } from '../phase/phase.component';
import { MatSelectModule } from '@angular/material';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { questionairreURL } from '../../../Constants/url.constants';
import { saveAnswerURL } from '../../../Constants/url.constants';
import * as XLSX from 'xlsx';
import { ExcelUploadComponent } from '../excel-upload/excel-upload.component';
import { CloseScrollStrategy } from '@angular/cdk/overlay';



@Component({
    selector: 'app-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit, OnChanges {
    @Input('tabs') tabs;
    @Input('phaseName') phaseName;
    @Input('openedTab') openedTab;
    @Output() getPhase: EventEmitter<any> = new EventEmitter<string>();
    questionDetails;
    storeAnswers = {};
    allAnswers = {};
    evenQues = [];
    oddQues = [];
    newlineQues = [];
    triggerQues = [];
    nextPhase = '';
    triggeredQues = {};
    triggeredQuestionInfo = [];
    @Output('nextPhase') next: EventEmitter<any> = new EventEmitter();
    projectId;
    engagementId;
    activeTab: any = [];
    questionBioData = {};
    activeTasks = [];
    loading = false;
    triggeredQuesID;
    triggeredQuestionStatus = 0;   //0: Question Pushed To Even or Odd Array
    excelData;
    constructor(private _http: HttpService, private _route: Router,
        private route: ActivatedRoute, private datePipe: DatePipe) { }

    private storeAnswersSource = new BehaviorSubject(this.storeAnswers);

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        //console.log('openedTab in ngonchanges',this.openedTab);
        this.route.params.subscribe(params => {
            this.phaseName = params['phase'];
            this.projectId = params['projectId'];
            this.engagementId = params['engId'];
        });
        if (this.phaseName && this.projectId && this.engagementId && this.openedTab) {
            this.getQuestionDetails();
        }
    }

    getTasks(): void {
        //console.log("in gettasks....");
        this.activeTasks = [];
        for (let i = 0; i < this.tabs.length; i++) {
            if ((this.tabs[i]['PHASE'] === this.phaseName) && (this.tabs[i]['TABS'].length === 1)) {
                this.activeTasks = this.tabs[i]['TABS'][0]['TASKS'];
            } else if (this.tabs[i]['PHASE'] === this.phaseName && this.tabs[i]['TABS'].length > 1) {
                for (let j = 0; j < this.tabs[i]['TABS'].length; j++) {
                    if (this.tabs[i]['TABS'][j]['NAME'] === this.openedTab['NAME']) {
                        this.activeTasks = this.tabs[i]['TABS'][j]['TASKS'];
                        break;
                    }
                }
            }
        }
        console.log("After for active atsks", this.activeTasks);
    }
    formQuestionJson(): void {
        // even and odd questions to divide them into the UI into two columns
        this.evenQues = [];
        this.oddQues = [];
        this.newlineQues = [];
        this.triggerQues = [];
        if (this.activeTab && this.activeTab.length > 0) {
            for (let i = 0; i < this.activeTab[0]['TAB_QUESTIONS'].length; i++) {
                if (this.activeTab[0].TAB_QUESTIONS[i].REQ_TRIGGERING === 'Y') {
                    this.triggerQues.push(this.activeTab[0]['TAB_QUESTIONS'][i]);
                } else if (this.activeTab[0].TAB_QUESTIONS[i].QUESTION_TYPE === 'Paragraph' ||
                    (this.activeTab[0].TAB_QUESTIONS[i].QUESTION_TYPE === 'Radio') && (this.activeTab[0].TAB_QUESTIONS[i].POSSIBLE_ANSWERS.length > 4)) {
                    this.newlineQues.push(this.activeTab[0]['TAB_QUESTIONS'][i]);
                } else if (this.evenQues.length <= this.oddQues.length) {
                    this.evenQues.push(this.activeTab[0]['TAB_QUESTIONS'][i]);
                } else {
                    this.oddQues.push(this.activeTab[0].TAB_QUESTIONS[i]);
                }
                // console.log('evenquest...', this.evenQues);
                // console.log('oddquest...', this.oddQues);
                // console.log('paraquest...', this.newlineQues);
                // console.log('triggerquest...', this.triggerQues);
            }
        }
    }
    formAnswerForUI(): void {
        // allAnswers= has all the answers that came in ANSWER_DETAILS from the in-progress questions
        // storeAnswers= holds the current answers of all the questions in the UI.
        //  First storeAnswers is initialised by the answers from ANSWER_DETAILS(in proper format to render in the UI), 
        //  then will hold current answers(if any changes happen in the UI)

        if (this.questionDetails !== undefined) {
            for (let i = 0; i < this.questionDetails.length; i++) {
                if (this.questionDetails[i]['TAB_NAME'] === this.activeTab[0]['TAB_NAME']) {
                    const tab_questions = this.questionDetails[i]['TAB_QUESTIONS'];
                    for (let j = 0; j < tab_questions.length; j++) {
                        if (tab_questions[j]['ANSWER_DETAILS'].length !== 0) {
                            const qId = tab_questions[j]['QUESTION_ID'];
                            this.allAnswers[qId] = [];
                            this.storeAnswers[qId] = [];
                            if (tab_questions[j]['QUESTION_TYPE'] === 'Multiselect') {
                                this.storeAnswers[qId][0] = [];
                            }
                            for (let index = 0; index < tab_questions[j]['ANSWER_DETAILS'].length; index++) {
                                // format the date for UI
                                if (tab_questions[j]['QUESTION_TYPE'] === 'Date') {
                                    tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER_DATE'] = this.formatDate(tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER_DATE']);
                                }
                                this.allAnswers[qId].push({
                                    'answerKey': tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER_KEY'],
                                    'answer': ((tab_questions[j]['QUESTION_TYPE'] === 'Text'
                                        || tab_questions[j]['QUESTION_TYPE'] === 'Paragraph')
                                        ? tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER'] : null),
                                    'answerId': ((tab_questions[j]['QUESTION_TYPE'] === 'Text'
                                        || tab_questions[j]['QUESTION_TYPE'] === 'Paragraph'
                                        || tab_questions[j]['QUESTION_TYPE'] === 'Date')
                                        ? null : tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER_ID']),
                                    'answerDate': (tab_questions[j]['QUESTION_TYPE'] === 'Date') ?
                                        tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER_DATE'] : null,
                                    'qId': qId,
                                    'questionType': tab_questions[j]['QUESTION_TYPE']
                                });
                                if (tab_questions[j]['QUESTION_TYPE'] === 'Text' || tab_questions[j]['QUESTION_TYPE'] === 'Paragraph') {
                                    this.storeAnswers[qId][0] = tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER'];
                                } else if (tab_questions[j]['QUESTION_TYPE'] === 'Date') {
                                    this.storeAnswers[qId][0] = tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER_DATE'];
                                } else if (tab_questions[j]['QUESTION_TYPE'] === 'Multiselect') {
                                    this.storeAnswers[qId][0].push(tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER_ID']);
                                } else {
                                    this.storeAnswers[qId][0] = tab_questions[j]['ANSWER_DETAILS'][index]['ANSWER_ID'];
                                }
                            }
                        } else {
                            const qId = tab_questions[j]['QUESTION_ID'];
                            this.storeAnswers[qId] = [];
                            this.storeAnswers[qId][0] = (tab_questions[j]['QUESTION_TYPE'] === 'Multiselect') ? [] : '';
                        }
                    }
                }
            }
        }
        //  console.log('after parsing...');
        console.log(this.questionDetails);
        console.log(this.storeAnswers);
        console.log(this.allAnswers);
    }

    getQuestionDetails(): void {
        if (this.phaseName && this.projectId) {
            //  this._http.getData('../../../../assets/mocks/questionMock_' + this.phaseName + '.json').subscribe(
            //    this._http.getData('../../../../npiui/assets/mocks/questionMock_' + this.phaseName + '.json').subscribe(
            if (this.questionDetails && this.questionDetails.length > 0
                && this.phaseName === this.questionDetails[0]['TAB_NAME']) {
                let order = this.activeTab[0]['ORDER'] || -1;
                let nextSubTab = this.questionDetails.find((a) => { return a.ORDER == order + 1 });
                this.activeTab = [];
                this.activeTab.push(nextSubTab);
                this.formAnswerForUI();
                this.formQuestionJson();
                this.formQuestionBioData();
                this.getTasks();
            } else {
                this._http.getData(`${questionairreURL}${this.phaseName}/${this.projectId}`).subscribe(
                    res => {
                        this.questionDetails = res;
                        console.log(this.questionDetails);
                        this.activeTab = [];
                        // this.questionDetails.sort(function(obj1, obj2) {
                        //   // Ascending: first age less than the previous
                        //   return obj1.ORDER - obj2.ORDER;
                        // });
                        for (let i = 0; i < this.questionDetails.length; i++) {
                            if (this.questionDetails[i]['TAB_NAME'] === this.openedTab['NAME']) {
                                this.activeTab.push(this.questionDetails[i]);
                            }
                        }
                        console.log('after sorting..', this.questionDetails);
                        // this.activeTab.push(this.questionDetails[0]);
                        this.formAnswerForUI();
                        this.formQuestionJson();
                        this.formQuestionBioData();
                        this.getTasks();
                    },
                    (error) => {
                        this.loading = false;
                        console.log('error fetching JSON');
                    });
            }
        }
    }

    formatDate(date1) {
        //console.log('format dat..', date1, this.datePipe.transform(date1, 'yyyy-MM-dd'));
        return this.datePipe.transform(date1, 'yyyy-MM-dd');
    }
    formatDateForPost(date1) {
        return this.datePipe.transform(date1, 'yyyy/MM/dd');
    }

    formQuestionBioData(): void {
        let questions = this.activeTab[0]['TAB_QUESTIONS'];
        for (let i = 0; i < questions.length; i++) {
            let temp = {
                'question_type': questions[i].QUESTION_TYPE,
            };
            this.questionBioData[questions[i].QUESTION_ID] = temp;
        }
        // console.log(this.questionBioData);
    }
    // previousTab(): void {
    //   console.log('previous clicked');
    //   console.log(this.storeAnswers);
    //   const ord = this.activeTab[0]['ORDER'];
    //   this.activeTab = [];
    //   this.activeTab.push(this.questionDetails[ord - 2]);
    // }
    // nextTab(): void {
    //   console.log('next clicked');
    //   console.log(this.storeAnswers);
    //   const ord = this.activeTab[0]['ORDER'];
    //   this.activeTab = [];
    //   this.activeTab.push(this.questionDetails[ord]);
    // }

    save(action): void {
        const status = this.checkConstraints();
        if (status === 'Fail') {
            return;
        }
        if (action === 'save') {
            this.formAnswers(action);
        } else if (action === 'submit') {
            this.formAnswers(action);
        }
    }
    selectAll(select: NgModel, values) {
        const lookupIds: any[] = [];
        const isObject = values.some(element => element['LOOKUP_ID'] != null);
        if (isObject) {
            for (let i = 0; i < values.length; i++) {
                lookupIds.push(values[i].LOOKUP_ID);
            }
        }
        select.update.emit(lookupIds);
    }

    checkConstraints(): string {
        // checks if all "required" questions have been answered
        const questions = this.activeTab[0]['TAB_QUESTIONS'];
        //console.log(questions);
        for (let i = 0; i < questions.length; i++) {
            const qid = questions[i]['QUESTION_ID'];
            console.log('question...', questions[i], 'answer..', this.storeAnswers[qid][0]);
            if (questions[i]['IS_MANDATORY'] === 'Y' && (this.storeAnswers[qid][0] === ''
                || this.storeAnswers[qid][0] === undefined || this.storeAnswers[qid][0] === null)) {
                alert('All * fields are required');
                return 'Fail';
            }
        }
        return 'Success';
    }

    ifDisabled(whoCanEdit): boolean {
        //console.log('type', type, 'whocanedit..', whoCanEdit, 'loggedInUser', localStorage.getItem('loggedInUser'));
        let dis = true;
        for (let i = 0; i < whoCanEdit.length; i++) {
            if (whoCanEdit[i]['OWNER'] === localStorage.getItem('loggedInUser')) {
                dis = false;
            }
        }
        return dis;
    }
    getDisabledClass(whoCanEdit) {// to disable the labels
        if (this.ifDisabled(whoCanEdit)) {
            return 'disableTool';
        }
    }

    getDisabledDiv(whoCanEdit) { // to disable the dropdowns and the multiselects
        if (this.ifDisabled(whoCanEdit)) {
            return 'disableMat';
        }
    }

    onModelChange(change, questionId, questionType, question) {
        this.setAnswer(questionId, change, questionType, question);
    }

    setAnswer(questionId, change, questionType, question) {
        let foundQuestionId = null;
        let foundTriggerID = null;  //Trigger ID in Trigger Details Found or Not
        let search = null           //Check For Trigger ID in Trigger Details Again [Overhead]
        this.storeAnswers[questionId][0] = change;//Not Used
        //Check for Question Details in triggeredQuestionInfo
        if (this.triggeredQuestionInfo.length) {
            foundTriggerID = question['TRIGGER_DETAILS'].find(x => x.IF_ANS_EQ === change);
            if (!foundTriggerID) {
                this.triggeredQuestionInfo['ANSWERS'] = change; //Update Question Details So no Need to Loop Through Again
                this.triggeredQuestionStatus = 1;
            }
            else { this.triggeredQuestionStatus = 2; } //Clear for not Triggerable Question
        }
        if (question['TRIGGER_DETAILS'].length > 0) {
            search = question['TRIGGER_DETAILS'].find(x => x.IF_ANS_EQ === change);
            if (search !== undefined && this.triggeredQuestionStatus == 0) {
                foundQuestionId = search['TRIGGER_QUESTION'];
                this.questionDetails.forEach(tab => {
                    tab['TAB_QUESTIONS'].forEach((question) => {
                        if (question['QUESTION_ID'] == foundQuestionId) {
                            if (this.oddQues.length === this.evenQues.length) { //Check for Last Question Pacement & Pushed it Accordingly
                                this.evenQues.push(question);
                                this.triggeredQuestionInfo.push({ 'QUESTION_ID': question['QUESTION_ID'], 'PLACEMENT': 'even', 'TRIGGERED_BY': question['PARENT_QUESTION_ID'], 'QUESTION_INDEX': this.evenQues.length - 1, 'ANSWERS': search['IF_ANS_EQ'] });
                            } else {
                                this.oddQues.push(question);
                                this.triggeredQuestionInfo.push({ 'QUESTION_ID': question['QUESTION_ID'], 'PLACEMENT': 'odd', 'TRIGGERED_BY': question['PARENT_QUESTION_ID'], 'QUESTION_INDEX': this.oddQues.length - 1, 'ANSWERS': search['IF_ANS_EQ'] });
                            }
                        } else { }
                    });
                });
            }
            else if (this.triggeredQuestionStatus == 2) { //2: Clear for all Non-Triggerable Options
                if (this.triggeredQuestionInfo.length > 0) {
                    this.triggeredQuestionInfo.forEach((triggeredQuestion, index) => {
                        if (questionId == triggeredQuestion['TRIGGERED_BY']) {
                            if (triggeredQuestion['PLACEMENT'] == 'even') {
                                this.evenQues.splice(triggeredQuestion['QUESTION_INDEX'], 1);
                                this.triggeredQuestionInfo.splice(index, 1);
                            } else {
                                this.oddQues.splice(triggeredQuestion['QUESTION_INDEX'], 1);
                                this.triggeredQuestionInfo.splice(index, 1);
                            }
                        } else { }
                    });
                } else { }
                this.triggeredQuestionStatus = 0;   //Reset it as for next Event
            }
        }
    }

    formAnswers(action): void {
        this.loading = true;
        let answers = [];
        let saveAnswers = {};
        saveAnswers['projectId'] = this.projectId;
        saveAnswers['loggedInUser'] = localStorage.getItem('loggedInUser');
        saveAnswers['workflowId'] = this.engagementId;
        saveAnswers['taskIds'] = this.activeTasks;
        saveAnswers['formAction'] = action;
        // if the task is alrdy completed sen 'save' so that jbpm service call is nt made again
        if (this.activeTasks[0]['STATUS'] === 'Completed') {
            saveAnswers['formAction'] = 'save';
        }
        //console.log('this.storeanswers..',this.storeAnswers);
        // tslint:disable-next-line:forin
        for (const key in this.storeAnswers) {
            let ans = {};
            if (this.allAnswers[key] === undefined) { // newly answered question
                console.log(key, this.storeAnswers[key]);
                if (this.storeAnswers[key][0] !== '') {// if new question has been answered
                    // create an object and push it to saveAnswers
                    if (this.questionBioData[key].question_type === 'Multiselect') {
                        for (let j = 0; j < this.storeAnswers[key].length; j++) {
                            if (this.storeAnswers[key][j].length !== 0) {
                                for (let k = 0; k < this.storeAnswers[key][j].length; k++) {
                                    ans = {
                                        'answerKey': null,
                                        'answer': null,
                                        'answerDate': null,
                                        'answerId': this.storeAnswers[key][j][key],
                                        'qId': +key,
                                        'flag': 'I'
                                    };
                                    answers.push(ans);
                                }
                            }
                        }
                    } else if (this.questionBioData[key].question_type === 'Text' || this.questionBioData[key].question_type === 'Paragraph') {
                        ans = {
                            'answerKey': null,
                            'answer': this.storeAnswers[key][0],
                            'answerId': null,
                            'answerDate': null,
                            'qId': +key,
                            'flag': 'I'
                        };
                        answers.push(ans);
                    } else if (this.questionBioData[key].question_type === 'Date') {
                        ans = {
                            'answerKey': null,
                            'answer': null,
                            'answerDate': this.formatDateForPost(this.storeAnswers[key][0]),
                            'answerId': null,
                            'qId': +key,
                            'flag': 'I'
                        };
                        answers.push(ans);
                    } else {// Dropdown/Radio
                        ans = {
                            'answerKey': null,
                            'answer': null,
                            'answerId': this.storeAnswers[key][0],
                            'answerDate': null,
                            'qId': +key,
                            'flag': 'I'
                        };
                        answers.push(ans);
                    }
                }
            } else {
                // alrdy answered, so match it with UI answer and push if it has been changed
                console.log(key);
                let prev;
                if (this.allAnswers[key][0]['questionType'] === 'Multiselect') {
                    prev = [];
                    for (let j = 0; j < this.allAnswers[key].length; j++) {
                        prev.push(this.allAnswers[key][j]['answerId']);
                    }
                    console.log('prev', prev);
                    const deletedOptions = prev.filter(item => this.storeAnswers[key][0].indexOf(item) < 0);
                    const addedOptions = this.storeAnswers[key][0].filter(item => prev.indexOf(item) < 0);
                    console.log('deletedOptions', deletedOptions);
                    console.log('addedOptions', addedOptions);
                    let myAnswers = this.allAnswers[key];
                    deletedOptions.forEach(function (value) {
                        myAnswers.forEach(function (val) {// to find the answerKey of the deleted answer
                            if (val.answerId === value) {
                                ans = {
                                    'answerKey': val.answerKey,
                                    'answer': null,
                                    'answerDate': null,
                                    'answerId': value,
                                    'qId': +key,
                                    'flag': 'D'
                                };
                            }
                        });
                        answers.push(ans);
                    });
                    addedOptions.forEach(function (value) {
                        ans = {
                            'answerKey': null,
                            'answer': null,
                            'answerId': value,
                            'answerDate': null,
                            'qId': +key,
                            'flag': 'U'
                        };
                        answers.push(ans);
                    });
                } else if (this.allAnswers[key][0]['questionType'] === 'Text' || this.allAnswers[key][0]['questionType'] === 'Paragraph') {
                    prev = this.allAnswers[key][0]['answer'];
                    if (prev !== this.storeAnswers[key][0]) {
                        ans = {
                            'answerKey': this.allAnswers[key][0]['answerKey'],
                            'answerId': null,
                            'answer': this.storeAnswers[key][0],
                            'answerDate': null,
                            'qId': +key,
                            'flag': 'U'
                        };
                        answers.push(ans);
                    }
                } else if (this.allAnswers[key][0]['questionType'] === 'Date') {
                    prev = this.allAnswers[key][0]['answerDate'];
                    // console.log("prev date..", prev);
                    // console.log("this.storeAnswers[key][0] date..", this.storeAnswers[key][0]);
                    if (prev !== this.storeAnswers[key][0]) {
                        ans = {
                            'answerKey': this.allAnswers[key][0]['answerKey'],
                            'answer': null,
                            'answerId': null,
                            'answerDate': this.formatDateForPost(this.storeAnswers[key][0]),
                            'qId': +key,
                            'flag': 'U'
                        };
                        answers.push(ans);
                    }
                } else {// dropdown,radio
                    prev = this.allAnswers[key][0]['answerId'];
                    // console.log("prev radio/dropdown..", prev);
                    // console.log("this.storeAnswers[key][0] radio/dropdown..", this.storeAnswers[key][0]);
                    if (prev !== this.storeAnswers[key][0]) {
                        ans = {
                            'answerKey': this.allAnswers[key][0]['answerKey'],
                            'answer': null,
                            'answerDate': null,
                            'answerId': this.storeAnswers[key][0],
                            'qId': key,
                            'flag': 'U'
                        };
                        answers.push(ans);
                    }
                }
            }
        }
        saveAnswers['answers'] = answers;
        console.log('saveAnswers...', saveAnswers);
        // call POST answer service with "saveAnswers"
        this._http.postData(`${saveAnswerURL}`, saveAnswers).subscribe(
            (data) => {
                console.log('result after saving is..', data.status);
                this.loading = false;
                if (action === 'submit') {
                    // go to next tab or phase
                    let index;
                    // tslint:disable-next-line:forin
                    for (let x in this.tabs) { // x is a string
                        if (this.tabs[+x]['PHASE'].replace(/ +/g, '') === this.phaseName) {
                            this.nextPhase = this.tabs[+x + 1]['PHASE'];
                            this.nextPhase = this.nextPhase.replace(/ +/g, '');
                            index = +x;
                        }
                    }
                    const ord = this.activeTab[0]['ORDER'];
                    if (ord < this.tabs[index]['TABS'].length) {
                        console.log('.................Tab change...................');
                        //this.activeTab = [];
                        //this.activeTab.push(this.questionDetails[ord]);
                        this.formAnswerForUI();
                        this.formQuestionJson();
                        this.formQuestionBioData();
                        this.getTasks();
                        console.log('Active tab in change task is', this.activeTab);
                        this.getPhase.emit({ task: 'changeTask', next: this.tabs[index]['TABS'][ord] });
                    } else {
                        console.log('.................Phase change...................');
                        // this._route.navigate(['/NPI/workflow/questions', this.projectId, this.engagementId, this.nextPhase]);
                        this.getPhase.emit({ task: 'changePhase', next: this.nextPhase });
                    }
                }
            },
            (error) => {
                this.loading = false;
                console.log('error retruning from post answers')
            }
        );
    }


}
