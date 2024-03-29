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
    message: MergedMessage;
    score: number;
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
    const loadedMessages : MergedMessage[] = event.data.messages;
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
    for (const message of loadedMessages) {
        // Get the label-score pairs for the message
        const labelScores: LabelScore[] = await pipe(message.content);

        for (const {label, score} of labelScores) {
            // Get the top messages for the label
            const top = topMessages[label];

            // Check if the score is higher than the lowest score in the top 5
            if (top && (top.length < 5 || score > top[0].score)) {
                // Replace the lowest score with the current score and message
                if (top.length === 5) {
                    top.shift();
                }
                top.push({message: message.content, score});
                top.sort((a, b) => a.score - b.score);
            }
        }
    }

    // Post the top messages back to the main thread
    self.postMessage({status: 'complete', output: topMessages});
});