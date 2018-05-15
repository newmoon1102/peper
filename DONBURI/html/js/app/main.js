var qiSession = new QiSession();

function initData(){
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.insertData("DONBURI/UserInfo/IsMainVC", 1).then(function (ALMemory) {
        });
        ALMemory.raiseEvent("OADonburi/SocketListener/PepIsWaiting", "").then(function (ALMemory) {
        });
        ALMemory.raiseEvent("OADonburi/Main/Interpret", "").then(function (ALMemory) {
        });
    });
}

$(function() {
    var numTapBtnSetup = 0;
    var timeoutTapBtnSetup = 3000; //3s

    var btnNavSettingEl = document.getElementById('btn_nav_setting');
	var btnReceptionEl  = document.getElementById('btn_reception');
    var btnManagementEl = document.getElementById('btn_management');

    FastClick.attach(btnNavSettingEl);
    FastClick.attach(btnReceptionEl);
    FastClick.attach(btnManagementEl);

    //Click setting button on tablet
    btnNavSettingEl.addEventListener('touchend', function(event){
        numTapBtnSetup++;
        setTimeout(function() {
            numTapBtnSetup = 0;
        }, timeoutTapBtnSetup);

        if (numTapBtnSetup == 5) { // user touch 5 times.
            window.location.assign("setting.html");
        }
    }, false);

    // click reception button on tablet
    btnReceptionEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Main/BtnReceptionClick", "受付").then(function (ALMemory) {
                window.location.assign("reception.html");
            });
        });
    }, false);
    
    // Click management button on tablet
	btnManagementEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Main/BtnManagementClick", "経営相談").then(function (ALMemory) {
                window.location.assign("management.html");
            });
        });
	}, false);
});
