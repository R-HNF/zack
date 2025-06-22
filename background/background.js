function makeNotification() {
    chrome.notifications.create(
        {
            type: 'basic',
            iconUrl: '../images/icon48.png',
            title: 'Automatically Closed Notification',
            message: 'This notification will close automatically after 5 seconds.',
            priority: 1,
            requireInteraction: false
        },
        (notificationId) => {
            if (chrome.runtime.lastError) {
                console.error('Notification creation error:', chrome.runtime.lastError.message);
                return;
            }
            console.log('Notification created:', notificationId);

            setTimeout(() => {
                chrome.notifications.clear(notificationId, (wasCleared) => {
                    if (wasCleared) {
                        console.log('Notification closed:', notificationId);
                    } else {
                        console.warn('Failed to close notification:', notificationId);
                    }
                });
            }, 5000); // 5000 milliseconds = 5 seconds
        }
    );
}

function logToSlack() {
    chrome.storage.sync.get('slackWebhookUrl', async (data) => {
        const slackWebhookUrl = data.slackWebhookUrl;
        const loggingFormatType = data.loggingFormatType || 'markdown';

        if (!slackWebhookUrl) {
            // notification to user if webhook URL is not set
            return;
        }

        try {
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                const activeTab = tabs[0];
                if (activeTab && activeTab.url) {
                    const response = await fetch(slackWebhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            text: `<${activeTab.url}|[${new URL(activeTab.url).host}] ${activeTab.title}>`,
                            unfurl_links: true,
                        }),
                    });

                    if (response.ok) {
                        // notification to user if the message was sent successfully
                        makeNotification();
                    } else {
                        const errorText = await response.text();
                        // notification to user if the message was not sent successfully
                    }
                }
            });
        } catch (error) {
            // notification to user if there was an error sending the message
        }
    });
}

chrome.action.onClicked.addListener(() => {
    logToSlack();
});

chrome.commands.onCommand.addListener((command) => {
    if (command === '_execute_action') {
        logToSlack();
    }
});
