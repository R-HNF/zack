document.addEventListener('DOMContentLoaded', () => {
    const webhookUrl = document.getElementById('webhook-url');
    const shortDescription = document.getElementById('short-desc');
    const loggingFormatTypeId = document.getElementById('logging-format-type-id');
    const saveButton = document.getElementById('save-btn');

    chrome.storage.sync.get(['slackWebhookUrl', 'shortDescription', 'loggingFormatType'], (data) => {
        if (data.slackWebhookUrl) {
            webhookUrl.value = data.slackWebhookUrl;
        }
        if (data.shortDescription) {
            shortDescription.value = data.shortDescription;
        }
        if (data.loggingFormatType) {
            loggingFormatTypeId.value = data.loggingFormatTypeId;
        }
    });

    saveButton.addEventListener('click', () => {
        const webhookUrlValue = webhookUrl.value.trim();
        const shortDescriptionValue = shortDescription.value.trim();
        const loggingFormatTypeIdValue = loggingFormatTypeId.value.trim();

        if (webhookUrlValue) {
            chrome.storage.sync.set({ slackWebhookUrl: webhookUrlValue, shortDescription: shortDescriptionValue, loggingFormatTypeId: loggingFormatTypeIdValue }, () => {
                // notification to user if settings were saved successfully
            });
        } else {
            // notification to user if settings were not saved successfully
        }
    });
});
