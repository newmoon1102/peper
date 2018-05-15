var qiSession = new QiSession();
var maxPaging = 1;
var currentPaging = 1;
var numRowInAPaging = 2;
var arrInterviewResults = [];
var strJsonInterviewResults = '{"StatusCode":61,"Data":""}';
function initData() {
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.subscriber("OADonburi/Main/ShowWaitingView").then(function (subscriber) {
          subscriber.signal.connect(function (status) {
                window.location.assign("main.html");
          });
        });
        ALMemory.raiseEvent("OADonburi/Result/Interpret", "").then(function (ALMemory) {});
    });

    donburi.webdb.open();
    donburi.webdb.getArrInterviewResults(function(tx, results){
        var arrJsonResult = [];
        for (var i = 0; i < results.rows.length; i++) {
            var result = results.rows.item(i);

            var jsonResult = new Object();
            jsonResult.question_id = result.questionId;
            jsonResult.answer_id   = result.answerId;
            arrJsonResult.push(jsonResult);

            if (!isEmptyOrSpaces(result.resultContents)){
                arrInterviewResults.push(result);
            }
        }
         
        var jsonRequest = new Object();
        jsonRequest.StatusCode = 61;
        jsonRequest.Data       = arrJsonResult;

        strJsonInterviewResults= JSON.stringify(jsonRequest);

        maxPaging = Math.ceil(arrInterviewResults.length/numRowInAPaging);
        displayData(currentPaging, arrInterviewResults);
    });
}

function displayData(currentPage, arrResults){
    donburi.webdb.open();
    drawPagingView();
    
    if (currentPage == maxPaging && arrResults.length%2) { // Only one row in page
        var index = currentPage*numRowInAPaging - numRowInAPaging;
        var result = arrResults[index];
        if (document.getElementById('result_row_2').classList.contains('show-result-row')){
            document.getElementById('result_row_2').classList.remove('show-result-row');
            document.getElementById('result_row_2').classList.add('hide-result-row');
        }
        if (document.getElementById('result_row_1').classList.contains('hide-result-row')){
            document.getElementById('result_row_1').classList.remove('hide-result-row');
        }
        document.getElementById('result_row_1').classList.add('show-result-row');

        donburi.webdb.getQuestionItemWithId(result.questionId, function(tx, results){
            if (results.rows.length > 0) {
                var question = results.rows.item(0);
                document.getElementById("result_row_1_question").innerHTML = question.contents;
            }
        });

        donburi.webdb.getAnswerItemWithId(result.answerId, function(tx, results){
            if (results.rows.length > 0) {
                var answer = results.rows.item(0);
                document.getElementById("result_row_1_answer").innerHTML = answer.resultContents;
                donburi.webdb.getImageItemWithId(answer.resultImageId, function(tx, results){
                    if (results.rows.length > 0) {
                        var image = results.rows.item(0);
                        document.getElementById("result_row_1_image").src = image.url;
                    }
                });
            }
        });
        
    }else if(arrResults.length > 0){ // Have two row in page
        var index = currentPage*numRowInAPaging - numRowInAPaging;
        var r1 = arrResults[index];
        var r2 = arrResults[index+1];
        if (document.getElementById('result_row_1').classList.contains('hide-result-row')){
            document.getElementById('result_row_1').classList.remove('hide-result-row');
        }
        if (document.getElementById('result_row_2').classList.contains('hide-result-row')){
            document.getElementById('result_row_2').classList.remove('hide-result-row');
        }
        document.getElementById('result_row_1').classList.add('show-result-row');
        document.getElementById('result_row_2').classList.add('show-result-row');
        donburi.webdb.getQuestionItemWithId(r1.questionId, function(tx, results){
            if (results.rows.length > 0) {
                var question = results.rows.item(0);
                document.getElementById("result_row_1_question").innerHTML = question.contents;
            }
        });

        donburi.webdb.getAnswerItemWithId(r1.answerId, function(tx, results){
            if (results.rows.length > 0) {
                var answer = results.rows.item(0);
                document.getElementById("result_row_1_answer").innerHTML = answer.resultContents;
                donburi.webdb.getImageItemWithId(answer.resultImageId, function(tx, results){
                    if (results.rows.length > 0) {
                        var image = results.rows.item(0);
                        document.getElementById("result_row_1_image").src = image.url;
                    }
                });
            }
        });

        donburi.webdb.getQuestionItemWithId(r2.questionId, function(tx, results){
            if (results.rows.length > 0) {
                var question = results.rows.item(0);
                document.getElementById("result_row_2_question").innerHTML = question.contents;
            }
        });

        donburi.webdb.getAnswerItemWithId(r2.answerId, function(tx, results){
            if (results.rows.length > 0) {
                var answer = results.rows.item(0);
                document.getElementById("result_row_2_answer").innerHTML = answer.resultContents;
                donburi.webdb.getImageItemWithId(answer.resultImageId, function(tx, results){
                    if (results.rows.length > 0) {
                        var image = results.rows.item(0);
                        document.getElementById("result_row_2_image").src = image.url;
                    }
                });
            }
        });
    }
}
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}
function drawPagingView(){
   if (currentPaging == 1 && maxPaging > currentPaging){ // First page
        if (document.getElementById('btn_scroll_previous').classList.contains('btn_enable')){
            document.getElementById('btn_scroll_previous').classList.remove('btn_enable');
        }
        if (document.getElementById('btn_scroll_next').classList.contains('btn_disable')){
            document.getElementById('btn_scroll_next').classList.remove('btn_disable');
        }
        document.getElementById('btn_scroll_previous').classList.add('btn_disable');
        document.getElementById('btn_scroll_next').classList.add('btn_enable');
    }else if (currentPaging == maxPaging && maxPaging > 1) { // Last page
        if (document.getElementById('btn_scroll_previous').classList.contains('btn_disable')){
            document.getElementById('btn_scroll_previous').classList.remove('btn_disable');
        }
        if (document.getElementById('btn_scroll_next').classList.contains('btn_enable')){
            document.getElementById('btn_scroll_next').classList.remove('btn_enable');
        }
        document.getElementById('btn_scroll_previous').classList.add('btn_enable');
        document.getElementById('btn_scroll_next').classList.add('btn_disable');
    }else if (currentPaging == 1 && currentPaging == maxPaging) { // One page
        if (document.getElementById('btn_scroll_previous').classList.contains('btn_enable')){
            document.getElementById('btn_scroll_previous').classList.remove('btn_enable');
        }
        if (document.getElementById('btn_scroll_next').classList.contains('btn_enable')){
            document.getElementById('btn_scroll_next').classList.remove('btn_enable');
        }
        document.getElementById('btn_scroll_previous').classList.add('btn_disable');
        document.getElementById('btn_scroll_next').classList.add('btn_disable');
    }else{ // More page
        if (document.getElementById('btn_scroll_previous').classList.contains('btn_disable')){
            document.getElementById('btn_scroll_previous').classList.remove('btn_disable');
        }
        if (document.getElementById('btn_scroll_next').classList.contains('btn_disable')){
            document.getElementById('btn_scroll_next').classList.remove('btn_disable');
        }
        document.getElementById('btn_scroll_previous').classList.add('btn_enable');
        document.getElementById('btn_scroll_next').classList.add('btn_enable');
    } 
}

$(function() {
	var btnNavConfirmEl = document.getElementById('btn_nav_confirm');
    var btnNavFinishEl = document.getElementById('btn_nav_finish');
    var btnScrollPreEl = document.getElementById('btn_scroll_previous');
    var btnScrollNextEl = document.getElementById('btn_scroll_next');

    var result_row_1_answer_el = document.getElementById('result_row_1_answer');
    var result_row_2_answer_el = document.getElementById('result_row_2_answer');

    FastClick.attach(btnNavConfirmEl);
    FastClick.attach(btnNavFinishEl);
    FastClick.attach(btnScrollPreEl);
    FastClick.attach(btnScrollNextEl);

    FastClick.attach(result_row_1_answer_el);
    FastClick.attach(result_row_2_answer_el);

    btnNavConfirmEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Result/BtnNavBackClick", "戻る").then(function (ALMemory) {
                window.location.assign("confirm.html");
            });
        });
    }, false);
    
    btnNavFinishEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Result/BtnNavFinishClick", "終了").then(function (ALMemory) {
                
            });
        });

        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/SocketListener/SendAllResults", strJsonInterviewResults).then(function (ALMemory) {
                window.location.assign("main.html");
            });
        });

    }, false);

    btnScrollPreEl.addEventListener('touchend', function(event) {
        // Scroll previous
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Result/BtnPreClick", "前へ").then(function (ALMemory) {
                if (currentPaging > 1) {
                    currentPaging--;
                    displayData(currentPaging, arrInterviewResults);
                }
            });
        });

    }, false);

    btnScrollNextEl.addEventListener('touchend', function(event) {
        // Scroll next
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Result/BtnNextClick", "次へ").then(function (ALMemory) {
                if (currentPaging < maxPaging) {
                    currentPaging++;
                    displayData(currentPaging, arrInterviewResults);
                }
            });
        });

    }, false);

    result_row_1_answer_el.addEventListener('touchend', function(event) {
        var result1Contents = document.getElementById("result_row_1_answer").innerHTML;
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Result/InterpretQuestion", result1Contents).then(function (ALMemory) {
            });
        });
    }, false);

    result_row_2_answer_el.addEventListener('touchend', function(event) {
        var result2Contents = document.getElementById("result_row_2_answer").innerHTML;
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Result/InterpretQuestion", result2Contents).then(function (ALMemory) {
            });
        });
    }, false);
});