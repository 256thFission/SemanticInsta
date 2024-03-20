import * as ort from 'onnxruntime-web';
import * as dfd from 'danfojs';

const InferenceSession = ort.InferenceSession;
async function loadModel(modelPath: string): Promise<ort.InferenceSession> {
    try {
        const session = await InferenceSession.create(modelPath);
        return session;
    } catch (error) {
        console.error('Failed to load the model:', error);
        throw error;
    }
}

async function runModel(session: ort.InferenceSession, inputText: string): Promise<Float32Array> {
    try {
        const input = new ort.Tensor('string', [inputText]);
        const outputMap = await session.run({ 'input_ids': input });
        const outputTensor = outputMap.output as ort.Tensor;
        const predictions = outputTensor.data as Float32Array;
        return predictions;
    } catch (error) {
        console.error('Failed to run the model:', error);
        throw error;
    }
}

export async function ml_main(modelPath: string, inputText: string, destFile?: string): Promise<void> {
    try {
        const session = await loadModel(modelPath);
        const predictions = await runModel(session, inputText);

        const resultDF = new dfd.DataFrame(predictions, {columns: ['toxicity', 'severe_toxicity', 'obscene', 'threat', 'insult', 'identity_attack']})
        if (destFile) {
            resultDF.to_csv(destFile);
        } else {
            console.log(resultDF.toString());
        }
    } catch (error) {
        console.error('Failed to run the model:', error);
        throw error;
    }
}