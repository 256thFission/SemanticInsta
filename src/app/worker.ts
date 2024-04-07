import {pipeline, PipelineType, env} from "@xenova/transformers";
import {MergedMessage} from "@/utils/msgUtils";


env.allowLocalModels = false;
// Define the type for a label-score pair
interface LabelScore {
    label: string;
    score: number;
}

interface EventData {
    messages: MergedMessage[];
}
// Define the type for a message with its score
interface ScoredMessage {
    message: string;
    score: number;
    timestamp_ms: number;
    sender_name: string;

}

// Define the type for the top 5 messages for each label
type TopMessages = Record<string, ScoredMessage[]>;



class PipelineSingleton {
    static instance = null;

    static async getInstance(task: PipelineType, model: string, progress_callback = null) {
        if (this.instance === null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.instance = pipeline(task, model, { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message',  async(event:MessageEvent<EventData>) => {
    console.log(event.data.messages, "inside worker"); // Debugging line
    // const pipo = await pipeline('text-classification', 'Xenova/toxic-bert');
    // let out = await pipo('I love transformers!',{ topk: 5 });
    // console.log("out", out);
    const loadedMessages : MergedMessage[] =  event.data.messages;
// Usage
 const pipe = await PipelineSingleton.getInstance('text-classification', 'Xenova/toxic-bert');

    const topMessages: TopMessages = {
        'toxic': [],
        'obscene': [],
        'insult': [],
        'identity_hate': [],
        'threat': [],
        'severe_toxic': []
    };

    let lowestTopScore = Infinity;
    let processedMessages = 0; // Counter for processed messages
    const updateInterval = Math.round(loadedMessages.length / 100); // Update progress every 1% of messages processed

    for (const message of loadedMessages) {
        if (message.content !== undefined) {

            // Get the label-score pairs for the message
            const labelScores: LabelScore[] = await pipe(message.content,{ topk: 6 });

            for (const {label, score} of labelScores) {
                // Get the top messages for the label
                const top = topMessages[label];

                // Check if the score is higher than the lowest score in the top 5 of any label
                if (top && (top.length < 5 || score > lowestTopScore)) {
                    // Replace the lowest score with the current score and message
                    if (top.length === 5) {
                        const removed = top.shift();
                        if (removed && removed.score === lowestTopScore) {
                            // Update the lowest top score
                            lowestTopScore = Math.min(...Object.values(topMessages).flat().map(m => m.score));
                        }
                    }
                    top.push({message: message.content, score, timestamp_ms: message.timestamp_ms, sender_name: message.sender_name});
                    top.sort((a, b) => a.score - b.score);
                    console.log("New top message added", top, "for label", label);

                    // Update the lowest top score
                    lowestTopScore = Math.min(lowestTopScore, score);
                }
            }
        }
        processedMessages++; // Increment the counter after each message is processed

        // Update the progress every updateInterval messages
        if (processedMessages % updateInterval === 0) {
            // Calculate the progress as a percentage
            const progress = Math.round((processedMessages / loadedMessages.length) * 100);

            // Post the progress back to the main thread
            self.postMessage({status: 'progress', progress});
        }
    }

    // Post the top messages back to the main thread
    self.postMessage({status: 'progress', progress: 100});

    self.postMessage({status: 'complete', output: topMessages});
});