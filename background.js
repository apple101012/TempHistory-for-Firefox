let tempHistory = [];

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.incognito && changeInfo.url && tab.title) {
    tempHistory.push({ title: tab.title, url: changeInfo.url });
    browser.storage.local.set({ tempHistory });
  }
});

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // Optionally remove URLs when tabs close
});
