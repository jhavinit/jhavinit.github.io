let sip_server = '@sipjs.onsip.com';
let randomCode = undefined;
let username;
let password;
let newUser;
var userAgent;
var remoteVideo;
var localVideo;
var session;
var session1;

// create room
function createRoom() {


    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    if (username.length == 0 || password.length == 0) {
        document.getElementById("alertNotification").style.display = "block";
        return;
    }
    randomCode = password;
    newUser = {
        username: username,
        uri: `${username}.${randomCode}${sip_server}`,
        randomCode: randomCode
    }
    document.getElementById("index-header").style.display = "none";
    document.getElementById("video-stream").style.display = "block";
    userAgent = new SIP.UA({
        traceSip: true,
        uri: newUser.uri,
        displayName: newUser.username
    });

}

// start video call caller side
function startVideoCall() {

    remoteVideo = document.getElementById('remoteVideo');
    localVideo = document.getElementById('localVideo');

    var pc = session.sessionDescriptionHandler.peerConnection;

    var remoteStream = new MediaStream();
    pc.getReceivers().forEach(function (receiver) {
        remoteStream.addTrack(receiver.track);
    });
    remoteVideo.srcObject = remoteStream;
    remoteVideo.play();

    var localStream = new MediaStream();
    pc.getSenders().forEach(function (sender) {
        localStream.addTrack(sender.track);
    });
    localVideo.srcObject = localStream;
    localVideo.play();

}

// add participant
function addParticipant() {

    let participant_username = document.getElementById("username-participant").value;
    let participantNewUser = {
        username: participant_username,
        uri: `${participant_username}.${randomCode}${sip_server}`,
        randomCode: randomCode
    }
    document.getElementById("add-participant-body").style.display = "none";
    document.getElementById("main-video-body").style.display = "block";

    session = userAgent.invite(participantNewUser.uri);

    document.getElementById("call-during-connected-body").style.display = "block";

    session.on('failed', function (response, cause) {
        document.getElementById("start-video-call-body").style.display = "none";
        document.getElementById("main-video-body").style.display = "none";
        document.getElementById("call-disconnected-body").style.display = "block";
    });
    session.on('accepted', function (data) {
        document.getElementById("call-connected-body").style.display = "block";

        document.getElementById("start-video-call-body").style.display = "block";
    });
    session.on('terminated', function (message, cause) {
        document.getElementById("call-terminated-body").style.display = "block";
    });

}




// start video call recceive side
function startVideoCallRecieve() {

    remoteVideo = document.getElementById('remoteVideo');
    localVideo = document.getElementById('localVideo');

    var pc = session1.sessionDescriptionHandler.peerConnection;
    // Gets remote tracks
    var remoteStream = new MediaStream();
    pc.getReceivers().forEach(function (receiver) {
        remoteStream.addTrack(receiver.track);
    });
    remoteVideo.srcObject = remoteStream;
    remoteVideo.play();

    // Gets local tracks
    var localStream = new MediaStream();
    pc.getSenders().forEach(function (sender) {
        localStream.addTrack(sender.track);
    });
    localVideo.srcObject = localStream;
    localVideo.play();
}

// recieve call
function createUAandRecieveCall() {

    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    if (username.length == 0 || password.length == 0) {
        document.getElementById("alertNotification").style.display = "block";
        return;
    }



    document.getElementById("index-header").style.display = "none";
    document.getElementById("video-stream").style.display = "block";
    document.getElementById("add-participant-body").style.display = "none";
    document.getElementById("main-video-body").style.display = "block";
    document.getElementById("waiting-call").style.display = "block";

    randomCode = password;

    newUser = {
        username: username,
        uri: `${username}.${randomCode}${sip_server}`,
        randomCode: randomCode
    }


    userAgent = new SIP.UA({
        traceSip: true,
        uri: newUser.uri,
        displayName: newUser.username
    });


    userAgent.on('invite', function (session) {

        document.getElementById("incoming-call-body").style.display = "block";

        session1 = session;
        session.accept();

        document.getElementById("call-during-connected-body").style.display = "block";

        session1.on('failed', function (response, cause) {
            document.getElementById("start-video-call-body-recieve").style.display = "none";
            document.getElementById("main-video-body").style.display = "none";
            document.getElementById("call-disconnected-body").style.display = "block";
        });
        session1.on('accepted', function (data) {
            document.getElementById("call-connected-body").style.display = "block";
            document.getElementById("start-video-call-body-recieve").style.display = "block";
        });
        session1.on('terminated', function (message, cause) {
            document.getElementById("call-terminated-body").style.display = "block";
        });

    });

}

// end call
function endcall() {
    session.terminate();
    window.location.href = 'index.html';
}

// go home button
function goHome() {
    window.location.href = 'index.html';
}