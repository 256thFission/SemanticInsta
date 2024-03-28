"use client"
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Highlight} from "~/app/_components/molecule/CardstackConstructed";
import {ml_main} from "@/utils/ONNX_utils";
type FileCardProps = {
    handleNextCard: () => void;
};
type WorkerEventData = {
    status: string;
    output: any[];
};


export const AnalyzeCard : React.FC<FileCardProps> = ({ handleNextCard }) => {
    // const handleRunAnalysis = () => {
    //     handleNextCard();
    // }

    // Create a reference to the worker object.
    const worker = useRef<Worker | null>(null);

    const [result, setResult] = useState(null);
    const [ready, setReady] = useState(null);


    const handleRunAnalysis = () => {
        if (!worker.current) {
            // Create the worker if it does not yet exist.
            worker.current = new Worker(new URL('../../worker.ts', import.meta.url), {
                type: 'module'
            });
        }
        // Create a callback function for messages from the worker thread.
        if (worker.current) {

            worker.current.postMessage({messages});
            // Listen for a message from the worker indicating it has completed its task.

            worker.current.addEventListener('message', (e: MessageEvent<WorkerEventData>) => {
                if (e.data.status === 'complete') {
                    // Handle the result.
                    setResult(e.data.output[0]);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    worker.current.terminate();
                    worker.current = null;
                }

            });
        }
    };

    return(
        <div>
            <p>
                These cards are amazing, <Highlight>I want to use them</Highlight> in my
                project. Framer motion is a godsend ngl tbh fam 🙏
            </p>
            <button onClick={handleRunAnalysis}> baba bia</button>
        </div>
    )
}