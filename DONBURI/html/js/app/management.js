var qiSession = new QiSession();

function initData(){
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.subscriber("OADonburi/Main/ShowWaitingView").then(function (subscriber) {
          subscriber.signal.connect(function (status) {
                window.location.assign("main.html");
          });
        });
    });

    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.raiseEvent("OADonburi/SocketListener/PepInConsultation", "").then(function (ALMemory) {
        });
        var delayMillis = 1000; // wait 2 second
        setTimeout(function() {
            ALMemory.raiseEvent("OADonburi/Management/Interpret", "").then(function (ALMemory) { 
            });
        }, delayMillis);
    });
}

$(function() {
	var btnNavBackEl = document.getElementById('btn_nav_back');
    var btnStartInterViewEl = document.getElementById('btn_start_interview');

    FastClick.attach(btnNavBackEl);
    FastClick.attach(btnStartInterViewEl);

    btnNavBackEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Management/BtnBackClick", "戻る").then(function (ALMemory) {
               　window.location.assign("main.html");
            });
        });
    }, false);

    btnStartInterViewEl.addEventListener('touchend', function(event) {
        donburi.webdb.open();
        donburi.webdb.createInterviewResultTbl();

        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Management/BtnStartClick", "スタート").then(function (ALMemory) {
                localDb.userInfo.setUserInfoDirectToInterviewFromScreen("DirectToInterviewFromManagementView", function(){
                    window.location.assign("interview.html");    
                });
            });
        });
    }, false);
});