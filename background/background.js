function makeNotification(title) {
    const showingSeconds = 5;
    chrome.notifications.create(
        {
            type: 'basic',
            iconUrl: '../images/icon512-with-space-white-bg.png',
            title,
            message: `This notification will close automatically after ${showingSeconds} seconds.`,
            priority: 1,
            requireInteraction: false
        },
        (notificationId) => {
            if (chrome.runtime.lastError) {
                return;
            } else {
                setTimeout(() => {
                    chrome.notifications.clear(notificationId);
                }, showingSeconds * 1000);
            }
        }
    );
}

function zack() {
    chrome.storage.local.get(['slackWebhookUrl', 'loggingFormatType'], async (data) => {
        const slackWebhookUrl = data.slackWebhookUrl;
        const loggingFormatType = data.loggingFormatType || 'markdown';

        if (slackWebhookUrl) {
            try {
                chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                    const activeTab = tabs[0];
                    if (activeTab && activeTab.url) {
                        let text = '';
                        if (loggingFormatType === 'markdown') {
                            text = `<${activeTab.url}|${activeTab.title}>`;
                        } else if (loggingFormatType === 'simple') {
                            text = `${activeTab.title}\n${activeTab.url}`;
                        } else if (loggingFormatType === 'url-only') {
                            text = `${activeTab.url}`;
                        }

                        const response = await fetch(slackWebhookUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                text,
                                unfurl_links: true,
                            }),
                        });

                        if (response.ok) {
                            makeNotification('Saved the current page!');
                        } else {
                            makeNotification('Error: Webhook request failed');
                        }
                    }
                });
            } catch (error) {
                makeNotification('Error: Zack failed');
            }
        } else {
            makeNotification('Error: No Webhook URL set');
            return;
        }


    });
}

chrome.action.onClicked.addListener(() => {
    zack();
});

chrome.commands.onCommand.addListener((command) => {
    if (command === '_execute_action') {
        zack();
    }
});
