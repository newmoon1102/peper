var qiSession = new QiSession();

function initData(){
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.subscriber("OADonburi/CmdFromIpad/CallEmployeeDone").then(function (subscriber) {
            subscriber.signal.connect(function () {
                setTimeout(function() {
                    window.location.assign("main.html");
                }, 1000); //wait 1 second
            });
        });

        ALMemory.subscriber("OADonburi/Main/ShowWaitingView").then(function (subscriber) {
          subscriber.signal.connect(function (status) {
                window.location.assign("main.html");
          });
        });
    });

    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.raiseEvent("OADonburi/CallNoAppoDone/Interpret", "").then(function (ALMemory) { 
            localDb.userInfo.getUserInfoIsSuccessCallEmployeeNoAppo(function (value){
                if (value == "YES") {
                    setTimeout(function() {
                        window.location.assign("main.html");
                    }, 1000); //wait 1 second
                }
            });
        });
    });
}

$(function() {
    var btnCancelEl = document.getElementById('btn_cancel');

    FastClick.attach(btnCancelEl);
    
    btnCancelEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/CallNoAppoDone/BtnCancelClick", "キャンセル").then(function (ALMemory) {
                window.location.assign("reception.html");
            });
        });
    }, false);

});


