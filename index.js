let emails = document.getElementById('emails');
let list = document.getElementById('email-list');
// handler to  recieve emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // get emails
    let emails = request.getemails;

    // display emails on popup
    if (emails == null || emails.length == 0) {
        let li = document.createElement('li');
        li.innerText = "No Email Found";
        list.appendChild(li);
    }
    else {
        emails = new Set(emails);
        emails.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
        })
    }
})

// button's click event listener
emails.addEventListener("click", async () => {

    // get current active tab
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });

    // execute script to parse emails on page
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scrapeEmailsFromPage,
    });
})

// function to scrape emails
function scrapeEmailsFromPage() {
    // RegEx to parse emails from html code
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    //  parse emails from html of the page
    let getemails = document.body.innerHTML.match(emailRegEx);

    // send emails to popup
    chrome.runtime.sendMessage({ getemails });

}

