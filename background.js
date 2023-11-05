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

function searchBookmarks(query) {
  chrome.bookmarks.search(query, function (results) {
    if (results.length > 0) {
      createNotification(query, results.length);
    }
  });
}

function createNotification(query, count) {
  chrome.notifications.create('', {
    title: 'Bookmark Assistant',
    message: `You have ${count} bookmarks related to: "${query}"`,
    iconUrl: 'images/alert.jpg',
    type: 'basic'
  });
}

