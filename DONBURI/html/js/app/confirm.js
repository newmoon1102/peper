var qiSession = new QiSession();

function initData(){
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.subscriber("OADonburi/Main/ShowWaitingView").then(function (subscriber) {
          subscriber.signal.connect(function (status) {
                window.location.assign("main.html");
          });
        });
    });

    donburi.webdb.open();
    donburi.webdb.getArrInterviewResults(function(tx, results){
        $("#tbl-confirm").empty();

        for (var i = 0; i < results.rows.length; i++) {
            var result = results.rows.item(i);
            var questionId = result.questionId;
            var answerId   = result.answerId;

            donburi.webdb.getQuestionItemWithId(questionId, function(tx, results){
                if (results.rows.length > 0) {
                    var question = results.rows.item(0);
                    $("#tableID").find('tbody').append($('<tr>').append($("<td class='row-confirm'>").html("Q : " + question.contents)));
                }
            });
            donburi.webdb.getAnswerItemWithId(answerId, function(tx, results){
                if (results.rows.length > 0) {
                    var answer = results.rows.item(0);
                    $("#tableID").find('tbody').append($('<tr>').append($("<td class='row-confirm'>").html("A : " + answer.contents)));
                    $("#tableID").find('tbody').append($('<tr>').append($("<td class='row-space'>").html("")));
                }
            });
        }
    });

    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.raiseEvent("OADonburi/Confirm/Interpret", "").then(function (ALMemory) {
            //
        });
    });
}

$(function() {
    
    var btnNavBackEl = document.getElementById('btn_nav_back');
    var btnNavCancelEl = document.getElementById('btn_nav_result');

    FastClick.attach(btnNavBackEl);
    FastClick.attach(btnNavCancelEl);

    btnNavBackEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Confirm/BtnNavBackClick", "戻る").then(function (ALMemory) {
                localDb.userInfo.setUserInfoDirectToInterviewFromScreen("DirectToInterviewFromConfirmView", function(){
                    window.location.assign("interview.html");
                });
            });
        });
    }, false);
    
    btnNavCancelEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Confirm/BtnResultClick", "結果へ").then(function (ALMemory) {
                window.location.assign("result.html");
            });
        });
    }, false);
});
