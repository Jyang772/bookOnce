// background.js

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // If the tab URL has been updated and it's a Google search
  if (changeInfo.url && changeInfo.url.includes('google.com/search')) {
    const url = new URL(changeInfo.url);
    const query = url.searchParams.get('q');
    if (query) {
      searchBookmarks(query);
    }
  }
});

function getLastQuery(callback) {
  chrome.storage.local.get(['lastQuery'], function(result) {
    if (result.lastQuery) {
      callback(result.lastQuery);
    }
  });
}

function searchBookmarks(query) {
  chrome.bookmarks.search(query, function (results) {
    if (results.length > 0) {
      createNotification(query, results.length);
    }
  });
}

function createNotification(query, count) {
  chrome.storage.local.set({ lastQuery: query }, function() {
    console.log('Query saved.');
  });

  chrome.notifications.create('bookmarkNotification', {
    title: 'Bookmark Assistant',
    message: `You have ${count} bookmarks related to: "${query}"`,
    iconUrl: 'images/alert.jpg',
    type: 'basic'
  });
}

chrome.notifications.onClicked.addListener(function(notificationId) {
  if (notificationId === 'bookmarkNotification') {
    //chrome.tabs.create({ url: 'popup.html' }); // Opens the popup.html in a new tab
	  
    // Assuming 'query' is a variable that holds the search term
    //chrome.tabs.create({ url: `chrome://bookmarks/?q=${encodeURIComponent(query)}` });
    getLastQuery(function(query) {
      chrome.tabs.create({ url: `chrome://bookmarks/?q=${encodeURIComponent(query)}` });
    });
  }
});

