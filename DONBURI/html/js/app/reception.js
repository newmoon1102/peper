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
        ALMemory.raiseEvent("OADonburi/SocketListener/PepInReception", "").then(function (ALMemory) {
            //
        });

        var delayMillis = 1000; // wait 1 second
        setTimeout(function() {
            ALMemory.raiseEvent("OADonburi/Reception/Interpret", "").then(function (ALMemory) { 
            });
        }, delayMillis);
    });
}

$(function() {
	var btnNavBackEl = document.getElementById('btn_nav_back');
    var btnDepartmentEl = document.getElementById('btn_department');
    var btnCallNoAppoEl = document.getElementById('btn_call_no_appo');

    FastClick.attach(btnNavBackEl);
    FastClick.attach(btnDepartmentEl);
    FastClick.attach(btnCallNoAppoEl);

    btnNavBackEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Reception/BtnBackClick", "戻る").then(function (ALMemory) {
                window.location.assign("main.html");
            });
        });
    }, false);

    btnDepartmentEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Reception/BtnDepartmentClick", "アポあり").then(function (ALMemory) {
                window.location.assign("department.html");
            });
        });
    }, false);

    btnCallNoAppoEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Reception/BtnCallNoAppoClick", "アポなし").then(function (ALMemory) {
                localDb.userInfo.setUserInfoIsSuccessCallEmployeeNoAppo("NO", function(){
                    window.location.assign("callNoAppoPre.html");
                });
            });
        });
    }, false);
});