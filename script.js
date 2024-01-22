let perPage = 10; 
let currentPage = 1;

function fetchRepositories() {
  const username = document.getElementById('username').value;

  if (!username) {
    alert('Please enter a GitHub username.');
    return;
  }

  const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`;
  const loader = document.getElementById('loader');
  const repoList = document.getElementById('repoList');

  loader.style.display = 'block';
  repoList.innerHTML = '';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found or no repositories available.');
        } else {
          throw new Error('Failed to fetch repositories.');
        }
      }
      return response.json();
    })
    .then(data => {
      data.forEach(repo => {
        const card = createRepoCard(repo);
        repoList.appendChild(card);
      });

      updatePagination();
    })
    .catch(error => {
      alert(error.message);
    })
    .finally(() => {
    
      loader.style.display = 'none';
    });
}

function createRepoCard(repo) {
  const card = document.createElement('div');
  card.className = 'card col-md-6 repo-card'; 

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body d-flex flex-column';

  const avatar = document.createElement('img');
  avatar.src = repo.owner.avatar_url;
  avatar.alt = 'User Avatar';
  avatar.className = 'img-fluid rounded-circle mb-3';
  cardBody.appendChild(avatar);

  const repoInfo = document.createElement('div');
  repoInfo.className = 'repo-info';

  const repoName = document.createElement('h6');
  repoName.className = 'repo-name mb-1';
  repoName.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
  repoInfo.appendChild(repoName);

  const repoDescription = document.createElement('p');
  repoDescription.className = 'repo-description mb-2';
  repoDescription.innerText = repo.description || 'No description available';
  repoInfo.appendChild(repoDescription);

  const repoTopics = document.createElement('div');
  repoTopics.className = 'repo-topics';

  if (repo.topics && repo.topics.length > 0) {
    repo.topics.forEach(topic => {
      const topicButton = document.createElement('span');
      topicButton.className = 'repo-topic';
      topicButton.innerText = topic;
      repoTopics.appendChild(topicButton);
    });
  } else {
    const noTopic = document.createElement('span');
    noTopic.innerText = 'No topics available';
    repoTopics.appendChild(noTopic);
  }

  repoInfo.appendChild(repoTopics);

  cardBody.appendChild(repoInfo);

  card.appendChild(cardBody);
  return card;
}

function updatePagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const prevButton = document.createElement('li');
  prevButton.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevButton.innerHTML = `<a class="page-link" href="#" onclick="changePage('prev')">Previous</a>`;
  pagination.appendChild(prevButton);

  const nextButton = document.createElement('li');
  nextButton.className = 'page-item';
  nextButton.innerHTML = `<a class="page-link" href="#" onclick="changePage('next')">Next</a>`;
  pagination.appendChild(nextButton);
}

function changePage(direction) {
  if (direction === 'prev' && currentPage > 1) {
    currentPage--;
  } else if (direction === 'next') {
    currentPage++;
  }

  fetchRepositories();
}

function updatePerPage() {
  perPage = parseInt(document.getElementById('perPage').value, 10);
  fetchRepositories();
}
