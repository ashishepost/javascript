setAnswer(questionId,change, questionType, question) {
  // Trigger 
   let foundQuestionId = null; 
   let foundTriggerID = null;     //Trigger ID in Trigger Details Found or Not
   this.storeAnswers[questionId][0] = change;  //Not Used
   if(this.triggeredQuestionInfo.length){
     foundTriggerID = question['TRIGGER_DETAILS'].find(x => x.IF_ANS_EQ === change);
        if(foundTriggerID != undefined){  
          this.triggeredQuestionInfo['ANSWERS'] = change;  //Update Question Details So no Need to Loop Through Again
          this.triggeredQuestionStatus = 1;
      }
      else { this.triggeredQuestionStatus = 2; }  //Clear for non-Triggerable Question
  }
   if ( question['TRIGGER_DETAILS'].length > 0 ) {
      let search = question['TRIGGER_DETAILS'].find(x => x.IF_ANS_EQ === change);
      if ( search !== undefined && this.triggeredQuestionStatus == 0) {
        foundQuestionId =  search['TRIGGER_QUESTION'];    
        this.questionDetails.forEach(tab => {
          tab['TAB_QUESTIONS'].forEach((question) => {
            if (question['QUESTION_ID'] == foundQuestionId ) {
              if (this.oddQues.length === this.evenQues.length) {  //Check for Last Question Pacement & Pushed it Accordingly
                this.evenQues.push(question);
                this.triggeredQuestionInfo.push({'QUESTION_ID':question['QUESTION_ID'], 'PLACEMENT':'even', 'TRIGGERED_BY':question['PARENT_QUESTION_ID'], 'QUESTION_INDEX':this.evenQues.length - 1, 'ANSWERS':search['IF_ANS_EQ']});
              } else {
                this.oddQues.push(question);
                this.triggeredQuestionInfo.push({'QUESTION_ID':question['QUESTION_ID'], 'PLACEMENT':'odd', 'TRIGGERED_BY':question['PARENT_QUESTION_ID'], 'QUESTION_INDEX':this.oddQues.length - 1, 'ANSWERS':search['IF_ANS_EQ']});
              }
            } else { }
          });
        });   
      }  
      else if(this.triggeredQuestionStatus == 2) {  //2: Clear for all Non-Triggerable Options
        if ( this.triggeredQuestionInfo.length > 0) {
          this.triggeredQuestionInfo.forEach((triggeredQuestion,index) => {
            if (questionId == triggeredQuestion['TRIGGERED_BY']) {
              if ( triggeredQuestion['PLACEMENT'] == 'even') { 
                  this.evenQues.splice(triggeredQuestion['QUESTION_INDEX'] , 1);
                  this.triggeredQuestionInfo.splice(index, 1);
                  this.storeAnswers[question['TRIGGER_DETAILS'][question['TRIGGER_DETAILS'].length-1]['TRIGGER_QUESTION']] = ['']; 
                //  delete this.storeAnswers[question['TRIGGER_DETAILS'][question['TRIGGER_DETAILS'].length-1]['TRIGGER_QUESTION']];                
              } else {
                this.oddQues.splice(triggeredQuestion['QUESTION_INDEX'] , 1);
                this.triggeredQuestionInfo.splice(index, 1);       
                this.storeAnswers[question['TRIGGER_DETAILS'][question['TRIGGER_DETAILS'].length-1]['TRIGGER_QUESTION']] = ['']; 
                //  delete this.storeAnswers[question['TRIGGER_DETAILS'][question['TRIGGER_DETAILS'].length-1]['TRIGGER_QUESTION']];                       
              }
            } else { }
          });
        } else { }
        this.triggeredQuestionStatus = 0;  //Reset it as for next time
      }
   }
}