var mysql = require('mysql');

const SQL = {

    tmp:null,

    //設定MySQL connection
    con: mysql.createConnection({
        host: "localhost",
        user: "tony",
        password: "123456",
        port: 3306,
        database: 't-page',
        dateStrings: true
    }),

    connect: function () {
        var test1 = this.test;
        this.con.connect(function (err) {
            if (err) throw err;
            console.log("Server Connect!!!")
        })
    },

    ////dynamic page
    //按讚
    likeArticle: function (ArticleNo,callback) {
        var Sql = "UPDATE article SET like_count=like_count+1 WHERE no=" + ArticleNo;
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);

            callback();
        });
    },

    //發文
    poArticle: function (Date, Author, Content, BoardName) {
        var Sql = "INSERT INTO article (date, author, like_count, content, board_name) VALUES ?";
        var SqlParams = [
            [Date, Author, 0, Content, BoardName]
        ];
        this.con.query(Sql, [SqlParams], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    ////family page
    //創立家族
    createFamily: function (UserName, FamilyName) {
        var Sql = "INSERT INTO family (name) VALUES ?";
        var SqlParams = [
            [FamilyName]
        ];
        this.con.query(Sql, [SqlParams], function (err, result) {
            if (err) throw err;
            console.log(result);
        });

    },

    //加入家族
    joinFamily: function (UserName, FamilyName) {
        var Sql = "UPDATE user SET family ='" + FamilyName + "' WHERE name = '" + UserName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    //離開家族  
    exitFamily: function (UserName) {
        var Sql = "UPDATE user SET family = NULL WHERE name = '" + UserName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    //draw card page
    addFriend: function (UserName, FriendName) { //check if the new friend is already exist
        var Sql = "INSERT INTO to_be_friend (user_name,friend_name) VALUES ?";
        var SqlParams = [
            [FriendName, UserName]
        ];
        this.con.query(Sql, [SqlParams], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    deleteFriend: function (UserName, FriendName) {
        var Sql = "DELETE FROM friend WHERE user_name ='" + UserName + "' AND friend_name='" + FriendName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
        Sql = "DELETE FROM friend WHERE user_name ='" + FriendName + "' AND friend_name='" + UserName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    admitFriend: function (UserName, FriendName) {
        //from to_be_friend to friend
        var Sql = "INSERT INTO friend SELECT * FROM to_be_friend WHERE user_name ='" + UserName + "' AND friend_name='" + FriendName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) return;
            console.log(result);
        });

        var Sql = "INSERT INTO friend (user_name,friend_name) VALUE ?";
        var SqlParams = [
            [FriendName, UserName]
        ];
        this.con.query(Sql,[SqlParams], function (err, result) {
            if (err) return;
            console.log(result);
        });

        //delete to_be_friend
        Sql = "DELETE FROM to_be_friend WHERE user_name ='" + UserName + "' AND friend_name='" + FriendName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    denyFriend: function (UserName, FriendName) {
        //delete to_be_friend
        var Sql = "DELETE FROM to_be_friend WHERE user_name ='" + UserName + "' AND friend_name='" + FriendName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    //main page
    applyBillBoard: function (BoardName,callback) {
        var Sql = "INSERT INTO apply_board (name) VALUES ('" + BoardName + "')";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);

            callback();
        });
    },

    selectBillBoard: function (BoardName) {
        return new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM board WHERE name = '" + BoardName + "'";
            this.con.query(Sql, function (err, result) {
                //error
                if (err || result == "") {
                    reject();
                    return;
                }
                resolve(result);
            })
        })
    },

    //login page
    register: function (Account, Password) {
        var Sql = "INSERT INTO user (name,password,role) VALUES ?"
        var SqlParams = [
            [Account, Password, "user"]
        ];
        this.con.query(Sql, [SqlParams], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    //manage page
    createBillBoard: function (BoardName) {  //check user role
        var Sql = "INSERT INTO board (name) VALUES ('" + BoardName + "')"
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    deleteBillBoard: function (BoardName,callback) {
        var self = this;
        var Sql = "SELECT master FROM board WHERE name ='" + BoardName + "'";
        var master="";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            master = result;
            
            if (master != "") {
                Sql = "UPDATE user SET role = 'user' WHERE name ='" + master + "'";
                self.con.query(Sql, function (err, result) {
                    if (err) throw err;
            
                    Sql = "DELETE FROM board WHERE name ='" + BoardName + "'";
                    self.con.query(Sql, function (err, result) {
                        if (err) throw err;

                        callback();
                    });

                });
            }     
        });


        
    },

    admitBillBoard: function (BoardName,callback) {

        var self = this;
        var Sql = "INSERT INTO board(name) SELECT name FROM apply_board WHERE name='" + BoardName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);

            self.denyBillBoard(BoardName, callback);
        });

    },

    denyBillBoard: function (BoardName,callback) {
        var Sql = "DELETE FROM apply_board WHERE name='" + BoardName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);

            callback();

        });
    },

    assignMaster: function (BoardName, MasterName) {
        var self = this;
        var Sql = "SELECT master FROM board WHERE name ='" + BoardName + "'";
        var master = "";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            master = result[0].master;
            if (master != "") {
                Sql = "UPDATE user SET role = 'user' WHERE name ='" + master + "'";
                self.con.query(Sql, function (err, result) {
                    if (err) throw err;

                    Sql = "UPDATE user SET role = 'master' WHERE name='" + MasterName + "'";
                    self.con.query(Sql, function (err, result) {
                        if (err) throw err;
                        console.log(result);


                        Sql = "UPDATE board SET master = '" + MasterName + "' WHERE name='" + BoardName + "'";
                        self.con.query(Sql, function (err, result) {
                            if (err) throw err;
                            console.log(result);
                        });
                    });
                });
            }    
        });      
       

    },

    freezeAccount: function (freezeName) {
        var Sql = "UPDATE user SET state = 'freeze' WHERE name='" + freezeName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    deleteAccount: function (deleteName) {
        var Sql = "DELETE FROM user WHERE name='" + deleteName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    getElementWithCondition: async function (table, key, condition, callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM ?? WHERE ?? = ?";
            var TableName = table;
            var KeyName = key;
            var Condition = condition;
            this.con.query(Sql, [TableName, KeyName, Condition], function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }

                resolve(result[0]);
            })
        })
        var callbackValue = await pro;
        callback(callbackValue);
    },

    //getRoleOfUser: function(UserName) {
    //    return new Promise((resolve, reject) => {
    //        var Sql = "SELECT role FROM user WHERE name = '" + UserName + "'";
    //        this.con.query(Sql, function (err, result) {
    //            //error
    //            if (err) {
    //                reject();
    //                return;
    //            }
    //            resolve(result[0].role);
    //        })
    //    })
    //},

    //get all article
    getAllArticle: async function (callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM article";
            this.con.query(Sql, function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                resolve(result);
            })
        })
        var callbackValue = await pro;

        callback(callbackValue);
    },

    //get friend article
    getFriendArticle: async function (FriendName, callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM article WHERE author =?";
            var friend_name = FriendName;
            this.con.query(Sql, [friend_name], function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                resolve(result);
            })
        })
        var callbackValue = await pro;

        callback(callbackValue);
    },

    //get Hot article
    getHotArticle: async function (callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM article WHERE like_count >=5";
            this.con.query(Sql, function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                resolve(result);
            })
        })
        var callbackValue = await pro;

        callback(callbackValue);
    },

    //get board article
    getBoardArticle: async function (BoardName, callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM article WHERE board_name ='" + BoardName + "'";
            this.con.query(Sql, function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                resolve(result);
            })
        })
        var callbackValue = await pro;

        callback(callbackValue);
    },

    //get Member Of Family
    getMemberOfFamily: async function (FamilyName, callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT name FROM user WHERE family =?";
            var family_name = FamilyName;
            this.con.query(Sql, [family_name], function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                var nameArray = [];
                for (var i = 0; i < result.length; i++) {
                    nameArray.push(result[i].name);
                }
                resolve(nameArray);
            })
        })
        var callbackValue = await pro;

        callback(callbackValue);
    },

    //get all friend of user
    getAllFriendOfUser:async function (UserName, callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM friend WHERE user_name =?";
            var userName = UserName;
            this.con.query(Sql, [userName], function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                var nameArray = [];
                for (var i = 0; i < result.length; i++) {
                    nameArray.push(result[i].friend_name);
                }
                resolve(nameArray);

            })
        })
        var callbackValue = await pro;

        callback(callbackValue);
    },

    //get to_be_friend of user
    getToBeFriendOfUser: async function (UserName, callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM to_be_friend WHERE user_name =?";
            var userName = UserName;
            this.con.query(Sql, [userName], function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                var nameArray = [];
                for (var i = 0; i < result.length; i++) {
                    nameArray.push(result[i].friend_name);
                }

                resolve(nameArray);
            })
        })
        var callbackValue = await pro;

        callback(callbackValue);
    },

    //get all billboard
    getAllBoard: async function (callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM board ORDER BY no";
            this.con.query(Sql, function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                resolve(result);
            })
        })
        var callbackValue = await pro;

        callback(callbackValue);
    },

    isElementExist: async function (table, key,callback) {

        var pro= new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM ?? WHERE name = ?";
            if (table == "article")
                Sql = "SELECT * FROM ?? WHERE no = ?"
            var TableName = table;
            var ElementKey = key;
            this.con.query(Sql, [TableName, ElementKey], function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                if (result == "") {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            })
        })

        var callbackValue = await pro;       

        callback(callbackValue);
    },

    getAllDataOfTable: async function (table,callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT * FROM ??";
            var TableName = table;
            this.con.query(Sql, [TableName], function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }
                resolve(result);
            })
        })
        var callbackValue = await pro;

        callback(callbackValue);
    },

    defreezeAccount: function (freezeName) {
        var Sql = "UPDATE user SET state = NULL WHERE name='" + freezeName + "'";
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },

    getKeyValueOfElement:async function (table, key, condition, keyValue,callback) {
        var pro = new Promise((resolve, reject) => {
            var Sql = "SELECT ?? FROM ?? WHERE ?? = ?";
            var TableName = table;
            var KeyName = key;
            var Condition = condition;
            var KeyValue = keyValue;
            this.con.query(Sql, [KeyValue,TableName, KeyName, Condition], function (err, result) {
                //error
                if (err) {
                    reject();
                    return;
                }

                resolve(result[0][keyValue]);
            })
        })
        var callbackValue = await pro;
        callback(callbackValue);
    },

    deleteArticle: async function (ArticleNo, callback) {
        var Sql = "DELETE FROM article WHERE no = "+ArticleNo;
        this.con.query(Sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    },
};

module.exports = SQL;



