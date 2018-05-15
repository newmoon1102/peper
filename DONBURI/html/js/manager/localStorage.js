var localDb = {};
localDb.userInfo = {};


const kSetupInfoIpadIpAddress			 			 = "kSetupInfoIpadIpAddress";
const kSetupInfoIpadPort			 			 	 = "kSetupInfoIpadPort";

const kUserInfoSelectedBumonId			 			 = "kUserInfoSelectedBumonId";
const kUserInfoSelectedBumonName					 = "kUserInfoSelectedBumonName";
const kUserInfoSelectedEmployeeId					 = "kUserInfoSelectedEmployeeId";
const kUserInfoSelectedEmployeeName					 = "kUserInfoSelectedEmployeeName";
const kUserInfoSelectedEmployeeYomi					 = "kUserInfoSelectedEmployeeYomi";

const kUserInfoSelectedCurrentQuestionId        	 = "kUserInfoSelectedCurrentQuestionId";
const kUserInfoSelectedCurrentQuestionContents  	 = "kUserInfoSelectedCurrentQuestionContents";
const kUserInfoSelectedCurrentQuestionAnswerId		 = "kUserInfoSelectedCurrentQuestionAnswerId";
const kUserInfoSelectedCurrentQuestionAnswerContents = "kUserInfoSelectedCurrentQuestionAnswerContents";
const kUserInfoSelectedCurrentNextQuestionId 		 = "kUserInfoSelectedCurrentNextQuestionId";

const kUserInfoIsSuccessCallEmployeeNoAppo	 		 = "kUserInfoIsSuccessCallEmployeeNoAppo";
const kUserInfoDirectToInterviewFromScreen	 		 = "kUserInfoDirectToInterviewFromScreen";


/* Set value for variable */
localDb.userInfo.setIpadIpAddress = function(value){
	localStorage.setItem(kSetupInfoIpadIpAddress, value);
}

localDb.userInfo.setIpadPort = function(value){
	localStorage.setItem(kSetupInfoIpadPort, value);
}

localDb.userInfo.setSelectedBumonId = function(value) {
	localStorage.setItem(kUserInfoSelectedBumonId, value);
}
localDb.userInfo.setSelectedBumonName = function(value) {
	localStorage.setItem(kUserInfoSelectedBumonName, value);
}

localDb.userInfo.setSelectedEmployeeId = function(value){
	localStorage.setItem(kUserInfoSelectedEmployeeId, value);
}
localDb.userInfo.setSelectedEmployeeName = function(value){
	localStorage.setItem(kUserInfoSelectedEmployeeName, value);
}
localDb.userInfo.setSelectedEmployeeYomi = function(value){
	localStorage.setItem(kUserInfoSelectedEmployeeYomi, value);
}

localDb.userInfo.setSelectedCurrentQuestionId = function(value){
	localStorage.setItem(kUserInfoSelectedCurrentQuestionId, value);
}
localDb.userInfo.setSelectedCurrentQuestionContents = function(value){
	localStorage.setItem(kUserInfoSelectedCurrentQuestionContents, value)
}
localDb.userInfo.setSelectedCurrentQuestionAnswerId = function(value){
	localStorage.setItem(kUserInfoSelectedCurrentQuestionAnswerId, value);
}
localDb.userInfo.setSelectedCurrentQuestionAnswerContents = function(value){
	localStorage.setItem(kUserInfoSelectedCurrentQuestionAnswerContents, value);
}
localDb.userInfo.setSelectedCurrentNextQuestionId = function(value){
	localStorage.setItem(kUserInfoSelectedCurrentNextQuestionId, value);
}


localDb.userInfo.setUserInfoIsSuccessCallEmployeeNoAppo = function(value , callbackFunc){
	localStorage.setItem(kUserInfoIsSuccessCallEmployeeNoAppo, value);
	callbackFunc();
}
localDb.userInfo.setUserInfoDirectToInterviewFromScreen = function(value , callbackFunc){
	localStorage.setItem(kUserInfoDirectToInterviewFromScreen, value);
	callbackFunc();
}


/* Get value for variable */
localDb.userInfo.getIpadIpAddress = function(callbackFunc){
	var value = localStorage.getItem(kSetupInfoIpadIpAddress);
	callbackFunc(value);
}

localDb.userInfo.getIpadPort = function(callbackFunc){
	var value = localStorage.getItem(kSetupInfoIpadPort);
	callbackFunc(value);
}

localDb.userInfo.getSelectedBumonId = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedBumonId);
	callbackFunc(value);
}
localDb.userInfo.getSelectedBumonName = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedBumonName);
	callbackFunc(value);
}

localDb.userInfo.getSelectedEmployeeId = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedEmployeeId);
	callbackFunc(value);
}
localDb.userInfo.getSelectedEmployeeName = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedEmployeeName);
	callbackFunc(value);
}
localDb.userInfo.getSelectedEmployeeYomi = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedEmployeeYomi);
	callbackFunc(value);
}

localDb.userInfo.getSelectedCurrentQuestionId = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedCurrentQuestionId);
	callbackFunc(value);
}
localDb.userInfo.getSelectedCurrentQuestionContents = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedCurrentQuestionContents);
	callbackFunc(value);
}
localDb.userInfo.getSelectedCurrentQuestionAnswerId = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedCurrentQuestionAnswerId);
	callbackFunc(value);
}
localDb.userInfo.getSelectedCurrentQuestionAnswerContents = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedCurrentQuestionAnswerContents);
	callbackFunc(value);
}
localDb.userInfo.getSelectedCurrentNextQuestionId = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoSelectedCurrentNextQuestionId);
	callbackFunc(value);
}


localDb.userInfo.getUserInfoIsSuccessCallEmployeeNoAppo = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoIsSuccessCallEmployeeNoAppo);
	callbackFunc(value);
}
localDb.userInfo.getUserInfoDirectToInterviewFromScreen = function(callbackFunc){
	var value = localStorage.getItem(kUserInfoDirectToInterviewFromScreen);
	callbackFunc(value);
}