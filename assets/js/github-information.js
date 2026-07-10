function userInformationHTML(user) {
    var displayName = user.name || user.login;
    return `
        <div class="gh-user-card">
            <div class="gh-user-header">
                <div class="gh-avatar">
                    <a href="${user.html_url}" target="_blank">
                        <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                    </a>
                </div>
                <div class="gh-user-meta">
                    <h2>${displayName}
                        <span class="small-name">
                            <a href="${user.html_url}" target="_blank">@${user.login}</a>
                        </span>
                    </h2>
                </div>
            </div>
            <div class="gh-user-stats">
                <span class="gh-stat"><strong>${user.followers}</strong> Followers</span>
                <span class="gh-stat"><strong>${user.following}</strong> Following</span>
                <span class="gh-stat"><strong>${user.public_repos}</strong> Repositories</span>
            </div>
        </div>`;
}

function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list"><h4 class="repo-list-heading">Repositories</h4><p class="repo-empty">No public repositories found.</p></div>`;
    }

    var listItemsHTML = repos.map(function(repo) {
        return `<li class="gh-repo-item">
                    <a href="${repo.html_url}" target="_blank" class="gh-repo-link">${repo.name}</a>
                </li>`;
    });

    return `<div class="clearfix repo-list">
                <h4 class="repo-list-heading">Repositories</h4>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

function fetchGitHubInformation(event) {
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        },
        function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(
                    `<h2>No info found for user ${username}</h2>`);
            } else if (errorResponse.status === 403) {
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000);
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}

$(document).ready(fetchGitHubInformation);
