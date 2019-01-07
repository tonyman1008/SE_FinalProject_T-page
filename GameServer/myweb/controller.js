var model = require("./Model");
var view = require("./view");
var global = require("./global");

const controller = {

    Clientaction: function (data) {

        console.log("ClientAction: ", data);

        //對應編號隊到func
        switch (data.no) {

            case 0: this.requestpage(data); break;
            case 1: this.likeArticle(data); break;
            case 2: this.addArticle(data); break;
            case 3: this.addFamily(data); break;
            case 4: this.joinFamily(data); break;
            case 5: this.exitFamily(data); break;
            case 6: this.addFriend(data); break;
            case 7: this.removeFriend(data); break;
            case 8: this.confirmFriend(data); break;
            case 9: this.addBillboard(data); break;
            case 10: this.choseBillboard(data); break;
            case 11: this.deleteArticle(data); break;
            case 12: this.login(data); break;
            case 13: this.register(data); break;
            case 14: this.addBillboard(data); break;
            case 15: this.deleteBillboard(data); break;
            case 16: this.admitBillboard(data); break;
            case 17: this.assignBillboardManager(data); break;
            case 18: this.freezeAccount(data); break;
            case 19: this.deleteAccount(data); break;
            case 26: this.denyfriend(data); break;
            case 27: this.denyboard(data); break;
            case 28: this.drawFriend(data); break;
        }

    },

    //Account

    login: function (data) {

        //傳帳號密碼給model驗證，回傳訊息;
        model.login(data, function (msg) {


            //傳錯誤/成功訊息給使用者
            view.loginPage(data.socketid, msg);

        });

    },

    register: function (data) {

        //傳帳號密碼給model驗證;
        model.register(data, function (msg) {

            //傳錯誤/成功訊息給使用者
            view.loginPage(data.socketid, msg);

        });
       
    },

    freezeAccount: function (data) {

        //將被凍結的帳號若在線上才回傳socketid，否則回傳null
        model.freezeAccount(data, function (msg) {
            
            var freezeAccountIsOnline = global.getSocketByName(data.freezeName);



            if (freezeAccountIsOnline != null) {
                //如果被凍結的使用者在線上直接切掉使用
                view.loginPage(freezeAccountIsOnline.id, msg);
                delete global.loginUsers[freezeAccountIsOnline.id]
            }

            //更新管理者名單
            model.getAdminPage(data.usrename, function (board, applyboard, user) {
                view.adminPage(data.socketid, board, applyboard, user, "");
            });
        });

    },

    deleteAccount: function (data) {

        //將被凍結的帳號若在線上才回傳socketid，否則回傳null
        model.deleteAccount(data, function (msg) {

            var deleteAccountIsOnline = global.getSocketByName(data.deleteName);

            if (deleteAccountIsOnline != null) {
                //如果被刪除的使用者在線上直接切掉使用
                view.loginPage(deleteAccountIsOnline.id, msg);
                delete global.loginUsers[deleteAccountIsOnline.id]
            }

            //更新管理者名單
            model.getAdminPage(data.username,function(board, applyboard, user) {
                view.adminPage(data.socketid, board, applyboard, user, "");
            });
       
        });

    },


    // Family
    addFamily: function (data) {

        model.addFamily(data, function (result) {

            if (result != null)
                view.FamilyPage(data.socketid, result);
            else
                view.FamilyPage(data.socketid, { name: "Family already exist", member: [] });

        });
    },

    joinFamily: function (data) {

        model.joinFamily(data, function (result) {

            if (result != null)
                view.FamilyPage(data.socketid, result);
            else
                view.FamilyPage(data.socketid, { name: "Family not exist", member: [] });

        });

    },

    exitFamily: function (data) {

        model.exitFamily(data, function (result) {

            if (result != null)
                view.FamilyPage(data.socketid, { name: "exit success", member: [] });

        });

    },


    //Friend

    addFriend: function (data) {

        model.addFriend(data, function (msg) {

            model.getFriendpage(data.username, function (friends) {

                friends["result"] = msg;

                view.DrawFriendPage(data.socketid, friends);

            });
        });
     
    },

    removeFriend: function (data) {

        model.removeFriend(data, function (msg) {

            model.getFriendpage(data.username, function (friends) {

                friends["result"] = msg;

                view.DrawFriendPage(data.socketid, friends);

            });
        });

    },

    drawFriend: function (data) {

        model.drawFriend(data, function (msg) {

            model.getFriendpage(data.username, function (friends) {

                friends["result"] = msg;

                view.DrawFriendPage(data.socketid, friends);

            });
        });

        
    },

    confirmFriend: function (data) {

        model.confirmFriend(data, function (msg) {

            model.getFriendpage(data.username, function (friends) {

                friends["result"] = msg;

                view.DrawFriendPage(data.socketid, friends);

            });


        });

    },

    denyfriend: function (data) {

        model.denyFriend(data, function (msg) {

            model.getFriendpage(data.username, function (friends) {

                friends["result"] = msg;

                view.DrawFriendPage(data.socketid, friends);

            });

        });

    },

//Billboard

    addBillboard: function (data) {
        if (data.boardName == "dynamicPage") return;
        model.addBillboard(data, function (msg) {

            if (msg) {
                model.getAdminPage(data.username, function (board, applyboard, user) {
                    view.adminPage(data.socketid, board, applyboard, user, msg);
                });
            }
        });
    },

    choseBillboard: function (data) {

        model.getArticlepage(data.username, data.boardName, function (allarticle) {

            view.articlePage(data.socketid, data.boardName, allarticle);
        })
    },

    deleteBillboard:function (data) {
        model.deleteBillboard(data, function (msg) {
            model.getAdminPage(data.username,function (board, applyboard, user) {
                view.adminPage(data.socketid, board, applyboard, user, msg);
            });
        });
    },

    admitBillboard:function (data) {
        model.admitBillboard(data, function (msg) {
            model.getAdminPage(data.username, function (board, applyboard, user) {
                view.adminPage(data.socketid, board, applyboard, user, msg);
            });
        });
    },

    denyboard: function (data) {
        model.denyboard(data, function (msg) {
            model.getAdminPage(data.username,function (board, applyboard, user) {
                view.adminPage(data.socketid, board, applyboard, user, msg);
            });
        });
    },

    assignBillboardManager:function (data) {
        model.assignBillboardManager(data, function (msg) {
            model.getAdminPage(data.username,function(board, applyboard, user) {
                view.adminPage(data.socketid, board, applyboard, user, msg);
            });
        });
    },


//Article

    likeArticle: function (data) {
        model.likeArticle(data, function () {

            if (data.boardName == "dynamicPage") {

                model.getDynamicPage(function (allArticle) {

                    view.DynamicPage(data.socketid, allArticle);

                })
            }
            else {

                model.getArticlepage(data.username,data.boardName, function (allarticle) {
                    view.articlePage(data.socketid, data.boardName, allarticle);
                });
            }          
        });        
    },

    addArticle:function(data) {

        model.addArticle(data);

        model.getDynamicPage(function (allArticle) {

            view.DynamicPage(data.socketid, allArticle);

        })
    },

    deleteArticle:function (data) {
        model.deleteArticle(data, function (msg) {
            model.getArticlepage(data.username,data.boardName, function (allarticle) {
                view.articlePage(data.socketid, data.boardName, allarticle);
            });
        });
    },

//page

    requestpage:function (data) {

        if (global.isGuest(data.socketid) == true) {
            view.loginPage(data.socketid, "login First");
        }
        else {

            switch (data.data) {

                case 0:
                    model.getDynamicPage(function (articles) {
                        view.DynamicPage(data.socketid, articles);
                    });                    
                    break;
                case 1:
                    model.getFamilpage(global.loginUsers[data.socketid], function (result) {

                        view.FamilyPage(data.socketid, result);
                    });
                    break;
                case 2:
                    model.getFriendpage(global.loginUsers[data.socketid], function (result) {

                        view.DrawFriendPage(data.socketid,result);

                    });
                     break;
                case 3:
                    model.getMainpage(function (allbillboard) {

                        view.mainPage(data.socketid, allbillboard);

                    });
                    break;
                case 4:
                    model.getArticlepage("","", function (allarticle) {
                        view.articlePage(data.socketid,"",allarticle);
                    });
                     break;
                case 5: view.loginPage(data.socketid, "You\'re" + global.loginUsers[data.socketid]); break;
                case 6:
                    model.getAdminPage(data.username,function (board, applyboard, user) {
                        view.adminPage(data.socketid,board,applyboard,user,""); 
                    }); break;

            }

        }

    },

};

module.exports = controller;