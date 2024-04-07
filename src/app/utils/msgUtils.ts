
interface Participant {
    name: string;
}

interface Message {
    sender_name: string;
    timestamp_ms: number;
    content: string;
    is_geoblocked_for_viewer: boolean;
}

 export interface MergedMessage {
    sender_name: string;
    timestamp_ms: number;
    content: string;
}

interface JsonContentType {
    messages: Message[];
    participants: Participant[];

}
export function extractFile(file_array: File[]) {
    return file_array.find(file => file.name.endsWith('.json'));
}


export async function extractMessages(data: File[]): Promise<Message[]> {
    const messagesFile = extractFile(data);
    if (!messagesFile) {
        throw new Error('No JSON file found');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const fileContent = event.target?.result;
                if (typeof fileContent === 'string') {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const jsonContent : JsonContentType = JSON.parse(fileContent);
                    const messages:Message[] = jsonContent.messages;
                    resolve(messages);
                } else {
                    reject(new Error('File content is not a string'));
                }
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(messagesFile);
    });
}

export async function purgeMessages(messages: Message[]): Promise<Message[]> {
    const filteredMessages = messages.filter(message => {
        if (message.content) {
            const content = message.content.toLowerCase();
            return !(
                content.includes("liked a message".toLowerCase()) ||
                content.includes("sent an attachment".toLowerCase()) ||
                content.includes("audio call".toLowerCase()) ||
                content.includes("because they're in quiet mode.".toLowerCase()) ||
                content.includes("https://".toLowerCase()) ||
                content.includes("video chat".toLowerCase())
            );
        }
        return false;
    });

    return filteredMessages;
}

export async function  mergeMessages(messages: Message[]): Promise<MergedMessage[]> {
    const mergedMessages: MergedMessage[] = [];

    for (const currentMessage of messages) {
        const lastMergedMessage = mergedMessages[mergedMessages.length - 1];

        if (lastMergedMessage && lastMergedMessage.sender_name === currentMessage.sender_name) {
            // Merge messages from the same sender
            lastMergedMessage.content += ' ' + currentMessage.content;
            lastMergedMessage.timestamp_ms = currentMessage.timestamp_ms;
        } else {
            // Add a new message
            mergedMessages.push({
                sender_name: currentMessage.sender_name,
                timestamp_ms: currentMessage.timestamp_ms,
                content: currentMessage.content,
            });
        }
    }

    return mergedMessages;
}