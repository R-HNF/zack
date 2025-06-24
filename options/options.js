document.addEventListener('DOMContentLoaded', () => {
    const webhookUrlElement = document.getElementById('webhook-url');
    const shortDescriptionElement = document.getElementById('short-desc');
    const loggingFormatTypeElement = document.getElementById('logging-format-type');
    const saveButtonElement = document.getElementById('save-btn');
    const notificationElement = document.getElementById('notification');

    chrome.storage.local.get(['slackWebhookUrl', 'shortDescription', 'loggingFormatType'], (data) => {
        if (data.slackWebhookUrl) {
            webhookUrlElement.value = data.slackWebhookUrl;
        }
        if (data.shortDescription) {
            shortDescriptionElement.value = data.shortDescription;
        }
        if (data.loggingFormatType) {
            loggingFormatTypeElement.value = data.loggingFormatType;
        }
        document.body.classList.add('loaded');
    });

    saveButtonElement.addEventListener('click', async () => {
        const webhookUrlValue = webhookUrlElement.value.trim();
        const shortDescriptionValue = shortDescriptionElement.value.trim();
        const loggingFormatTypeValue = loggingFormatTypeElement.value.trim();

        try {
            new URL(webhookUrlValue);
        } catch (error) {
            notificationElement.textContent = 'Invalid webhook url';
            notificationElement.style.color = 'red';
            console.error('Error: Invalid webhook url');
            return;
        }

        try {
            await chrome.storage.local.set({ slackWebhookUrl: webhookUrlValue, shortDescription: shortDescriptionValue, loggingFormatType: loggingFormatTypeValue });
            notificationElement.textContent = 'Saved!';
            notificationElement.style.color = 'green';
            setTimeout(() => {
                notificationElement.textContent = '';
            }, 2000);
        } catch (error) {
            notificationElement.textContent = 'Error';
            notificationElement.style.color = 'red';
            console.error('Error: Saveing the settings failed');
        }
    });
});
