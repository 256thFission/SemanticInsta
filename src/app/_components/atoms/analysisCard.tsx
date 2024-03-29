"use client"
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Highlight} from "~/app/_components/molecule/CardstackConstructed";
import { useAtom } from 'jotai';
import { filesAtom } from '~/app/store/fileAtom';
import { extractMessages, mergeMessages } from "@/utils/msgUtils";


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
    const [files] = useAtom(filesAtom);



    // Create a reference to the worker object.
    const worker = useRef<Worker | null>(null);

    const [result, setResult] = useState(null);


    const handleRunAnalysis = async () => {
        const preMessages  = await extractMessages(files);
        const userMessages = await  mergeMessages(preMessages);

        if (!worker.current) {
            // Create the worker if it does not yet exist.
            worker.current = new Worker(new URL('../../worker.ts', import.meta.url), {
                type: 'module'
            });
        }
        // Create a callback function for messages from the worker thread.
        if (worker.current) {
            console.log(userMessages);
            worker.current.postMessage({userMessages});
            // Listen for a message from the worker indicating it has completed its task.
3
            worker.current.addEventListener('message', (e: MessageEvent<WorkerEventData>) => {
                if (e.data.status === 'complete') {
                    // Handle the result.
                    setResult(e.data.output[0]);
                    console.log(result);
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