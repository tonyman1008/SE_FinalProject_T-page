
var global = {

	connectedSockets : {},
	loginUsers : {},

	isGuest: function (socketid) {

		return !this.loginUsers.hasOwnProperty(socketid);

	},

	getSocketByName : function (name) {

	    for (var i = 0; i < Object.keys(this.loginUsers).length; i++) {
		
	        if (this.loginUsers[Object.keys(this.loginUsers)[i]] == name) {
	            return this.connectedSockets[Object.keys(this.loginUsers)[i]];
				
			}
		}

		return null;
	},


	checkIsOnline: function () {

	    for (var i = 0; i < Object.keys(this.connectedSockets).length; i++) {

	        if (this.connectedSockets[Object.keys(this.connectedSockets)[i]].connected == false) {

	            delete this.loginUsers[this.connectedSockets[Object.keys(this.connectedSockets)[i]].id];
	            delete this.connectedSockets[Object.keys(this.connectedSockets)[i]];
	        }
	    }

	},

	LogconnectedUser: function () {

        console.log("Connected :", Object.keys(global.connectedSockets));
        console.log("Logined :", Object.keys(global.loginUsers));
    }

};
module.exports = global;