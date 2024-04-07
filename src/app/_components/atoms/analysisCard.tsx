"use client"
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Highlight} from "~/app/_components/molecule/CardstackConstructed";
import { useAtom } from 'jotai';
import { filesAtom } from '~/app/store/fileAtom';
import { extractMessages, mergeMessages,purgeMessages } from "@/utils/msgUtils";
import { Progress } from "~/components/ui/progress";
type FileCardProps = {
    handleNextCard: () => void;
};
type WorkerEventData = {
    status: string;
    output: object;
    progress: number;
};



export const AnalyzeCard : React.FC<FileCardProps> = ({ handleNextCard }) => {
    // const handleRunAnalysis = () => {
    //     handleNextCard();
    // }
    const [files] = useAtom(filesAtom);



    // Create a reference to the worker object.
    const worker = useRef<Worker | null>(null);
    const [progress, setProgress] = useState(0);

    const [result, setResult] = useState(null);
    useEffect(() => {
        console.log(result, "result");

    }, [result]);

    useEffect(() => {
        console.log(progress, "progress");

    }, [progress]);
    const handleRunAnalysis = async () => {
        const preMessages  = await extractMessages(files);
        const purgedMessages = await purgeMessages(preMessages)
        const alluserMessages = await  mergeMessages(purgedMessages)
        const userMessages =  alluserMessages.slice(0, 100);
        console.log('userMessages:', userMessages); // Debugging line

        if (!worker.current) {
            // Create the worker if it does not yet exist.
            worker.current = new Worker(new URL('../../worker.ts', import.meta.url), {
                type: 'module'
            });
        }
        console.log('worker.current:', worker.current); // Debugging line

        // Create a callback function for messages from the worker thread.
        if (worker.current) {

            // Listen for a message from the worker indicating it has completed its task.
3
            worker.current.addEventListener('message', (e: MessageEvent<WorkerEventData>) => {
                if (e.data.status === 'complete') {
                    // Handle the result.
                    console.log("something happened", e.data.output);
                    setResult(e.data.output);
                    console.log(result);

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    worker.current.terminate();
                    worker.current = null;
                } else if (e.data.status === 'progress') {
                    // Update the progress state variable with the progress value from the event data
                    setProgress(e.data.progress);
                }

            });
            console.log(userMessages, "before postMessage");
            worker.current.postMessage({messages: userMessages});
        }
    };




        return(
            <div>
                <p>{progress}% Complete</p>
                <Progress  value={progress}/>
                <button onClick={handleRunAnalysis}> baba bia</button>
            </div>
        )
}