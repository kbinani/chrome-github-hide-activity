chrome.storage.local.get(["github_username"], function(items) {
  const err = chrome.runtime.lastError;
  if (err) {
    console.log(err);
  } else {
    const github_username = items.github_username;
    $("#github_username").val(github_username);
  }
});

$("#ok_button").on("click", function() {
  const input = $("#github_username");
  const text = input.val();
  chrome.storage.local.set({"github_username": text}, function() {
    const err = chrome.runtime.lastError;
    if (err) {
      console.log(err);
    }
  });
});
