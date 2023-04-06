/* To Track loading of both repos and followers list*/
var isRepoLoaded = false;
var isFollowersLoaded = false;

/**
 * On load of application, take the userId passed while opening this page
 * and get the repositories and followers list accordingly
 */
function onRepoFollowersAppLoad(){
    var userId = Number(location.href.split('?')[1]);
    var userList = JSON.parse(localStorage.getItem('users'));
    var userIds = pluck(userList,'id');
    var userIndex = userIds.indexOf(userId);
    var data = userList[userIndex];
    var userName = data.login;

    document.getElementById('name').innerHTML = userName;
    document.getElementById('profileImg').src = data.avatar_url;

    checkExistingRepoStorage(userName, userId);
    checkExistingFollowersStorage(userName, userId);
}

/**
    Checking if the repositories exist for the current user in localStorage.
    If exist, use the stored data else make a request
 */
function checkExistingRepoStorage(userName, userId){
    var existingReposList = localStorage.getItem('reposList');
    
    if(existingReposList){
        existingReposList = JSON.parse(existingReposList);

        if(existingReposList[userId]){
            createReposList(existingReposList[userId]);
        }
        else{
            getReposList(userName, userId);
        }
    }
    else{
        getReposList(userName, userId);
    }
}

/**
    Checking if the followers exist for the current user in localStorage.
    If exist, use the stored data else make a request
 */
function checkExistingFollowersStorage(userName, userId){
    var existingFollowersList = localStorage.getItem('followersList');

    if(existingFollowersList){
        existingFollowersList = JSON.parse(existingFollowersList);

        if(existingFollowersList[userId]){
            createFollowersList(existingFollowersList[userId]);
        }
        else{
            getFollowersList(userName, userId);
        }
    }
    else{
        getFollowersList(userName, userId);
    }
}

function getReposList(username, userId){
    fetch('https://api.github.com/users/'+username+'/repos')
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log(response);

            var repoEntry = {};
            repoEntry[userId] = response;

            localStorage.setItem('reposList',JSON.stringify(repoEntry));

            createReposList(response);
        });
}

function createReposList(response){
    isRepoLoaded = true;

    var repolist = document.getElementById('repoList');
    var list = "";

    for(var i=0;i<response.length;i++){
        list = list + `<li><a href=`+response[i].html_url+` target='_blank'>`+response[i].name+`</a></li>`;
    }

    repolist.innerHTML = list;

    removeLoadMask();
}

function getFollowersList(username, userId){
    fetch('https://api.github.com/users/'+username+'/followers')
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log(response);
            var followersEntry = {};
            followersEntry[userId] = response;

            localStorage.setItem('followersList',JSON.stringify(followersEntry));

            createFollowersList(response);
        });
}

function createFollowersList(response){
    isFollowersLoaded = true;

    var followerslist = document.getElementById('followersList');
    var list = "";

    for(var i=0;i<response.length;i++){
        list = list + `<li><a href=`+response[i].html_url+` target='_blank'>`+response[i].login+`</a></li>`;
    }

    followerslist.innerHTML = list;
    removeLoadMask();
}

function removeLoadMask(){
    var loadMask = document.getElementById('loading');

    if(isFollowersLoaded && isRepoLoaded){
        loadMask.style.display = "none";
    }
}

