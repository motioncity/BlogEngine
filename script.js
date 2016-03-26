window.addEventListener("hashchange", function(){
  
  if(location.hash=="#home" && change!=0){
    goHome();
    change=0;
  }
  else if(location.hash=="#create" && change!=1){
    goCreate();
    change=1;
  }
  else if(location.hash.substring(1).length=='1'){
    extraction(parseInt(location.hash.substring(1)));
  }
  else if(change!=0 && change!=1){
    goHome();
    change=0;
  }
})
//Variables
location.hash = "home";
var change = 0;
var freshCreate = document.getElementById("create").innerHTML;
var numSections = 1;
var hasImage = [];
var orientationValues = [];
var currentPage= "home";


var currentTitle;
var currentHeaders =[];
var currentParagraphs=[];
var currentImages = [];

var currentSectionColor;
var currentBorder;
var currentBackgroundColor; 

var clearCurrents = function()
{
  hasImage = [];
 orientationValues = [];
   currentTitle="";
 currentHeaders =[];
 currentParagraphs=[];
 currentImages = [];

 currentSectionColor ="";
 currentBorder = "";
 currentBackgroundColor = ""; 

}


//Styling Variables

var sectionColor = "lightRedBg";
var borderChoice = "noBorder";
var backgroundColor = "darkRedBg";



//Database Functionality
var myDB = new Firebase("https://victor-blogengine.firebaseio.com/");
var allPostsRef = myDB.child("AllPosts");


//Page that displays posts

var displayPosts = function()
{
  
  var myDB = new Firebase("https://victor-blogengine.firebaseio.com/");
  var listofPosts = document.getElementById("listofPosts");
  myDB.once('value', function(ss){
  for(var key in ss.val().AllPosts)
  { 
     var currentPost =  (ss.val().AllPosts[key]); 
    var newPostContainer = document.createElement("div");
    newPostContainer.className = "postContainer";
    
   
    var newKey = document.createElement("p");
    newKey.innerHTML = key;
    newKey.className = "keyName";
    newKey.classList.add("hidden");
    newPostContainer.appendChild(newKey);
    
    
    var newpostTitle = document.createElement("p");
    newpostTitle.className = "postTitle";
    newpostTitle.innerHTML = currentPost.Title;
    newPostContainer.appendChild(newpostTitle);
    
    var clickHere = document.createElement("p");
    clickHere.className = "clickHere";
    var newText = document.createTextNode("Click here to view post");
    clickHere.appendChild(newText);
    newPostContainer.appendChild(clickHere);
    
    newPostContainer.classList.add("light"+currentPost.ColorScheme +"Bg");
    postingcontainer.push(newPostContainer.children[0].innerHTML);
    newPostContainer.spot = postingcontainer.length-1;
    newPostContainer.addEventListener('click', function(){
        console.log(this.spot);
        extraction(this.spot);
});
    listofPosts.appendChild(newPostContainer);

  }
    
});
}
function extraction(num){
  location.hash = num;
  change=2;
  if(postingcontainer[num]!=null){
  extractPost(postingcontainer[num]);
  }
  else{
    goHome();
    
  }
}
var postingcontainer= [];
var saveSections = function(postRef) {
  var sectionRef = postRef.child("Sections");
  var headers = document.getElementsByClassName("header");
  var paragraphs = document.getElementsByClassName("paragraphs");
  var images = document.getElementsByClassName("images");

  for (i = 0; i < numSections; i++) {
    sectionRef.push({
      header: headers[i].value,
      paragraph: paragraphs[i].value,
      image: images[i].value
    });
  }
}

var saveHasImage = function(postRef) {
  var hasImgRef = postRef.child("HasImage");
  var images = document.getElementsByClassName("images");

  for (i = 0; i < images.length; i++) {
    if (images[i].value.length == 0) {
      hasImgRef.push({
        hasImage: false
      });
    } else {
      hasImgRef.push({
        hasImage: true
      });
    }
  }
}

var saveOrientations = function(postRef) {
  var orientationRef = postRef.child("OrientationValues");
  var orientations = document.getElementsByClassName("choices");

  for (i = 0; i < orientations.length; i++) {
    if (orientations[i].value == "left") {
      orientationRef.push({
        OrientationValue: "left"
      });
    } else {
      orientationRef.push({
        OrientationValue: "right"
      });
    }
  }
}

var savePost = function() {
  var currentPost = allPostsRef.push();

  currentPost.set({
    Title: document.getElementById("title").value,
    ColorScheme: document.getElementById("colorOptions").value,
    BorderStyle: document.getElementById("borderOptions").value
  });
  saveSections(currentPost);
  saveHasImage(currentPost);
  saveOrientations(currentPost);
}


/* Appending/Creating Posts for display */


var extractPost = function(currentKey)
{
  clearCurrents();
  var myDB = new Firebase("https://victor-blogengine.firebaseio.com/");
  myDB.once('value', function(ss){
  for(var key in ss.val().AllPosts)
  {
    if(currentKey == key){
      var currentPost = ss.val().AllPosts[currentKey];
       currentTitle = currentPost.Title;
       currentBorder = currentPost.BorderStyle;
       currentBackgroundColor = "dark" +currentPost.ColorScheme + "bg";
       currentSectionColor = "light" +currentPost.ColorScheme + "bg";
       
      for(var key2 in currentPost.Sections)
    {
     currentHeaders.push(currentPost.Sections[key2].header);
     currentParagraphs.push(currentPost.Sections[key2].paragraph);
     currentImages.push(currentPost.Sections[key2].image);
    }
       for(var key2 in currentPost.OrientationValues)
    {
     orientationValues.push(currentPost.OrientationValues[key2].OrientationValue);
    }
      for(var key2 in currentPost.HasImage)
    {
     hasImage.push(currentPost.HasImage[key2].hasImage);
    }
    break;
    }
  }
  viewPost();
});

}


var appendTitle = function() {
  var title = document.createElement("h1");
  var node = document.createTextNode(currentTitle);
  title.appendChild(node);
  title.id = "currentPostTitle";

  document.getElementById("currentPost").appendChild(title);
}


var appendHeader = function(value, section) {
  var header = document.createElement("h2");
  var node = document.createTextNode(value);
  header.appendChild(node);
  header.className = "currentPostHeader";
  
  section.appendChild(header);
}

function test(){
  console.log("test");
}
var appendParaImg = function(para, img, section) {
  var newPara = document.createElement('div');
  
  newPara.className = "currentPostPara";
  section.className += " padded";
  newPara.innerHTML = para;

  if (img.length == 0) {
    hasImage.push(false);
    section.appendChild(newPara);
  } else {
    hasImage.push(true);
    var newContainer = document.createElement("div");
    newContainer.className = "paraImgContainer";
    section.appendChild(newContainer);
    var newImage = document.createElement("img");
    newImage.src = img;
    newImage.style.margin = "10px";
    newImage.className = "currentImages";

    newContainer.appendChild(newImage);
    newContainer.appendChild(newPara);
  }

}


var appendPost = function() {
  appendTitle();
  
  for (i = 0; i < currentHeaders.length; i++) {
    var section = document.createElement("div");
    section.className = "section";
    appendHeader(currentHeaders[i], section);
    appendParaImg(currentParagraphs[i], currentImages[i], section);
    section.style.marginDown = "30px";
     document.getElementById("currentPost").className+=" padded";
     checker = 1;
    document.getElementById("currentPost").appendChild(section);
  }

}

//Style Editing

var handleColor = function() {
  var choice = document.getElementById("colorOptions").value;
  backgroundColor = "dark" + choice + "Bg";
  sectionColor = "light" + choice + "Bg";
}

var handleBorder = function() {
  borderChoice = document.getElementById("borderOptions").value;
}

var applyOrientationBETA = function() {
  var orientations = document.getElementsByClassName("choices");
  var paraImgContainers = document.getElementsByClassName("paraImgContainer");
  for (i = 0; i < orientations.length; i++) {
    orientationValues.push(orientations[i].value);
  }

  for (i = 0; i < orientationValues.length; i++) {

    if ((hasImage[i]) && (orientationValues[i] == "right")) {
      paraImgContainers[i].classList.add("right");
    }
  }
}

var applyOrientation = function() {
  var paraImgContainers = document.getElementsByClassName("paraImgContainer");

  for (i = 0; i < orientationValues.length; i++) {

    if ((hasImage[i]) && (orientationValues[i] == "right")) {
      paraImgContainers[i].classList.add("right");
    }
  }
}

var applyBackgroundColor = function() {
  document.body.className = currentBackgroundColor;
}

var applySectionStylesbETA = function() {
    Array.prototype.forEach.call(document.querySelectorAll(".section"), function(el) {
      el.classList.add(sectionColor);
    });

    Array.prototype.forEach.call(document.querySelectorAll(".section"), function(el) {
      el.classList.add(borderChoice);
    });
}

var applySectionStyles= function() {
    Array.prototype.forEach.call(document.querySelectorAll(".section"), function(el) {
      el.classList.add(currentSectionColor);
    });

    Array.prototype.forEach.call(document.querySelectorAll(".section"), function(el) {
      el.classList.add(currentBorder);
    });
}

var applyStyles = function() {
  applyBackgroundColor();
  applySectionStyles();
  applyOrientation();
}

var viewPost = function(){
    goPost();
  appendPost();
  applyStyles();
}


//Code for adding more textarea boxes to create screen

var createHeaders = function() {
  var newHeader = document.createElement("TEXTAREA");
  newHeader.placeholder = "Place text for Header in here";
  newHeader.rows = "3";
  newHeader.cols = "30";
  newHeader.className = "header";
  document.getElementById("create").appendChild(newHeader);
}

var createParagraphs = function() {
  var newParagraph = document.createElement("TEXTAREA");
  newParagraph.placeholder = "Place text for Paragraph in here"
  newParagraph.rows = "5";
  newParagraph.cols = "55";
  newParagraph.className = "paragraphs";

  document.getElementById("create").appendChild(newParagraph);
}

var createImages = function() {
  var newContainer = document.createElement("div");
  newContainer.className = "container";
  document.getElementById("create").appendChild(newContainer);

  var newImage = document.createElement("TEXTAREA");
  newImage.placeholder = "Place image url in here";
  newImage.rows = "3";
  newImage.cols = "55";
  newImage.className = "images";

  var newOrientation = document.createElement("p");
  var node = document.createTextNode("Image orientation ");
  newOrientation.appendChild(node);

  var newSelect = document.createElement("select");
  newSelect.className = "choices";
  var left = document.createElement("option");
  left.value = "left";
  left.text = "Left";

  var right = document.createElement("option");
  right.value = "right";
  right.text = "Right";

  newSelect.appendChild(left);
  newSelect.appendChild(right);

  newContainer.appendChild(newImage);
  newContainer.appendChild(newOrientation);
  newContainer.appendChild(newSelect);

}

var createSections = function() {
  createHeaders();
  createParagraphs();
  createImages();
  numSections++;
}

var removeSections = function() {
  var containers = document.getElementsByClassName("container");
  var headers = document.getElementsByClassName("header");
  var paragraphs = document.getElementsByClassName("paragraphs");
  if (numSections > 1) {
    headers[numSections - 1].parentNode.removeChild(headers[numSections - 1]);
    paragraphs[numSections - 1].parentNode.removeChild(paragraphs[numSections - 1]);
    containers[numSections - 1].parentNode.removeChild(containers[numSections - 1]);
    numSections--;
  }
}


//Page Transitions
var clearCreate = function() {
   document.getElementById("create").innerHTML = freshCreate;
  document.getElementById("sectionButton").addEventListener('click', createSections);
  document.getElementById("createButton").addEventListener('click', createPost);
  document.getElementById("removeButton").addEventListener('click', removeSections);
 var numSections = 1;
}

var createPost = function() {
  savePost();
  clearCreate();
}

var pageHandler = function()
{
  if(currentPage == "home")
    {
      
      document.getElementById("listofPosts").innerHTML = "";
    }
  else if (currentPage == "create")
  {
    document.getElementById("create").classList.add("hidden");
  }
  
  else if (currentPage == "post")
  {
    document.getElementById("currentPost").innerHTML = "";
    document.body.className ="";
  }
}

var goPost = function()
{
  pageHandler();
  currentPage = "post";
}
var checker = 0;
var goHome = function()
{
  postingcontainer= [];
  pageHandler();
  displayPosts();
  if(checker==1){
    document.getElementById("currentPost").className-=" padded";  
    checker = 0;
  }
  change = 0;
  location.hash = "home";
  currentPage = "home";
}

var goCreate = function()
{
  pageHandler();
  if(checker==1){
    document.getElementById("currentPost").className-=" padded";  
    checker = 0;
  }
  document.getElementById("create").classList.remove("hidden");
  location.hash = "create";
  change = 1;
  currentPage = "create";
}




//Event Handling
document.getElementById("sectionButton").addEventListener('click', createSections);

document.getElementById("createButton").addEventListener('click', createPost);

document.getElementById("removeButton").addEventListener('click', removeSections);

document.getElementById("home").addEventListener('click',goHome);

document.getElementById("write").addEventListener('click',goCreate);

test();