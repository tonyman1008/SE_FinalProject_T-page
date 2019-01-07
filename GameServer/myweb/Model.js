var global = require("./global");
var DB = require("./MySQL_DB");

const model ={


    login:function (data,usercallback) {
        DB.isElementExist("user", data.account, function (callback) {

            if (callback == false) {
                usercallback("account not found");
                return;
            }
            else {

                DB.getElementWithCondition("user", "name", data.account, function (callback2) {
                    if (callback2.password == data.password) {

                        if (callback2.state == null) {
                            global.loginUsers[data.socketid] = data.account;
                            usercallback("success");
                        }
                        else
                            usercallback("you're freezed");
                    }
                    else {
                        usercallback("password error");
                    }
                });
            }


        });

	},

    register: function (data, usercallback) {
        console.log(data);
        DB.isElementExist("user", data.account, function (callback) {

            if (callback == true) {
                usercallback("account is used");
            }
            else {
                //添加新使用者
                DB.register(data.account, data.password);
                usercallback("success");
            }
            
        });

	},

    freezeAccount:function (data,usercallback) {

        DB.isElementExist("user", data.freezeName, function (callback) {
            if (callback == true)
            {
                DB.getElementWithCondition("user", "name", data.freezeName, function (callback) {
                    if (callback.state == "freeze") {
                        DB.defreezeAccount(data.freezeName);

                        usercallback("unfreezed")
                    }
                    else if (callback.state == null) {
                        DB.freezeAccount(data.freezeName);

                        usercallback("freezed");
                    }
                });
            }
            else {
                usercallback("");
            }         
        });

	},

    deleteAccount: function (data, usercallback) {
        DB.isElementExist("user", data.deleteName, function (callback) {

            if (callback == true) {
                
                DB.deleteAccount(data.deleteName);

                usercallback("deleted")
            }
            else {
                usercallback("");
            }         
        });
    },

    likeArticle: function (data, callback) {
        if (data.articleNo == -1) return;
        DB.likeArticle(data.articleNo, function () {

            callback();
        });
    },

    addArticle: function (data) {
        DB.poArticle(data.date, data.username, data.content, data.boardName);
    },


    addFamily:function (data,usercallback) {

        DB.isElementExist("family", data.familyName, function (callback) {
            if (callback == true) {
                usercallback(null);
            }
            else {
                DB.createFamily(data.username, data.familyName);
                DB.joinFamily(data.username, data.familyName);


                DB.getMemberOfFamily(data.familyName, function (callback) {
                    usercallback({
                        name: data.familyName,
                        member: callback
                    });
                });
            }
        });
        
    },

    joinFamily:function(data,usercallback){

        DB.isElementExist("family", data.familyName, function (callback) {
            if (callback == true) {
                DB.joinFamily(data.username, data.familyName);
                DB.getMemberOfFamily(data.familyName, function (callback) {
                    usercallback({
                        name: data.familyName,
                        member: callback
                    });
                });
            }
            else {
                usercallback(null);
            }
        });
       
    },

    exitFamily: function exit(data,usercallback) {
        DB.isElementExist("family",data.familyName,function (callback) {
            if (callback == true) {
                DB.exitFamily(data.username);
                usercallback({});
            }
            usercallback(null);
        });
         
    },


    addFriend: function (data,usercallback) {      


        DB.isElementExist("user", data.friendName, function (callback) {

            if (callback == false) {

                usercallback("usrename not found");

            }
            else {

                DB.getAllFriendOfUser(data.username, function (arr) {

                    if (arr.includes(data.friendName)) {
                        usercallback("already friend");
                    }
                    else {
                        DB.addFriend(data.username, data.friendName);
                        usercallback("add friend success");
                    }                  

                })
            }
        });

    },

    removeFriend: function (data,usercallback) {


        DB.isElementExist("user", data.friendName, function (callback) {

            if (callback == false) {

                usercallback("usrename not found");

            }
            else {

                DB.getAllFriendOfUser(data.username, function (arr) {

                    console.log("friedns list :", arr);
                    console.log(data.friendName," Is my friend : ", arr.includes(data.friendName));

                    if (!arr.includes(data.friendName)) {
                        usercallback("not your  friend");
                    }
                    else {
                        DB.deleteFriend(data.username, data.friendName);
                        usercallback("remove friend success");
                    }

                })
            }
        });        

    }, 

    drawFriend:function(data,usercallback){
      
        DB.getAllDataOfTable("user", function (allfriends) {
            var rnd = parseInt(Math.random() * allfriends.length);
            if (rnd >= allfriends.length) rnd = allfriends.length - 1;
            if (rnd < 0)
                usercallback("no user");
            usercallback(allfriends[rnd].name);
        });  
        
    },

    confirmFriend: function (data, usercallback) {

        DB.isElementExist("user", data.friendName, function (callback) {

            if (callback == false) {
                usercallback("usrename not found");
            }
            else {               

                DB.admitFriend(data.username, data.friendName);
                usercallback("admit friend success");
            }
        }); 
    },

    denyFriend: function (data, usercallback) {

        DB.isElementExist("user", data.friendName, function (callback) {

            if (callback == false) {
                usercallback("usrename not found");
            }
            else {
                DB.denyFriend(data.username, data.friendName);
                usercallback("deny friend success");
            }
        }); 
    },

    deleteArticle: function (data, usercallback) {
        if (data.articleNo == -1) return;
        DB.deleteArticle(data.articleNo);
        usercallback("delete article success");
    },

    addBillboard: function (data, usercallback) {
        DB.isElementExist("apply_board", data.boardName, function (callback) {

            if (callback == false) {
                DB.isElementExist("board", data.boardName, function (callback2) {
                    if (callback2 == false) {
                        DB.applyBillBoard(data.boardName, function () {
                            usercallback("boardname apply success");
                        });
                     }
                    else {
                        usercallback("boardname is already exit");
                    }
                });
            }
            else {
                usercallback("the boardname is applying");
            }
        }); 
    },

    deleteBillboard: function (data,usercallback) {
        DB.isElementExist("board", data.boardName, function (callback) {

            if (callback == false) {
                usercallback("boardname not found");
            }
            else {

                DB.deleteBillBoard(data.boardName, function () {
                    usercallback("delete board success");
                });
            }
        }); 
    },

    admitBillboard: function (data, usercallback) {
        DB.admitBillBoard(data.boardName, function () {
            usercallback("admit board success");
        });
    },

    denyboard: function (data,usercallback) {
        DB.isElementExist("apply_board", data.boardName, function (callback) {
            if (callback == false) {
                usercallback("boardname not found");
            }
            else {
                DB.denyBillBoard(data.boardName, function () {
                    usercallback("deny board success");
                });
            }
        }); 
    },

    assignBillboardManager: function (data,usercallback) {
        DB.isElementExist("board", data.boardName, function (callback) {
            if (callback == false) {
                usercallback("boardname not found");
            }
            else {
                DB.isElementExist("user", data.masterName, function (callback2) {
                    console.log(data.masterName);
                    if (callback2 == false) {
                        usercallback("username not found");
                    }
                    else {
                        DB.assignMaster(data.boardName, data.masterName);
                        usercallback("assign board manager success");
                    }
                });
            }
        }); 
    },

    //動態頁顯示hot and friend article 沒有own article
    getDynamicPage: function (usercallback) {
         
        DB.getHotArticle(function (hotArticle) {
            var allarticles = [];
                for (var index = 0; index < hotArticle.length; index++) {
                    allarticles.push({
                        no: hotArticle[index].no,
                        name: hotArticle[index].author,
                        time: hotArticle[index].date,
                        content: hotArticle[index].content,
                        like: hotArticle[index].like_count,
                    })
                }
                usercallback(allarticles);
            });
    },

    getFamilpage: function (username, usercallback) {

        DB.getKeyValueOfElement("user", "name", username, "family", function (value) {
            
            if (value == null) {
                usercallback({ name: "no family", member: [] });
            }
            else {
                DB.getMemberOfFamily(value, function (data) {

                    usercallback({
                        name: value,
                        member: data
                    });
                });
            }
            
        });

    },

    getFriendpage: function (usrename, usercallback) {

        DB.getAllFriendOfUser(usrename, function (friends) {

            DB.getToBeFriendOfUser(usrename, function (toBefriends) {

                usercallback({
                    result: "",
                    allfriends: friends,
                    newfriends: toBefriends,
                });
            });           
        });

    },

    getMainpage: function (usercallback) {

        DB.getAllBoard(function (boards) {

            var allBoards = [];

            for (var index = 0; index < boards.length; index++) {

                allBoards.push(boards[index].name);
            }

            usercallback(allBoards);
        });
    },

    getArticlepage: function (username,boardname, usercallback) {
        if (boardname == "") {
            usercallback([{
                no: -1,
                name: "admit",
                time: "now",
                content: "chose boardname in mainpage first.",
                like: -1,
                beManager: false
            }]);
            return;
        }

        DB.getKeyValueOfElement("board", "name", boardname, "master", function (mastername) {

            DB.getBoardArticle(boardname, function (articles) {
                var allarticles = [];
                for (var index = 0; index < articles.length; index++) {
                    allarticles.push({
                        no: articles[index].no,
                        name: articles[index].author,
                        time: articles[index].date,
                        content: articles[index].content,
                        like: articles[index].like_count,
                        beManager: mastername == username ? true:false
                    })
                }
                usercallback(allarticles);
            });

        });
        
    },

    getAdminPage: function (username,usercallback) {

        DB.getElementWithCondition("user", "name", username, function (user) {
            console.log(JSON.stringify(user));
            if (user.role != "admin") return;

            DB.getAllDataOfTable("apply_board", function (applyboard) {
                var allApplyBoard = [];
                for (var index = 0; index < applyboard.length; index++) {
                    allApplyBoard.push(applyboard[index].name)
                }

                var allBoard = [];
                DB.getAllDataOfTable("board", function (board) {
                    for (var index = 0; index < board.length; index++) {
                        allBoard.push(board[index].name)
                    }

                    var allUser = [];
                    DB.getAllDataOfTable("user", function (user) {
                        for (var index = 0; index < user.length; index++) {
                            var freezeState;
                            if (user[index] == "freeze")
                                freezeState = true;
                            else
                                freezeState = false;
                            allUser.push({
                                name: user[index].name,
                                freeze: freezeState
                            })
                        }

                        usercallback(allBoard, allApplyBoard, allUser);
                    });

                });
            });




        });
       
    }

};

module.exports = model;