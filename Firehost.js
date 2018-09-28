// Initialize Firebase
var config = 
{
  apiKey: "AIzaSyCAAfW74JRokE1cWI_J4N-k8o2BWfdJsLY",
  authDomain: "party-haus.firebaseapp.com",
  databaseURL: "https://party-haus.firebaseio.com",
  projectId: "party-haus",
  storageBucket: "party-haus.appspot.com",
  messagingSenderId: "468631990782"
};
firebase.initializeApp(config);

var db = firebase.database();

function getQueryVariable(id) 
{
  let query = window.location.search.substring(1);
  let vars = query.split('?');
  for (let i = 0; i<vars.length;i++) {
    let pair = vars[i].split('=');
    if(pair[0] == id){
      return pair[1];
    }

  }
  return(false);
}

function getPartyName()
{
  accessCode = getQueryVariable('accessCode');
  party = db.ref(accessCode+'/')
  return party.once('value').then(function(snapshot) {
    let partyName = snapshot.val().partyName;
    return partyName;
  });
  

}

function deleteParty() 
{
   accessCode = getQueryVariable('accessCode')
   party = db.ref(accessCode+'/').remove()

}

function changePartyName(newName) 
{
  db.ref(accessCode+'/partyName').set(newName);
  document.getElementById('party-name').innerHTML = newName
}

window.onload = function() 
{
  let code = getQueryVariable('accessCode');
  document.getElementById("party-code").innerHTML = code;
  let name = getPartyName();
  name.then(function(value) 
  {
    document.getElementById("party-name").innerHTML = value 
  })

  
}




