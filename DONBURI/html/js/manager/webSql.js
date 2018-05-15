// Session Storage Manager

var donburi = {};
donburi.webdb = {};

donburi.webdb.db = null;

donburi.webdb.open = function() {
  var dbSize = 10 * 1024 * 1024; // 10MB
  donburi.webdb.db = openDatabase("DONBURI", "1.0.0", "Donburi DB on browser", dbSize);
}

donburi.webdb.onError = function(tx, e) {
   alert("There has been an error: " + e.message);
}

donburi.webdb.onSuccess = function(tx, r) {
  // alert("Insert data Successfully ");
}

function handleDataAndInsertIntoWebSQL(database, callbackFunc) {

  var jsonDictionary = JSON.parse(database);

  var jsonBumon          = jsonDictionary['T_Bumon'];
  var jsonShain          = jsonDictionary['T_Shain'];
  var jsonQuestion       = jsonDictionary['T_Question'];
  var jsonAnswer         = jsonDictionary['T_Answer'];
  var jsonImage          = jsonDictionary['T_Image'];
  
  var arrBumon    = JSON.parse(jsonBumon);
  var arrShain    = JSON.parse(jsonShain);
  var arrQuestion = JSON.parse(jsonQuestion);
  var arrAnswer   = JSON.parse(jsonAnswer);
  var arrImage    = JSON.parse(jsonImage);

  donburi.webdb.insertBumonData(arrBumon);
  donburi.webdb.insertShainData(arrShain);
  donburi.webdb.insertQuestionData(arrQuestion);
  donburi.webdb.insertAnswerData(arrAnswer);
  donburi.webdb.insertImageData(arrImage);
  callbackFunc();
}

// Create Interview Result Table
donburi.webdb.createInterviewResultTbl = function(){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DROP TABLE IF EXISTS T_Result");
    tx.executeSql("CREATE TABLE IF NOT EXISTS T_Result(id INTEGER PRIMARY KEY NOT NULL, questionId INTEGER NOT NULL, answerId INTEGER, nextQuestionId INTEGER, resultContents TEXT)",[]);
  });
}

donburi.webdb.insertInterviewResult = function(questionId, answerId, nextQuestionId, resultContents, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT COUNT(*) AS c FROM T_Result", [], function(tx,results){
      var num = results.rows.item(0).c + 1; 
      tx.executeSql("INSERT INTO T_Result(id, questionId, answerId, nextQuestionId, resultContents) VALUES (?,?,?,?,?)",
            [parseInt(num), questionId, answerId, nextQuestionId, resultContents],
            callbackFunc,
            donburi.webdb.onError);
    }, donburi.webdb.onError);
  });
}

donburi.webdb.updateInterviewResult = function(questionId, answerId, nextQuestionId, resultContents, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("UPDATE T_Result SET answerId=?, nextQuestionId=?, resultContents=? WHERE questionId=?",
                  [answerId,nextQuestionId,resultContents,questionId],
                  callbackFunc,
                  donburi.webdb.onError);
  });
}

donburi.webdb.deleteAllInterviewResultWithCurrentResultId = function(currentId){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM T_Result WHERE id>=?",
                  [currentId+1],
                  donburi.webdb.onSuccess,
                  donburi.webdb.onError);
  });
}

donburi.webdb.getInterviewResultWithQuestionId = function(questionId, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Result WHERE questionId=? ORDER BY id ASC LIMIT 1",
                  [questionId],
                  callbackFunc,
                  donburi.webdb.onError);
  });
}

donburi.webdb.getInterviewResultWithId = function(resultId, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Result WHERE id=? ORDER BY id ASC LIMIT 1",
                  [resultId],
                  callbackFunc,
                  donburi.webdb.onError);
  });
}

donburi.webdb.getInterviewResultLast = function(callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Result ORDER BY id DESC LIMIT 1", [], callbackFunc, donburi.webdb.onError);
  });
}

donburi.webdb.getArrInterviewResults = function(callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT questionId, answerId, nextQuestionId, resultContents FROM T_Result GROUP BY questionId ORDER BY questionId ASC", [], callbackFunc, donburi.webdb.onError);
  });
}


/*--------------------------------------------------------------- INSERT INSTANCE INTO TABLE --------------------------------------------------------------------- */
donburi.webdb.insertBumonData = function(arrBumon) {
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DROP TABLE IF EXISTS T_Bumon",[]);
    tx.executeSql("CREATE TABLE IF NOT EXISTS T_Bumon(id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, updateTime TEXT)",[]);
    for (var i = 0; i < arrBumon.length; i++) {
      tx.executeSql("INSERT INTO T_Bumon(id, name, updateTime) VALUES (?,?,?)",
                  [arrBumon[i].id, arrBumon[i].name, arrBumon[i].updateTime],
                  donburi.webdb.onSuccess,
                  donburi.webdb.onError);
    }
  });
}
donburi.webdb.insertShainData = function(arrShain){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DROP TABLE IF EXISTS T_Shain",[]);
    tx.executeSql("CREATE TABLE IF NOT EXISTS T_Shain(id INTEGER PRIMARY KEY NOT NULL, name TEXT, yomi TEXT, bumonId INTEGER NOT NULL, updateTime TEXT)",[]);
    for (var i = 0; i < arrShain.length; i++) {
      tx.executeSql("INSERT INTO T_Shain(id, name, yomi, bumonId, updateTime) VALUES (?,?,?,?,?)",
                  [arrShain[i].id, arrShain[i].name, arrShain[i].yomi, arrShain[i].bumonId, arrShain[i].updateTime],
                  donburi.webdb.onSuccess,
                  donburi.webdb.onError);
    }
  });
}
donburi.webdb.insertQuestionData = function(arrQuestion){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DROP TABLE IF EXISTS T_Question",[]);
    tx.executeSql("CREATE TABLE IF NOT EXISTS T_Question(id INTEGER PRIMARY KEY NOT NULL, contents TEXT NOT NULL, speech TEXT, imageId INTEGER, motionId INTEGER, updateTime TEXT)",[]);
    for (var i = 0; i <arrQuestion.length; i++)
    {
      tx.executeSql("INSERT INTO T_Question(id, contents, speech, imageId, motionId, updateTime) VALUES (?,?,?,?,?,?)",
                  [arrQuestion[i].id, arrQuestion[i].contents, arrQuestion[i].speech, arrQuestion[i].imageId, arrQuestion[i].motionId, arrQuestion[i].updateTime],
                  donburi.webdb.onSuccess,
                  donburi.webdb.onError);
    }
  });
}
donburi.webdb.insertAnswerData = function(arrAnswer){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DROP TABLE IF EXISTS T_Answer",[]);
    tx.executeSql("CREATE TABLE IF NOT EXISTS T_Answer(id INTEGER PRIMARY KEY NOT NULL, contents TEXT NOT NULL, questionId INTEGER NOT NULL, nextQuestionId INTEGER NOT NULL, imageId INTEGER, resultContents TEXT, resultImageId INTEGER, updateTime TEXT)",[]);
    for (var i = 0; i < arrAnswer.length; i++) {
      tx.executeSql("INSERT INTO T_Answer(id, contents, questionId, nextQuestionId, imageId, resultContents, resultImageId, updateTime) VALUES (?,?,?,?,?,?,?,?)",
                  [arrAnswer[i].id, arrAnswer[i].contents, arrAnswer[i].questionId, arrAnswer[i].nextQuestionId,arrAnswer[i].imageId,arrAnswer[i].resultContents,arrAnswer[i].resultImageId, arrAnswer[i].updateTime],
                  donburi.webdb.onSuccess,
                  donburi.webdb.onError);
    }
  });
}
donburi.webdb.insertImageData = function(arrImage){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DROP TABLE IF EXISTS T_Image",[]);
    tx.executeSql("CREATE TABLE IF NOT EXISTS T_Image(id INTEGER PRIMARY KEY NOT NULL, url TEXT NOT NULL, name TEXT NOT NULL, updateTime TEXT)",[]);
    for (var i = 0; i < arrImage.length; i++) {
      tx.executeSql("INSERT INTO T_Image(id, url, name, updateTime) VALUES (?,?,?,?)",
                  [arrImage[i].id, arrImage[i].url, arrImage[i].name, arrImage[i].updateTime],
                  donburi.webdb.onSuccess,
                  donburi.webdb.onError);
    }
  });
}
/*-------------------------------------------------------------------- GET DATA --------------------------------------------------------------------------------- */
donburi.webdb.getBumonItems = function(callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Bumon", [], callbackFunc, donburi.webdb.onError);
  });
}

donburi.webdb.getShainItems = function(callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Shain",[], callbackFunc, donburi.webdb.onError);
  })
}

donburi.webdb.getShainItemByBumonId = function(bumonId, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Shain WHERE bumonId=?",[bumonId], callbackFunc, donburi.webdb.onError);
  })
}

donburi.webdb.getQuestionItemWithId = function(questionId, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Question WHERE id=?",[questionId], callbackFunc, donburi.webdb.onError);
  });
}

donburi.webdb.getAnswerItemWithId = function(answerId, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Answer WHERE id=?",[answerId], callbackFunc, donburi.webdb.onError);
  });
}

donburi.webdb.getAnswerItemsWithQuestionId = function(questionId, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Answer WHERE questionId=?",[questionId], callbackFunc, donburi.webdb.onError);
  });
}

donburi.webdb.getImageItemWithId = function(imageId, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Image WHERE id=?",[imageId], callbackFunc, donburi.webdb.onError);
  });
}

donburi.webdb.getImageOfAnswer = function(imageId, gridviewId, callbackFunc){
  var db = donburi.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM T_Image WHERE id=?",[imageId], callbackFunc(gridviewId), donburi.webdb.onError);
  });
}


