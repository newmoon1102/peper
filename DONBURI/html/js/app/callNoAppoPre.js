var qiSession = new QiSession();

function initData(){
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.subscriber("OADonburi/CmdFromIpad/CallEmployeeDone").then(function (subscriber) {
            subscriber.signal.connect(function () {
                localDb.userInfo.setUserInfoIsSuccessCallEmployeeNoAppo("YES", function(){
                });
            });
        });
        ALMemory.subscriber("OADonburi/CallNoAppoPre/PrepareDone").then(function (subscriber) {
            subscriber.signal.connect(function () {
                var delayMillis = 1000; // wait 1 second
                setTimeout(function() {
                    window.location.assign("callNoAppoDone.html");
                }, delayMillis);
            });
        });

        ALMemory.subscriber("OADonburi/Main/ShowWaitingView").then(function (subscriber) {
          subscriber.signal.connect(function (status) {
                window.location.assign("main.html");
          });
        });
    });

    qiSession.service("ALMemory").then(function (ALMemory) {
        var delayMillis = 1000; // wait 1 second
        setTimeout(function() {
            ALMemory.raiseEvent("OADonburi/CallNoAppoPre/Interpret", "").then(function (ALMemory) { 
            });

            ALMemory.raiseEvent("OADonburi/SocketListener/CallNoAppo", "").then(function (ALMemory) {
                //
            });
        }, delayMillis);
    });
}

$(function() {
    var btnCancelEl = document.getElementById('btn_cancel');

    FastClick.attach(btnCancelEl);
    
    btnCancelEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/CallNoAppoPre/BtnCancelClick", "キャンセル").then(function (ALMemory) {
                window.location.assign("reception.html");
            });
        });
    }, false);

});


