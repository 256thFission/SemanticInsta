import {pipeline, PipelineType} from "@xenova/transformers";

class PipelineSingleton {
    static instance = null;

    static async getInstance(task: PipelineType, model: string, progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(task, model, { progress_callback });
        }
        return this.instance;
    }
}

// Usage
self.addEventListener('message', async (event) => {
    const messages = event.data.messages;
    const pipe = await PipelineSingleton.getInstance('text-classification', 'Xenova/toxic-bert');
    const results = [];
    for (const message of messages) {
        const result = await pipe(message.content);
        results.push(result);
    }
    self.postMessage({ status: 'complete', output: results });
});