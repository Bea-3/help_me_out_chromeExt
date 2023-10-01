console.log("Hi, i have been injected")

var recorder = null

function onAccessApproved(stream){
    recorder = new MediaRecorder(stream);

    recorder.start();

    let recordedChunks = []; //to store the data chunks

    recorder.onstop = function (){
        stream.getTracks().forEach(function(track){
            if(track.readyState === "live"){
                track.stop()
            }
        });

        // create a blob from the recorded data chunks
        const recordedBlob = new Blob(recordedChunks, {type: 'video/webm'});

        // send blob to endpont
        sendRecordedVideo(recordedBlob);
    };

    recorder.ondataavailable = function(event){
        if (event.data.size > 0){
            recordedChunks.push(event.data);
        }
    };
    
}

// send the video to an End Point
function sendRecordedVideo(blob){
    const formData = new FormData();
    formData.append('video', blob, 'screen-recording.webm'); //video is the field name

    fetch('https://chrome-ext-api.onrender.com/api/upload', {
        method: "POST",
        body: formData,
    }).then(response => {
        if (response.ok){
            console.log('Video successfully sent')
        }else{
            console.error('Failed to send video:', response.statusText);
        }
    }).catch(error => {
        console.log('Error', error);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.action === "request_user_permission"){
        console.log("requesting recording permission")

        sendResponse(`processed: ${message.action}`)

        // request browser to grant permission for recording feature

        navigator.mediaDevices.getDisplayMedia({
            audio:true,
            video: {
                width: 9999999999,
                height: 9999999999
            }
        }).then((stream) => {
            onAccessApproved(stream)
        })
    }

    if(message.action === "stopvideo"){
        console.log("stopping video");
        sendResponse(`processed: ${message.action}`);
        if(!recorder){
            return console.log("no recorder")
        }else{
            recorder.stop();
        }
    }
})

