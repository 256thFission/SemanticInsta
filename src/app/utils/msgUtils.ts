function processMessages(data) {
    const messages = data.messages;
    const processedMessages = [];

    for (let i = 0; i < messages.length; i++) {
        const currentMessage = messages[i];
        const { sender_name, timestamp_ms, content } = currentMessage;

        // Check if the previous message has the same sender_name
        if (i > 0 && messages[i - 1].sender_name === sender_name) {
            // Combine the content with the previous message
            processedMessages[processedMessages.length - 1].content += '\n' + content;
            // Update the timestamp to the earliest one
            processedMessages[processedMessages.length - 1].timestamp_ms = Math.min(
                processedMessages[processedMessages.length - 1].timestamp_ms,
                timestamp_ms
            );
        } else {
            // Create a new message object
            processedMessages.push({
                sender_name,
                timestamp_ms,
                content,
            });
        }
    }

    return processedMessages;
}