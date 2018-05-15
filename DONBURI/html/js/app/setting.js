var qiSession = new QiSession();
donburi.webdb.open();

function initData(){
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.insertData("DONBURI/UserInfo/IsMainVC", 0).then(function (ALMemory) {
        });
    });

    localDb.userInfo.getIpadIpAddress(function(value){
        $("#input_ipad_ip").val(value);
    });
    localDb.userInfo.getIpadPort(function(value){
        $("#input_ipad_port").val(value);
    });
    
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.raiseEvent("OADonburi/Setting/OpenSetting", "").then(function (ALMemory) {
        });
    });
    
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.subscriber("OADonburi/SocketListener/SocketStatus").then(function (subscriber) {
          subscriber.signal.connect(function (status) {
              if (status == "OK") {
                document.getElementById("lb_msg_connect_status").innerHTML = "ソケットの接続ができました。"; 
                ALMemory.raiseEvent("OADonburi/Setting/ConnectOk", "").then(function (ALMemory) {
                });
              }else{
                document.getElementById("lb_msg_connect_status").innerHTML = "ソケットの設定に失敗しました。"; 
                ALMemory.raiseEvent("OADonburi/Setting/ConnectFailed", "").then(function (ALMemory) {                   
                });
              }
          });
        });
    });
}

function saveIpadIpAddress(){
    var ipAddr = $("#input_ipad_ip").val();
    var portAddr = $("#input_ipad_port").val();
    localDb.userInfo.setIpadIpAddress(ipAddr);
    localDb.userInfo.setIpadPort(portAddr);
    if (validateIPaddress(ipAddr)) {
        var arrSetup = [{"key":"ip_addr" , "value": ipAddr}, {"key": "port_addr" , "value": portAddr}];
        var jsonSetup = {"T_Setup": arrSetup };
        var strJsonSetup = JSON.stringify(jsonSetup);

        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.insertData("OADonburi/Setup/IpadIpAddress", ipAddr).then(function (ALMemory) {
            });
            ALMemory.raiseEvent("OADonburi/SQLManager/UpdateSetup", strJsonSetup).then(function (ALMemory) { //setupInfo
            });
        });
    }else{
        alert("正しIPアドレスを入力してください。");
    }
}

function saveIpadPort(){
    var ipAddr = $("#input_ipad_ip").val();
    var portAddr = $("#input_ipad_port").val();
    localDb.userInfo.setIpadIpAddress(ipAddr);
    localDb.userInfo.setIpadPort(portAddr);
    
    var arrSetup = [{"key":"ip_addr" , "value": ipAddr}, {"key": "port_addr" , "value": portAddr}];
    var jsonSetup = {"T_Setup": arrSetup };
    var strJsonSetup = JSON.stringify(jsonSetup);

    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.insertData("OADonburi/Setup/IpadPort", portAddr).then(function (ALMemory) {
        });
        ALMemory.raiseEvent("OADonburi/SQLManager/UpdateSetup", strJsonSetup).then(function (ALMemory) { //setupInfo
        });
    });
}

function validateIPaddress(ipaddress) {  
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
    return (true)  
  }  
  return (false)  
}  



$(function() {
    var btnCloseBackEl = document.getElementById('btn_nav_close');
    var btnCheckConnectEl = document.getElementById('btn_check_connect');
    var btnCloseAppOkEl = document.getElementById('btn_close_app_ok');
    var btnCloseAppCancelEl = document.getElementById('btn_close_app_cancel');

    FastClick.attach(btnCloseBackEl);
    FastClick.attach(btnCheckConnectEl);
    FastClick.attach(btnCloseAppOkEl);
    FastClick.attach(btnCloseAppCancelEl);

    btnCloseBackEl.addEventListener('touchend', function(event){
        window.location.assign("index.html"); // reload data
    }, false);

    btnCheckConnectEl.addEventListener('touchend', function(event){
        var hostIp = $("#input_ipad_ip").val();
        var hostPort= $("#input_ipad_port").val();

        if ((hostIp == null || hostIp == "" || !validateIPaddress(hostIp)))
        {
            alert("正しIPアドレスを入力してください。");
            return;
        }else if(hostPort == null || hostPort == ""){
            alert("正しポートを入力してください。");
            return;
        }
        
        qiSession.service("ALMemory").then(function (ALMemory) {
            if (hostIp && hostPort) {
                var setupInfo = '{"iPadIpAddr":"' + hostIp + '","iPadPort":' + hostPort +'}';
                ALMemory.raiseEvent("OADonburi/Setting/BtnConnectClick", "").then(function (ALMemory) {
                });
                ALMemory.raiseEvent("OADonburi/SocketListener/CheckStatusSocket", setupInfo).then(function (ALMemory) { //setupInfo
                });
            }else{
                window.location.assign("setting.html");
            }
        });

    }, false);

    $( "#btn_close_app_ok" ).click(function() {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Settting/CloseApplication", "終了");
        });
    });

    $( "#btn_close_app_dismiss" ).click(function() {
        $("#btn_close_app_dismiss").click();
    });

});