
var qiSession = new QiSession();
var arrBumon = [];
var numberPaging = 0;
var currentPaging = 1;
var numCellOfRow = 4;
var numCellOfGridview = 8;

function initData() {
    qiSession.service("ALMemory").then(function (ALMemory) {
        ALMemory.subscriber("OADonburi/Main/ShowWaitingView").then(function (subscriber) {
          subscriber.signal.connect(function (status) {
                window.location.assign("main.html");
          });
        });
    });

    donburi.webdb.open();
    if (donburi.webdb.db) {
        donburi.webdb.getBumonItems(function(tx, results){
            for (var i = 0; i < results.rows.length; i++) {
                var bumon = results.rows.item(i);
                arrBumon.push(bumon);
            }
            var numberCell = arrBumon.length;
            numberPaging = Math.ceil(numberCell/numCellOfGridview);
            showGridView(currentPaging, arrBumon);
        });
    }else{
        alert("not found your donburi.webdb.db!");
    }

    qiSession.service("ALMemory").then(function (ALMemory) {
        var delayMillis = 1000; // wait 2 second
        setTimeout(function() {
            ALMemory.raiseEvent("OADonburi/Department/Interpret", "").then(function (ALMemory) { 
            });
        }, delayMillis);
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

function showGridView(paging, arrData){
    $("#data_row_1").empty();
    $("#data_row_2").empty();
    drawPagingView();

    var idxCellStart = (paging - 1)*numCellOfGridview;
    var idxCellEnd = arrData.length - 1;
    if (arrData.length > idxCellStart + numCellOfGridview) {
        idxCellEnd = idxCellStart + numCellOfGridview - 1;
    }
    for (var i = idxCellStart; i <= idxCellEnd; i++) {
        var b = arrData[i];
        if(i < idxCellStart + numCellOfRow){
            var data_row_1 = $("#data_row_1").append($("<button id='gridview_cell_"+i+"' value='"+b.id+"_"+b.name+"' class='col-sm-2 gridview-cell-normal'></button>").html("<p>" + b.name + "</p>"));
            $("tbody").append(data_row_1);
        }else{
            var data_row_2 = $("#data_row_2").append($("<button id='gridview_cell_"+i+"' value='"+b.id+"_"+b.name+"' class='col-sm-2 gridview-cell-normal'></button>").html("<p>" + b.name + "</p>"));
            $("tbody").append(data_row_2);
        }
    }

    for (var i = idxCellStart; i <= idxCellEnd; i++) {
        var gridviewEl = document.getElementById('gridview_cell_'+(i));
        FastClick.attach(gridviewEl);
        gridviewEl.addEventListener('touchend', function(event) {
            for (var i = idxCellStart; i <= idxCellEnd; i++) {
                if (document.getElementById('gridview_cell_'+(i)).classList.contains('gridview-cell-selected')){
                    document.getElementById('gridview_cell_'+(i)).classList.remove('gridview-cell-selected');
                    document.getElementById('gridview_cell_'+(i)).classList.add('gridview-cell-normal');
                }
            }
            $(this).removeClass('gridview-cell-normal');
            $(this).addClass('gridview-cell-selected');

            var strValue = $(this).val();
            var strSpeech = "";
            var arrValue = strValue.split("_");
            if (arrValue.length >= 2) {
                strSpeech = arrValue[1];
                localDb.userInfo.setSelectedBumonId(arrValue[0]);
                localDb.userInfo.setSelectedBumonName(arrValue[1]);
            }
            qiSession.service("ALMemory").then(function (ALMemory) {
                ALMemory.raiseEvent("OADonburi/Department/DepartmentSelectedEvent", strSpeech).then(function (ALMemory) {
                    window.location.assign("employee.html");
                });
            });
        }, false);
    }
}

$(function() {
	var btnNavBackEl = document.getElementById('btn_nav_back');
    var btnScrollPreEl = document.getElementById('btn_scroll_previous');
    var btnScrollNextEl = document.getElementById('btn_scroll_next');

    FastClick.attach(btnNavBackEl);
    FastClick.attach(btnScrollPreEl);
    FastClick.attach(btnScrollNextEl);

    btnNavBackEl.addEventListener('touchend', function(event) {
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Department/BtnBackClick", "戻る").then(function (ALMemory) {
               　window.location.assign("reception.html");
            });
        });
    }, false);

    btnScrollPreEl.addEventListener('touchend', function(event) {
        // Scroll previous  
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Department/BtnPreviousClick", "前へ").then(function (ALMemory) {
                if (currentPaging > 1) {
                    currentPaging--;
                    showGridView(currentPaging, arrBumon);
                }
            });
        });
    }, false);
    btnScrollNextEl.addEventListener('touchend', function(event) {
        // Scroll next
        qiSession.service("ALMemory").then(function (ALMemory) {
            ALMemory.raiseEvent("OADonburi/Department/BtnNextClick", "次へ").then(function (ALMemory) {
                if (currentPaging < numberPaging) {
                    currentPaging++;
                    showGridView(currentPaging, arrBumon);
                }
            });
        });
    }, false);

});