function searchBookmarks(query) {
  chrome.bookmarks.search(query, function(results) {
    if (results.length > 0) {
      //createNotification(query);
      displayBookmarks(results);
    }
  });
}

function displayBookmarks(bookmarks) {
  var bookmarksElement = document.getElementById('bookmarks');
  bookmarksElement.innerHTML = ''; // Clear previous results

  bookmarks.forEach(function(bookmark) {
    var div = document.createElement('div');
    div.className = 'bookmark-item';

    var link = document.createElement('a');
    link.textContent = bookmark.title;
    link.setAttribute('href', bookmark.url);
    link.setAttribute('target', '_blank'); // Opens in new tab when clicked
    link.onclick = function(event) {
      event.preventDefault(); // Prevent the default link behavior
      chrome.tabs.create({ url: bookmark.url });
    };

    div.appendChild(link);
    bookmarksElement.appendChild(div);
  });
}


function createNotification(query) {
  chrome.notifications.create('', {
    title: 'Bookmark Assistant',
    message: `You have bookmarks related to: "${query}"`,
    iconUrl: 'images/alert.jpg',
    type: 'basic'
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  var activeTab = tabs[0];
  var activeTabUrl = new URL(activeTab.url);
  var query = activeTabUrl.searchParams.get('q') || '';
  if (query) {
    searchBookmarks(query);
  }
});

