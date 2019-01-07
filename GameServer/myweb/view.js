var model = require("./Model");
var global = require("./global");

const view = {

    DynamicPage:function (socketid,articles) {

        if (socketid == null) return;

        global.connectedSockets[socketid].emit("response", {
            no: 20,
            boardName: "dynamicPage",
            AllArticle: articles
        });    

    },

    FamilyPage:function (socketid,family) {
        if (socketid == null) return;

        global.connectedSockets[socketid].emit("response", {
            no: 21,
            family: family.name,
            familyMember:family.member
        });    

    },

    DrawFriendPage:function (socketid,friends) {

        if (socketid == null) return;

        global.connectedSockets[socketid].emit("response", {
            no: 22,
            AllFriend: friends.allfriends,
            NewFriend: friends.newfriends,
            result: friends.result,
        });    

    },

    mainPage:function (socketid,boards) {
        if (socketid == null) return;

        global.connectedSockets[socketid].emit("response", {
            no: 23,
            AllBoard: boards,
        });     

    },

    articlePage:function (socketid,boardname,articles) {

        if (socketid == null) return;

        global.connectedSockets[socketid].emit("response", {
            no: 24,
            boardName: boardname,
            AllArticle: articles
        });     
    },

    loginPage: function (socketid, msg) {       
     
        if (socketid == null) return;

        global.connectedSockets[socketid].emit("response", {
                no: 25,
                Result:msg
        });               
    },

    adminPage: function (socketid,boards, applyboard, user, msg) {
        if (socketid == null) return;
        global.connectedSockets[socketid].emit("response", {
            no:29,
            board: boards,
            applyBoard: applyboard,
            account: user,
            Result:msg
        });

    }


};

module.exports = view;