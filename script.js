// var ronniesmith = (async function() {
var ronniesmith = (async function() {
  var pub = {};

  const dialog = document.querySelector("#search-dialog-wrapper > dialog");
  const searchInputs = document.querySelectorAll(".search");
  const searchDialogWrapper = document.getElementById("search-dialog-wrapper");
  var lunrIdx;
  var json;

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-J4Y121DTE5');
  const firebaseConfig = {
    apiKey: "AIzaSyCdG_D3SMTnuKcivNv-r_lrlBQveZqHa3M",
    authDomain: "gcp-interconnects.firebaseapp.com",
    databaseURL: "https://gcp-interconnects-default-rtdb.firebaseio.com",
    projectId: "gcp-interconnects",
    storageBucket: "gcp-interconnects.appspot.com",
    messagingSenderId: "1087256356077",
    appId: "1:1087256356077:web:d534a4c6a5362c916d98e4",
    measurementId: "G-MZKST8VYEE"
  };
  window.addEventListener('load', async function(){
    let response = await fetch('https://ronnievsmith.com/index.json');
    json = await response.json();
    lunrIdx = lunr(function () {
      this.ref('link')
      this.field('title')
      this.field('description')
      this.field('body')
      json.forEach(function (doc) {
        this.add(doc)
      }, this)
    })
    if(window.location.pathname === "/search"){
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      runSearch(params.q) 
    }
    // if (typeof(Storage) !== "undefined") {
    //   if(localStorage.getItem("dark-mode")){
    //     document.body.classList.add("dark-mode");
    //   }
    //   if(localStorage.getItem("large-text")) {
    //     document.body.classList.add("large-text");
    //   }
    // }
  });
    
  if(searchInputs.length){
    searchInputs.forEach(function(input){
      input.addEventListener("keydown", async function (e) {
        if (e.keyCode === 13 || e.key === 'Enter') {
          pub.runSearch(e.target);
        }
      });      
    })
  }

  if(document.querySelectorAll(".search-form")){
    document.querySelectorAll(".search-form").forEach(function(el){
      el.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission
        pub.runSearch(event.target.parentElement.querySelector("input"));// Your code to handle the input submission
        return false;
      });
    });
  }

  if(document.querySelectorAll(".contact")){
    document.querySelectorAll(".contact").forEach(function(el){
      el.addEventListener("click", function (e) {
          pub.generateContact()
      });
    })
  }

  if(document.querySelectorAll(".theme-button")){
    document.querySelectorAll(".theme-button").forEach(function(button){
      button.addEventListener("click", function(e){
        document.body.classList.toggle("dark-mode");
        if (typeof(Storage) !== "undefined") {
          if(document.body.classList.contains("dark-mode")){
            localStorage.setItem("dark-mode","true");
          } else {
            localStorage.removeItem("dark-mode");
          }          
        }
      })
    })
  }

  if(document.querySelectorAll("summary")){
    document.querySelectorAll("summary").forEach(function(summaryEl){
      summaryEl.addEventListener("click", (event) => {
        if (typeof(Storage) !== "undefined") {
          toggleLocalStorage (event.target.parentElement.parentElement.tagName.toLowerCase())        
        }        
        return false;
      });
    });
  }

  if(document.querySelector("body > aside > details")){
    if(localStorage.getItem("aside")) {
      document.querySelector("body > aside > details").setAttribute("open","true");
    } else {
      document.querySelector("body > aside > details").removeAttribute("open");
    }
  }

  if(document.querySelector("body > header > details")){
    if(localStorage.getItem("header")) {
      document.querySelector("body > header > details").setAttribute("open","true");
    } else {
      document.querySelector("body > header > details").removeAttribute("open");
    }
  }

  if(document.querySelector("body > nav > details")){
    if(localStorage.getItem("nav")) {
      document.querySelector("body > nav > details").setAttribute("open","true");
    } else {
      document.querySelector("body > nav > details").removeAttribute("open");
    }
  }
  
  function toggleLocalStorage (property) {
    if(localStorage.getItem(property)){
      localStorage.removeItem(property);
    } else {
      localStorage.setItem(property,"true");
    }    
  }

  // if(document.querySelectorAll(".gcp-rss")){
  //   const script = document.createElement('script');
  //   script.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
  //   script.async = true;
  //   document.head.appendChild(script);
  //   const script2 = document.createElement('script');
  //   script2.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js";
  //   script2.async = true;
  //   document.head.appendChild(script2);
  //   var firebase = window.firebase;
  //   firebase.initializeApp(firebaseConfig);
  //   var ref = firebase.database().ref();
  //   var rssRef = firebase.database().ref('rss');

  //   let detailsEl = document.querySelector(".gcp-rss");
  //   try{

  //     let 
  //     detailsEl.appendChild(textNode);
  //     console.log(entries[0]);
  //   } catch (e) {
  //     console.log("Error fetching RSS");
  //   }
  // }

  if(document.querySelectorAll(".text-size-button")){
    document.querySelectorAll(".text-size-button").forEach(function(button){
      button.addEventListener("click", function(e){
        document.body.classList.toggle("large-text");
        if (typeof(Storage) !== "undefined") {
          console.log("fired")
          if(document.body.classList.contains("large-text")){
            localStorage.setItem("large-text","true");
          } else {
            localStorage.removeItem("large-text");
          }          
        }
      })
    })
  }

  pub.runSearch = async function (el) {
    let q = el.parentElement.querySelector("input").value
  // async function runSearch(q){;
    let results = await lunrIdx.search(q);
    dialog.replaceChildren();
    let fragment = new DocumentFragment();
    let nav = document.createElement("nav");
    let resultsList = document.createElement("ul");
    if(results.length > 0){
      results.forEach(function (result){
        let doc = json.find(o => o.link === result.ref);
        let addressElement = document.createElement("address");
        let addressText = document.createTextNode(result.ref);
        addressElement.appendChild(addressText);
        let listItemElement = document.createElement("li");
        let listItemText = document.createTextNode(doc.title);
        listItemElement.appendChild(listItemText);
        listItemElement.appendChild(addressElement);
        resultsList.appendChild(listItemElement);
      })
    } else {
      let addressElement = document.createElement("address");
      let addressText = document.createTextNode("No results found.");
      addressElement.appendChild(addressText);
      let listItemElement = document.createElement("li");
      let listItemText = document.createTextNode(" ");
      listItemElement.appendChild(listItemText);
      listItemElement.appendChild(addressElement);
      resultsList.appendChild(listItemElement);
    }
    nav.appendChild(resultsList);
    fragment.appendChild(nav);
    dialog.appendChild(fragment);
    let rect = el.parentElement.querySelector("input").getBoundingClientRect();
    let x = window.innerWidth - rect.right;
    searchDialogWrapper.style.top = rect.bottom + "px";
    searchDialogWrapper.style.right = "8px";
    attachClickListenerToSearchResults();
    dialog.show();
    //dialog.showModal();
  }

  function attachClickListenerToSearchResults() {
    let searchResultListItems = document.querySelectorAll("#search-dialog-wrapper li");
    searchResultListItems.forEach(function(listItem){

      listItem.addEventListener('click', function(e){
        
        window.location.href = listItem.querySelector("address").textContent;
        dialog.close();
      });
    })
  }

  document.addEventListener('click', (event) => {
    if(document.querySelector("dialog")){
      let dialog = document.querySelector("dialog");
      const withinBoundaries = event.composedPath().includes(dialog)
      if (!withinBoundaries) {
          dialog.close();
      }    
    }
  })

  document.onkeydown = function(evt) {
      evt = evt || window.event;
      var isEscape = false;
      if ("key" in evt) {
          isEscape = (evt.key === "Escape" || evt.key === "Esc");
      } else {
          isEscape = (evt.keyCode === 27);
      }
      if (isEscape) {
          if(document.querySelector("dialog")){
            document.querySelector("dialog").close();
          }
      }
  }
  pub.generateContact = function () {
    console.log("i ran")
  // function generateContact(){
    let arr = [];
    arr.push("(");
    arr.push("5");
    arr.push("0");
    arr.push("4");
    arr.push(")");
    arr.push(" ");
    arr.push("9");
    arr.push("4");
    arr.push("5");
    arr.push("-");
    arr.push("5");
    arr.push("6");
    arr.push("7");
    arr.push("2");
    let m = [];
    m.push("ronnie");
    m.push("@");
    m.push("ronnievsmith.com");
    return alert (m.join('') + " " + arr.join(''));
  }
  pub.test = function (a) {
    return "generateContact function made this " + a;
  }

  return pub;

}());