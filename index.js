/**
 * On load of application, check the local storage for previously added users.If exist, create the cards.
 */
function onApplicationLoad(){
    console.log('Document is loaded fully');

    var loadingGif    = document.getElementById('loading');
    var userSection   = document.querySelector('section.card-section');
    var addedUsers    = localStorage.getItem('users');
    var userContainer = document.querySelector('#cardsContainer');


    if(addedUsers){
        addedUsers = JSON.parse(addedUsers);

        for(var i=0;i<addedUsers.length;i++){
            var newCardDiv       = document.createElement('div');
            newCardDiv.className = "card";
            newCardDiv.innerHTML = createUserCard(addedUsers[i]);

            userContainer.appendChild(newCardDiv);
            newCardDiv.setAttribute('id',addedUsers[i].id);
        }
    }
    else{
        userContainer.innerHTML = '<img class="img-responsive githubIcon" src="resources/githubIcon.gif" alt="Github loading">';
    }
    loadingGif.style.display  = "none";
    userSection.style.opacity = "unset";
    assignCardEvent();
    onClickClear();
}

function onClickAddUser(){
    var username    = document.querySelector('#username').value;
    var loadingGif  = document.getElementById('loading');
    var userSection = document.querySelector('section.card-section');

    if(username){
        loadingGif.style.display = "block";
        userSection.style.opacity = 0.4;

        fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response);

            loadingGif.style.display  = "none";
            userSection.style.opacity = "unset";

            if(response){
                processUserResponse(response);
            }
            else{
                alert('Unable to fetch response, Please try again');
            }
        });
    }
    else{
        alert("Please enter a username!!!");
    }
}

function processUserResponse(response){
    if(response.message == "Not Found"){
        alert("User Not Found : Please enter a valid username");
    }
    else{
        var userContainer = document.querySelector('#cardsContainer');
        var githubIcon    = userContainer.querySelector('img.githubIcon');
        
        var newCardDiv       = document.createElement('div');
        newCardDiv.className = "card";
        newCardDiv.innerHTML = createUserCard(response);

        newCardDiv.setAttribute('id',response.id);

        if(!localStorage.getItem('users')){
            userContainer.removeChild(githubIcon);
            userContainer.appendChild(newCardDiv);
            localStorage.setItem('users',JSON.stringify([response]));
        }
        else{
            var previousUsers = JSON.parse(localStorage.getItem('users'));
            var userIds = pluck(previousUsers,'id');

            if(userIds.indexOf(response.id)>=0){
                alert('User is already added.');
            }
            else{
                userContainer.appendChild(newCardDiv);
                previousUsers.push(response);
                localStorage.setItem('users',JSON.stringify(previousUsers));
            }
        }
        assignCardEvent();
        onClickClear();
    }
}

function assignCardEvent(){
    var userCards = document.querySelectorAll('div.card');

    for(var i=0;i<userCards.length;i++){
        userCards[i].onclick=function(e){
            var srcElement = e.srcElement;
            var profileLink = e.currentTarget.querySelector('a');
            if(profileLink != srcElement){
                var userId = e.currentTarget.getAttribute('id');
                window.open('./userDetails.html?'+userId,'_blank');
            }
        }
    }
}

function onClickClear(){
    var username = document.getElementById('username');

    username.value="";
    username.focus();

    //Adding addUser event on pressing enter in input button
    username.onkeydown = function(e){
        if(e.keyCode==13){
            onClickAddUser();
        }
    }
}

function onClickResetSearch(){
    localStorage.clear();
    onApplicationLoad();
}

function createUserCard(data){
    return `<div id="imgDiv">
                <img src=`+data.avatar_url+`>
            </div>
            <div class="card-body">
                <a href=`+data.html_url+` target="_blank">`+data.login+`</a>
                <div>
                    <span class="label">Name :</span>`+data.name+`<br/>
                    <span class="label">Company :</span>`+(data.company?data.company:'-')+`<br/>
                    <span class="label">Location :</span>`+(data.location?data.location:'-')+`<br/>
                    <span class="label">Email :</span>`+(data.email?data.email:'-')+`<br/><hr/>
                    <span class="label">Followers :</span>`+data.followers+`<br/>
                    <span class="label">Following :</span>`+data.following+`<br/>
                    <span class="label">Member Since :</span>`+formatDate(data.created_at)+`<br/>
                    <span class="label">Public Repos :</span>`+data.public_repos+`<br/>
                    <span class="label">Public Gists :</span>`+data.public_gists+`<br/>
                </div>
            </div>`;
}

function formatDate(date){
    var isoFormat = new Date(date);
    var onlyDate = isoFormat.toDateString().substring(4);

    //Replace space with dash(-)
    return onlyDate.replace(/ /g,"-");
}
