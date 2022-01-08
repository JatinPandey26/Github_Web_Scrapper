const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

let url = "https://github.com/topics";

// fetching url of 3 topics

request(url,cb);

function cb(error,response,html){
    if(!error){

    let $ = cheerio.load(html);
    getLinkOF3topics($);
    }
}
function getLinkOF3topics($){
if(fs.existsSync('./Issues') == false   ) fs.mkdirSync('./Issues');
let LinkArray = $('.d-flex.flex-wrap.flex-justify-start.flex-items-stretch.list-style-none.gutter.my-4 li').find('.no-underline.d-flex.flex-column.flex-justify-center');

for(let i = 0 ; i < LinkArray.length ; i++){
    
    let folderName = $(LinkArray[i]).attr('href').split('/')[2];
    let folderPath = path.join(__dirname, 'Issues' ,folderName);
    // console.log(folderName);
    if(fs.existsSync(folderPath) == false   ) fs.mkdirSync(folderPath);
    let topicURL = 'https://github.com' + $(LinkArray[i]).attr('href');
    // console.log(topicURL);
    getTop8Repos(topicURL,folderPath);
}
}

function getTop8Repos(topicURL,folderPath){

request(topicURL,cb);

function cb(error,response,html){
    if(!error){

        let selTool = cheerio.load(html);
        
        let articles = selTool('.topic.p-responsive.container-lg .border.rounded.color-shadow-small.color-bg-subtle.my-4');
        
        for(let i  = 0 ; i < 8 ; i++){
        let buttons = selTool(articles[i]).find('nav li a');
        //  console.log(buttons.length);
        
        let repoIssuesURL = 'https://github.com' + selTool(buttons[1]).attr('href');
        // console.log(repoIssuesURL);
        let repoPath = path.join(folderPath,`Repo - ${i+1}`);
        if(fs.existsSync(repoPath) == false   ) fs.mkdirSync(repoPath);
        getIssues(repoIssuesURL,repoPath);

        }



        }
}

}
function getIssues(repoIssuesURL,folderPath){

request(repoIssuesURL,cb);

function cb(error,response,html){ 

 if(!error){

  let $ = cheerio.load(html);
  
  let Issues = $('.js-navigation-container.js-active-navigation-container .Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title');
  let issueString = "";
  for(let i = 0 ; i < Issues.length ; i++){
      issueString += ($(Issues[i]).text()) + "\n";
  }
  let pdfFilePath = path.join(folderPath , 'issues.pdf');
  let pdfDoc = new pdfDocument;
  pdfDoc.pipe(fs.createWriteStream(pdfFilePath));
  pdfDoc.text(issueString);
  pdfDoc.end();
  
 }

}
}