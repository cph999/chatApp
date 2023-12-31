$(document).ready(function (){
    var socket = io();
    socket.on('connect', function() {
        socket.send("client connected");
        socket.emit('joinRoom',{
            room:1
        })
    });

    // $('form#joinRoom').submit(function (event){
    //     socket.emit('joinRoom',{
    //         // room:$('#roomNum').val()
    //         room:1
    //     })
    //     return false
    // });
    //
    // socket.on("roomJoined",function (msg,cb){
    //     // $("#chatContent").append('<li>' +msg.user + "已加入房间" +msg.room + '<\li>')
    //     // $("#chatContent").append('<li class="chat-item">' +'<img src="static/gpt.jpg" class="icon-head-gpt"\>' +" "+ '<div class="chat-content-box">'+msg.content+ '</div>'+ '<\li>')
    //     console.log("roomJoined")
    // })
    // $('#leave_room').on('click',function (){
    //     socket.emit('leaveRoom',{
    //         room:$('#roomNum').val()
    //     })
    // })
    // socket.on('roomLeftPersonal',function (msg){
    //     console.log("roomLeftPersonal")
    //     // $("#chatContent").append('<li>' +msg.user + "您已退出房间" +msg.room + '<\li>')
    //     // $("#chatContent").append('<li class="chat-item">' +'<img src="static/gpt.jpg" class="icon-head-gpt"\>' +" "+ '<div class="chat-content-box">'+msg.content+ '</div>'+ '<\li>')
    // })

    $('form#sendMsg').submit(function (event){
        // $("#chatContent").append('<li class="chat-item">' +'<img src="static/me.jpg" class="icon-head-me"\>' +" "+ '<div class="chat-content-box-me">'+$('#SendContent').val()+ '</div>'+ '<\li>')
        isrc = document.getElementById("self-icon-image").getAttribute("src");
        $("#chatContent").append('<li class="chat-item">' + '<div class="chat-content-box-me">'+$('#SendContent').val()+ '</div>' +" "+ '<img src='+isrc +' class="icon-head-me"\>'+ '<\li>')
        socket.emit("SendContent",{
            room:1,
            uid: document.getElementById("uid").innerText,
            content:$('#SendContent').val()
        })
        $('#SendContent').val("")
        return false
    })
    // socket.on("messageReceived",function (msg,cb){
    //     $("#chatContent").append('<li>' +msg.user + "说:" +msg.content + '<\li>')
    // })

    socket.on("messageReceived",function (msg){
        if(document.getElementById("uid").innerText != msg['uid']){
            $("#chatContent").append('<li class="chat-item">' +'<img src='+msg["images"] +' class="icon-head-other"\>' +" "+ '<div class="chat-content-box-other">'+msg.content+ '</div>'+ '<\li>')
        }
    })
    let chats = document.getElementById("chatsContent").innerText.replace(/'/g, '"');
    let chatList = JSON.parse(chats);
    for(let i = 0; i < chatList.length; i++){
        $("#chatItems").append('<li class="chatItem">' +chatList[i]["group_id"]+" "+chatList[i]['group_name']+ '<\li>')
    }
    var aliWebrtc = new AliRtcEngine(option);
})
