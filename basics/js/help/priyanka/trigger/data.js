//question details
allQuestions = [
  {
    "TAB_NAME": "SmartAgentReadiness",
    "DISPLAY_NAME": "Smart Agent Readiness",
    "TAB_ID": 3,
    "ORDER": 1,
    "TAB_HEADER": null,
    "TAB_HEADER_INFO": null,
    "TAB_QUESTIONS": [
      {
        "QUESTION_ID": 6,
        "QUESTION": "Engineering Interlocks",
        "QUESTION_TYPE": "Date",
        "PARENT_QUESTION_ID": null,
        "REQ_TRIGGERING": "null",
        "IS_MANDATORY": "N",
        "HELP_TEXT": null,
        "TASK_NAME": "Smart Agent Readiness",
        "WHO_CAN_EDIT": [],
        "POSSIBLE_ANSWERS": [],
        "TRIGGER_DETAILS": [],
        "ANSWER_DETAILS": []
      },
      {
        "QUESTION_ID": 7,
        "QUESTION": "Engineering Response",
        "QUESTION_TYPE": "Date",
        "PARENT_QUESTION_ID": null,
        "REQ_TRIGGERING": "null",
        "IS_MANDATORY": "N",
        "HELP_TEXT": null,
        "TASK_NAME": "Smart Agent Readiness",
        "WHO_CAN_EDIT": [],
        "POSSIBLE_ANSWERS": [],
        "TRIGGER_DETAILS": [],
        "ANSWER_DETAILS": []
      },
      {
        "QUESTION_ID": 8,
        "QUESTION": "Committed",
        "QUESTION_TYPE": "Date",
        "PARENT_QUESTION_ID": null,
        "REQ_TRIGGERING": "null",
        "IS_MANDATORY": "N",
        "HELP_TEXT": null,
        "TASK_NAME": "Smart Agent Readiness",
        "WHO_CAN_EDIT": [],
        "POSSIBLE_ANSWERS": [],
        "TRIGGER_DETAILS": [],
        "ANSWER_DETAILS": []
      },
      {
        "QUESTION_ID": 9,
        "QUESTION": "Code Integration",
        "QUESTION_TYPE": "Date",
        "PARENT_QUESTION_ID": null,
        "REQ_TRIGGERING": "null",
        "IS_MANDATORY": "N",
        "HELP_TEXT": null,
        "TASK_NAME": "Smart Agent Readiness",
        "WHO_CAN_EDIT": [],
        "POSSIBLE_ANSWERS": [],
        "TRIGGER_DETAILS": [],
        "ANSWER_DETAILS": []
      },
      {
        "QUESTION_ID": 10,
        "QUESTION": "Demo Completed",
        "QUESTION_TYPE": "Date",
        "PARENT_QUESTION_ID": null,
        "REQ_TRIGGERING": "null",
        "IS_MANDATORY": "N",
        "HELP_TEXT": null,
        "TASK_NAME": "Smart Agent Readiness",
        "WHO_CAN_EDIT": [],
        "POSSIBLE_ANSWERS": [],
        "TRIGGER_DETAILS": [],
        "ANSWER_DETAILS": []
      },
      {
        "QUESTION_ID": 11,
        "QUESTION": "Production Testing",
        "QUESTION_TYPE": "Date",
        "PARENT_QUESTION_ID": null,
        "REQ_TRIGGERING": "null",
        "IS_MANDATORY": "N",
        "HELP_TEXT": null,
        "TASK_NAME": "Smart Agent Readiness",
        "WHO_CAN_EDIT": [],
        "POSSIBLE_ANSWERS": [],
        "TRIGGER_DETAILS": [],
        "ANSWER_DETAILS": []
      },
      {
        "QUESTION_ID": 12,
        "QUESTION": "Integration Complete",
        "QUESTION_TYPE": "Date",
        "PARENT_QUESTION_ID": null,
        "REQ_TRIGGERING": "null",
        "IS_MANDATORY": "N",
        "HELP_TEXT": null,
        "TASK_NAME": "Smart Agent Readiness",
        "WHO_CAN_EDIT": [],
        "POSSIBLE_ANSWERS": [],
        "TRIGGER_DETAILS": [],
        "ANSWER_DETAILS": []
      },
      {
        "QUESTION_ID": 13,
        "QUESTION": "Release Activities",
        "QUESTION_TYPE": "Date",
        "PARENT_QUESTION_ID": null,
        "REQ_TRIGGERING": "null",
        "IS_MANDATORY": "N",
        "HELP_TEXT": null,
        "TASK_NAME": "Smart Agent Readiness",
        "WHO_CAN_EDIT": [],
        "POSSIBLE_ANSWERS": [],
        "TRIGGER_DETAILS": [],
        "ANSWER_DETAILS": []
      },
      {
        "QUESTION_ID": 14,
        "QUESTION": "Status",
        "QUESTION_TYPE": "Dropdown",
        "PARENT_QUESTION_ID": null,
        "REQ_TRIGGERING": "null",
        "IS_MANDATORY": "N",
        "HELP_TEXT": null,
        "TASK_NAME": "Smart Agent Readiness",
        "WHO_CAN_EDIT": [],
        "POSSIBLE_ANSWERS": [
          {
            "LOOKUP_ID": 94,
            "LOOKUP_VALUE": "Initiated"
          },
          {
            "LOOKUP_ID": 95,
            "LOOKUP_VALUE": "GA"
          },
          {
            "LOOKUP_ID": 96,
            "LOOKUP_VALUE": "On Hold"
          },
          {
            "LOOKUP_ID": 97,
            "LOOKUP_VALUE": "Waiver"
          },
          {
            "LOOKUP_ID": 98,
            "LOOKUP_VALUE": "Exception"
          },
          {
            "LOOKUP_ID": 99,
            "LOOKUP_VALUE": "Complete"
          },
          {
            "LOOKUP_ID": 100,
            "LOOKUP_VALUE": "Not Applicable"
          }
        ],
        "TRIGGER_DETAILS": [
          {
            "IF_ANS_EQ": 97,
            "TRIGGER_QUESTION": 10
          },
          {
            "IF_ANS_EQ": 98,
            "TRIGGER_QUESTION": 9
          },
          {
            "IF_ANS_EQ": 99,
            "TRIGGER_QUESTION": 10
          }
        ],
        "ANSWER_DETAILS": []
      }
    ]
  }
]
// for odd
triggerQues = [
    {
      "QUESTION_ID": 9,
      "ODD": true
    }
  ]
  
  
  
 triggerQues =  [
    {
      "QUESTION_ID": 9,
      "ODD": true
    },
    {
      "QUESTION_ID": 9,
      "EVEN": true
    }
  ]