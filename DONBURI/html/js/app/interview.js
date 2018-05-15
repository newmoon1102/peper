var qiSession = new QiSession();
var timerSelected;
var currentQuestionId = 0;
var currentAnswerId = -1;
var currentAction = '{"MotionId":0,"Speech":""}';
var nexQuestionId = -1;
var arrAnswer = [];
var numberPaging = 0;
var currentPaging = 1;
var numCellOfRow = 4;

function initData() {
    localDb.userInfo.getUserInfoDirectToInterviewFromScreen(function(value){
        donburi.webdb.open();
        if (value == "DirectToInterviewFromManagementView") {
            donburi.webdb.createInterviewResultTbl();
            showQuestion(1);
        }else{ // value = DirectToInterviewFromConfirmView
            donburi.webdb.getInterviewResultLast(function(tx, results){
                if (results.rows.length > 0) {
                    var result = results.rows.item(0);
                    showQuestion(result.questionId); // Last Question
                }
            });
        }
    });

    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.subscriber("OADonburi/Interview/TalkAnswerFinished").then(function (subscriber) {
            subscriber.signal.connect(function () {
                fnProccessRequirementAfterSelectAnswer();
            });
        });
        ALMemory.subscriber("OADonburi/Main/ShowWaitingView").then(function (subscriber) {
          subscriber.signal.connect(function (status) {
                window.location.assign("main.html");
          });
        });
    });
}

function sendSocketCurrentQuestionAndAnswer(questionId, answerId){
    var jsonQuestionAnswer = '{"StatusCode":60,"QuestionID":'+questionId+ ',"AnswerID":'+answerId+'}';
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.raiseEvent("OADonburi/SocketListener/SendCurrentResult", jsonQuestionAnswer).then(function (ALMemory) {
            //
        });
    });
}

function showQuestion(questionId){
    currentQuestionId = questionId;
    donburi.webdb.getInterviewResultWithQuestionId(currentQuestionId, function(tx, results){
        if(results.rows.length > 0){ 
            currentAnswerId = results.rows.item(0).answerId;
            nextQuestionId = results.rows.item(0).nextQuestionId;
        }else{ 
            currentAnswerId = -1; // -1 : Don't select answer
            nextQuestionId = -1;
        }
    });
    
    arrAnswer = [];
    currentPaging = 1;
    donburi.webdb.open();
    donburi.webdb.getQuestionItemWithId(currentQuestionId, function(tx, results){
        if (results.rows.length > 0) {
            var question = results.rows.item(0);
            donburi.webdb.getImageItemWithId(question.imageId, function(tx, results){
                if (results.rows.length > 0) {
                    var image = results.rows.item(0);
                    document.getElementById("question-image").src = image.url;
                }
            });
            $("#question_contents").empty();
            $("#question_contents").html(question.contents);
            sendSocketCurrentQuestionAndAnswer(currentQuestionId, currentAnswerId); 

            currentAction = '{"MotionId":'+question.motionId+ ',"Speech":"'+question.speech+'"}';
            var delayMillis = 10; // wait 10 minisecond
            setTimeout(function() {
                qiSession.service("ALMemory").then(function (ALMemory) {
                    ALMemory.raiseEvent("OADonburi/Interview/StartQuestion", currentAction).then(function (ALMemory) {
                    });
                });
            }, delayMillis);
        }
    });

    donburi.webdb.getAnswerItemsWithQuestionId(currentQuestionId, function(tx, results){

        for (var i = 0; i < results.rows.length; i++) {
            var answer = results.rows.item(i);
            arrAnswer.push(answer);
        }
        var numberCell = arrAnswer.length;
        numberPaging = Math.ceil(numberCell/numCellOfRow);
        showAnswerGridView(currentPaging, arrAnswer);
    });
}

function drawPagingView(){
   if (currentPaging == 1 && numberPaging > currentPaging){ // First page
        if (document.getElementById('btn_scroll_previous').classList.contains('btn_enable')){
            document.getElementById('btn_scroll_previous').classList.remove('btn_enable');
        }
        if (document.getElementById('btn_scroll_next').classList.contains('btn_disable')){
            document.getElementById('btn_scroll_next').classList.remove('btn_disable');
        }
        document.getElementById('btn_scroll_previous').classList.add('btn_disable');
        document.getElementById('btn_scroll_next').classList.add('btn_enable');
    }else if (currentPaging == numberPaging && numberPaging > 1) { // Last page
        if (document.getElementById('btn_scroll_previous').classList.contains('btn_disable')){
            document.getElementById('btn_scroll_previous').classList.remove('btn_disable');
        }
        if (document.getElementById('btn_scroll_next').classList.contains('btn_enable')){
            document.getElementById('btn_scroll_next').classList.remove('btn_enable');
        }
        document.getElementById('btn_scroll_previous').classList.add('btn_enable');
        document.getElementById('btn_scroll_next').classList.add('btn_disable');
    }else if (currentPaging == 1 && currentPaging == numberPaging) { // One page
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

function showAnswerGridView(paging, arrData){
    $("#answer_container").empty();
    drawPagingView();
    
    var idxCellStart = (paging - 1)*numCellOfRow;
    var idxCellEnd = arrData.length - 1;
    if (arrData.length > idxCellStart + numCellOfRow) {
        idxCellEnd = idxCellStart + numCellOfRow - 1;
    }
    for (var i = idxCellStart; i <= idxCellEnd; i++) {
        var answer = arrData[i];
        if (answer.id == currentAnswerId) {
            if (answer.imageId != -1) {
                var answer_container = $("#answer_container").append($("<button id='gridview_cell_"+i+"' value='"+answer.questionId+"_"+answer.id+"_"+answer.nextQuestionId+"_"+answer.resultContents+"' class='col-sm-2 gridview-cell-selected'></button>")
                                                         .html('<img id="gridview_cell_image_'+answer.imageId+'" class="gridview-cell-image" src="Assets/image/pepper_monshin.png"/><p>' + answer.contents + '</p>'));
                $("tbody").append(answer_container);
            }else{
                var answer_container = $("#answer_container").append($("<button id='gridview_cell_"+i+"' value='"+answer.questionId+"_"+answer.id+"_"+answer.nextQuestionId+"_"+answer.resultContents+"' class='col-sm-2 gridview-cell-selected'></button>")
                                                         .html('<p>' + answer.contents + '</p>'));
                $("tbody").append(answer_container);
            }
        }else{
            if (answer.imageId != -1) {
                var answer_container = $("#answer_container").append($("<button id='gridview_cell_"+i+"' value='"+answer.questionId+"_"+answer.id+"_"+answer.nextQuestionId+"_"+answer.resultContents+"' class='col-sm-2 gridview-cell-normal'></button>")
                                                         .html('<img id="gridview_cell_image_'+answer.imageId+'" class="gridview-cell-image" src="Assets/image/pepper_monshin.png"/><p>' + answer.contents + '</p>'));
                $("tbody").append(answer_container);
            }else{
                var answer_container = $("#answer_container").append($("<button id='gridview_cell_"+i+"' value='"+answer.questionId+"_"+answer.id+"_"+answer.nextQuestionId+"_"+answer.resultContents+"' class='col-sm-2 gridview-cell-normal'></button>")
                                                         .html('<p>' + answer.contents + '</p>'));
                $("tbody").append(answer_container);
            }
        }
    }

    for (var i = idxCellStart; i <= idxCellEnd; i++) {
        var answer = arrData[i];
        donburi.webdb.getImageItemWithId(answer.imageId, function(tx, results){
            if (results.rows.length > 0) {
                var image = results.rows.item(0);
                document.getElementById("gridview_cell_image_"+image.id).src = image.url;
            }
        });

        var gridviewEl = document.getElementById('gridview_cell_'+(i));
        FastClick.attach(gridviewEl);
        gridviewEl.addEventListener('touchend', function(event) {

            qiSession.service("ALMemory").then(function (ALMemory) {
                ALMemory.raiseEvent("OADonburi/Interview/AnswerSelectedEvent", "").then(function (ALMemory) {
                });
            });

            for (var i = idxCellStart; i <= idxCellEnd; i++) {
                if (document.getElementById('gridview_cell_'+(i)).classList.contains('gridview-cell-selected')){
                    document.getElementById('gridview_cell_'+(i)).classList.remove('gridview-cell-selected');
                    document.getElementById('gridview_cell_'+(i)).classList.add('gridview-cell-normal');
                }
            }
            $(this).removeClass('gridview-cell-normal');
            $(this).addClass('gridview-cell-selected');
            var strValue = $(this).val();
            var arrValue = strValue.split("_");
            if (arrValue.length >= 4) {
                currentQuestionId = arrValue[0];
                currentAnswerId   = arrValue[1];
                nextQuestionId    = arrValue[2];
                resultContents    = arrValue[3];

                donburi.webdb.open();
                donburi.webdb.getInterviewResultWithQuestionId(currentQuestionId, function(tx, results){
                    if(results.rows.length > 0){ // update result
                        var currentResultId = results.rows.item(0).id;
                        donburi.webdb.updateInterviewResult(currentQuestionId, currentAnswerId , nextQuestionId, resultContents, function(){
                            donburi.webdb.deleteAllInterviewResultWithCurrentResultId(currentResultId, function(tx, results){
                            });
                        });

                    }else{ // insert new result
                        donburi.webdb.insertInterviewResult(currentQuestionId, currentAnswerId, nextQuestionId, resultContents, function(){
                            // Insert OK
                        });
                    }
                });
                sendSocketCurrentQuestionAndAnswer(currentQuestionId, currentAnswerId);
            }
        }, false);
    }
}

function fnProccessRequirementAfterSelectAnswer() {
    fnClearTimeOutOfCurrentQuestion();
    timerSelected = setTimeout(function(){
        if (nextQuestionId > 0) {
            showQuestion(nextQuestionId);  // next to question
        }else{
   　        window.location.assign("confirm.html"); // next to confirm screen
        }
    }, 3000);
}

function fnClearTimeOutOfCurrentQuestion() {
    clearTimeout(timerSelected);
}

$(function() {
	var btnNavBackEl = document.getElementById('btn_nav_back');
    // var btnNavNextEl = document.getElementById('btn_nav_next');
    var btnScrollPreEl = document.getElementById('btn_scroll_previous');
    var btnScrollNextEl = document.getElementById('btn_scroll_next');
    var txtQuestionContentsEl = document.getElementById('question_contents');

    FastClick.attach(btnNavBackEl);
    // FastClick.attach(btnNavNextEl);
    FastClick.attach(btnScrollPreEl);
    FastClick.attach(btnScrollNextEl);
    FastClick.attach(txtQuestionContentsEl);

    btnNavBackEl.addEventListener('touchend', function(event) {
        donburi.webdb.open();
        fnClearTimeOutOfCurrentQuestion();
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Interview/BtnNavBackClick", "戻る").then(function (ALMemory) {
               　donburi.webdb.getInterviewResultWithQuestionId(currentQuestionId, function(tx, results){
                    if(results.rows.length > 0){ 
                        var preResultId = results.rows.item(0).id - 1;
                        donburi.webdb.getInterviewResultWithId(preResultId, function(tx, results){
                             if(results.rows.length > 0){
                                var result = results.rows.item(0);
                                showQuestion(result.questionId); // Last Question
                             }else{
                                window.location.assign("management.html");
                             }  
                        });
                    }else{
                        donburi.webdb.getInterviewResultLast(function(tx, results){
                            if (results.rows.length > 0) {
                                // Back to last question
                                var result = results.rows.item(0);
                                showQuestion(result.questionId); // Last Question
                            }else{
                                // Back to Management view
                                window.location.assign("management.html");
                            }
                        });
                    }
                });
            });
        });
    }, false);

    btnScrollPreEl.addEventListener('touchend', function(event) {
        // Scroll previous
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Interview/BtnPreClick", "前へ").then(function (ALMemory) {
                if (currentPaging > 1) {
                    currentPaging--;
                    showAnswerGridView(currentPaging, arrAnswer);
                }
            });
        });
    }, false);

    btnScrollNextEl.addEventListener('touchend', function(event) {
        // Scroll next
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Interview/BtnNextClick", "次へ").then(function (ALMemory) {
                if (currentPaging < numberPaging) {
                    currentPaging++;
                    showAnswerGridView(currentPaging, arrAnswer);
                }
            });
        });
    }, false);

    txtQuestionContentsEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Interview/StartQuestion", currentAction).then(function (ALMemory) {
            });
        });
    }, false);

});