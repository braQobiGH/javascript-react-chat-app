//cometchat login

import CCManager from './../../lib/cometchat/ccManager';
import { CometChat, sendMessage } from '@cometchat-pulse/cometchat-pulse.js';


//set User Session
export const loginInCC = (dispatch, UID) => {
    return dispatch => {

        CometChat.login(UID, CCManager.apiKey).then(user => {
            console.log("AppUser Information :", { user });
            addMessageListener(dispatch);
            return dispatch(setUserSession(user));

        }).catch(error => {

            console.log("Print Error : ", { error });
        });


    }
}

export const setUserSession = (val) => {
    return {
        type: "setUserSession",
        user: val,
    };
}


//setActiveUser

export const setActiveMessages = (uid, type) => {
    console.log("inside setActiveMessages " + uid + " type : " + type);
    return dispatch => {
        //dispatch(getUserMessageHistory(uid,50));
        return dispatch(setActiveMessage(uid, type));
    };
};



export const setActiveMessage = (key, val) => {

    console.log("inside setActiveMessage " + key + " type : " + val);
    return {
        type: "updateActiveMessage",
        uid: key,
        utype: val,
    };
}


//get the user
export const getUsers = (limit = 50) => {
    CCManager.usersRequest = CCManager.usersRequestBuilder.setLimit(limit).build();

    return dispatch => {
        CCManager.usersRequest.fetchNext().then(users => {

            dispatch(updateHandler());
            return dispatch(updateUserList(users));
        }, error => {
            console.log("Print Error : " + JSON.stringify(error));
        });
    }
}

export const getNextUserList = () => {
    return dispatch => {
        CCManager.usersRequest.fetchNext().then(users => {
            console.log("new users", JSON.stringify(users));
            return dispatch(updateUserList(users));
        }, error => {
            console.log("Print Error : " + JSON.stringify(error));
        });
    }
}



export const updateHandler = () => {
    return {
        type: 'UPDATED_STAGE',
    }
}
//Set UpdateUserList

export const updateUserList = (val) => {
    return {
        type: 'updateUserList',
        users: val,
    }
}

//getGroups
export const getGroups = (limit = 50) => {

    CCManager.groupRequest = CCManager.groupsRequestBuilder.setLimit(limit).build();

    return dispatch => {
        CCManager.groupRequest.fetchNext().then(groups => {
            dispatch(updateHandler());
            return dispatch(updateGroupList(groups));
        }, error => {
            console.log("Print Error : " + JSON.stringify(error));
        });
    }
}

//getGroups
export const getNextGroupList = () => {

    return dispatch => {
        CCManager.groupRequest.fetchNext().then(groups => {
            console.log("Group Request output : " + JSON.stringify(groups));
            return dispatch(updateGroupList(groups));
        }, error => {
            console.log("Print Error : " + JSON.stringify(error));
        });
    }
}

//UpdateGroupList
export const updateGroupList = (val) => {
    return {
        type: 'updateGroupList',
        groups: val,
    }
}


//addMessageListener 

export const addMessageListener = (dispatch) => {
    console.log("inside addMessageListener ccAction", { dispatch });
    CCManager.addMessageListener(dispatch);
    CCManager.addUserEventListener(dispatch);
    CCManager.addGroupEventListener(dispatch);
    dispatch(updateHandler());

}

//handle action message

export const handleActionMessage = (actionMsg) => {
    console.log("Action Message recieved : " + JSON.stringify(actionMsg));
    return {
        type: 'NoAction',

    }

}

//handle Text Message 

export const handleTextMessage = (msg, dispatch) => {

    console.log("Text Message recieved from : " + msg.sender);
    dispatch(updateMessage(msg.sender, msg, "text Recieved : "));
}

//handle Media Message 

export const handleMediaMessage = (msg) => {
    console.log("Media Message recieved : " + JSON.stringify(msg));
    return {
        type: 'NoAction',
    }
}


//sendMessage 

export const sendTextMessage = (uid, text, msgType) => {
    console.log("messazgetype " + msgType);

    let textMessage = CCManager.getTextMessage(uid, text, msgType); 

        return dispatch => {
            CometChat.sendMessage(textMessage).then(
                (message) => {
                    // if(message instanceof TextMessage){
                    //console.log("mesage callback : " + JSON.stringify(message));
                    return dispatch(updateMessage(uid, message, "sendText"));
                    //}


                }, (error) => {
                    console.log("mesage callback error : " + JSON.stringify(error));
                    //Handle any error
                });
        }
}





export const updateMessage = (user, val, tag) => {
    return {
        type: "updateMessage",
        message: val,
        uid: user,
        tags: tag
    }
}

export const updateMessageList = (message, val) => {
    return {
        type: "updateMessageList",
        messages: message,
        uid: val
    }
}

//getUserMessageHistory
export const getUserMessageHistory = (uid, limit = 50) => {

    console.log("user id for other party : " + uid);

    // let uid="SUPERHERO2" //Uid of the user with the communication is happening.;

    let messageRequest = CCManager.messageRequestBuilder(uid, limit);

    return dispatch => {
        messageRequest.fetchPrevious().then(messages => {

            console.log("mesage callback : " + JSON.stringify(messages));
            // handle list of messages received
            return dispatch(updateMessageList(messages, uid));

        }).catch(error => {
            //         // handle exception
            console.log("mesage callback error : " + JSON.stringify(error));
        });
    }

}

//export const getGroupMessageHistory=()


//set startFetching 

export const startFetching = () => {
    return {
        type: "SYNC_STARTED",
        status: 1
    }
}



