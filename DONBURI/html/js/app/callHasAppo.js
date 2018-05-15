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

    localDb.userInfo.getSelectedBumonId(function(bumonId){
        localDb.userInfo.getSelectedEmployeeId(function(shainId){
            var jsonCall = '{"StatusCode":50,"BumonID":'+bumonId+',"ShainID":'+shainId+'}';
            qiSession.service("ALMemory").then(function (ALMemory) {
                ALMemory.raiseEvent("OADonburi/SocketListener/CallHasAppo", jsonCall).then(function (ALMemory) {
                    //
                });
            });
        });
    });

    localDb.userInfo.getSelectedEmployeeYomi(function(employeeYomi){
        var strCall = employeeYomi + "さぁーん、お客様がいらっしゃいましたよー！急いで来てくださーい！早く早く！"
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/CallHasAppo/Interpret", strCall).then(function (ALMemory) {
            });
        });
    });
}

$(function() {
    var btnNavReturnEl = document.getElementById('btn_nav_return');
    var btnCancelEl = document.getElementById('btn_cancel');

    FastClick.attach(btnNavReturnEl);
    FastClick.attach(btnCancelEl);

    btnNavReturnEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/CallHasAppo/BtnReturnClick", "リターン").then(function (ALMemory) {
                window.location.assign("employee.html");
            });
        });
    }, false);
    
    btnCancelEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/CallHasAppo/BtnCancelClick", "キャンセル").then(function (ALMemory) {
                window.location.assign("reception.html");
            });
        });
    }, false);

});


