document.addEventListener("DOMContentLoaded", ()=>{
    // GET selectors buttons for the recording
    const startVideoButton = document.querySelector("button.start-record")
    const stopVideoButton = document.querySelector("button.stop-record")

    // add event listeners
    startVideoButton.addEventListener("click", ()=>{
        // get current/active tab  tabs will be an array
        chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "request_user_permission"}, function(response){
                if(!chrome.runtime.lastError){
                    console.log(response)
                }else{
                    console.log(chrome.runtime.lastError, 'error line 14')
                }
            })
        })
    })

    stopVideoButton.addEventListener("click", ()=>{
        // get current/active tab  tabs will be an array
        chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "stopvideo"}, function(response){
                if(!chrome.runtime.lastError){
                    console.log(response)
                }else{
                    console.log(chrome.runtime.lastError, 'error line 27')
                }
            })
        })
    })
})



