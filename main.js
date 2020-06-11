$(function() {
  const promiseGetCompanyGitHubUsername = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["github_username"], function(items) {
        const err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          if (items.github_username) {
            resolve(items.github_username);
          } else {
            reject("GitHub username not configured yet");
          }
        }
      });
    });
  };

  async function onTick(click) {
    var github_username = "";
    try {
      github_username = await promiseGetCompanyGitHubUsername();
    } catch (e) {
      console.log(e);
      return;
    }

    $("div.js-recent-activity-container").each(function() {
      const container = $(this);
      const ul = container.find("ul");
      ul.children().each(function() {
        const li = $(this);
        const a = li.find("a");
        if (a) {
          const href = a.attr("href");
          if (href.indexOf("/" + github_username + "/") == 0) {
            li.remove();
          }
        }
      });
      if (ul.children().length == 0) {
        const show_more_button = ul.next();
        ul.remove();
        if (show_more_button) {
          const display = show_more_button.css("display");
          if (typeof(display) != "undefined" && click) {
            show_more_button.click();
          }
        }
        const h4 = container.prev();
        container.remove();
        h4.remove();
      }
    });

    $("div.push,div.watch_started,div.follow,div.repo,div.release,div.issues_labeled").each(function() {
      const push = $(this);
      var contains_link = false;
      push.find("a").each(function() {
        const a = $(this);
        const href = a.attr("href");
        if (href.indexOf("/" + github_username + "/") == 0) {
          contains_link = true;
          return false;
        }
      });
      if (contains_link) {
        push.remove();
      }
    });
  };

  $("body").on({
    DOMNodeInserted: async () => {
      onTick(true);
    },
  });

  $(window).on('load', () => {
    onTick(false);
  });

  window.onpopstate = () => {
    onTick(false);
  };

  const tid = setInterval(() => {
     onTick(false);
  }, 100);
});
