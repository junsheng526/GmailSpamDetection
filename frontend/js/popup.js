document.addEventListener("DOMContentLoaded", function () {
  // Perform message fetching and scanning here
  chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }

    console.log("Fetching email message");
    fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Data available >> ", data);
        let messages = data.messages;

        if (!Array.isArray(messages) || messages.length === 0) {
          console.log("No messages found in Chrome storage.");
          // Handle case where messages array is empty or undefined
          return;
        }

        messages.forEach((message) => {
          fetch(
            `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
            .then((response) => response.json())
            .then((msg) => {
              let messageText = msg.snippet;
              fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: messageText }),
              })
                .then((response) => response.json())
                .then((result) => {
                  let messageDiv = document.createElement("div");
                  messageDiv.classList.add("message");
                  messageDiv.textContent = messageText;

                  if (result.prediction === 1) {
                    messageDiv.classList.add("spam");
                    let deleteButton = createButton(
                      "Delete",
                      "delete-button",
                      () => {
                        fetch(
                          `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}/trash`,
                          {
                            method: "POST",
                            headers: {
                              Authorization: "Bearer " + token,
                            },
                          }
                        ).then((response) => {
                          if (response.ok) {
                            messageDiv.remove();
                          }
                        });
                      }
                    );

                    let markNotSpamButton = createButton(
                      "Mark As Not Spam",
                      "button",
                      () => {
                        fetch(
                          `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}/modify`,
                          {
                            method: "POST",
                            headers: {
                              Authorization: "Bearer " + token,
                            },
                            body: JSON.stringify({
                              removeLabelIds: ["SPAM"],
                            }),
                          }
                        ).then((response) => {
                          if (response.ok) {
                            messageDiv.remove();
                          }
                        });
                      }
                    );

                    messageDiv.appendChild(deleteButton);
                    messageDiv.appendChild(markNotSpamButton);
                  } else {
                    let markSpamButton = createButton(
                      "Mark As Spam",
                      "button",
                      () => {
                        fetch(
                          `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}/modify`,
                          {
                            method: "POST",
                            headers: {
                              Authorization: "Bearer " + token,
                            },
                            body: JSON.stringify({ addLabelIds: ["SPAM"] }),
                          }
                        ).then((response) => {
                          if (response.ok) {
                            messageDiv.remove();
                          }
                        });
                      }
                    );

                    messageDiv.appendChild(markSpamButton);
                  }

                  document.getElementById("messages").appendChild(messageDiv);
                });
            });
        });
      })
      .catch((error) => console.error(error));
  });

  // Function to create a button with specified text, class, and click handler
  function createButton(text, className, onClick) {
    let button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    button.onclick = onClick;
    return button;
  }
});
