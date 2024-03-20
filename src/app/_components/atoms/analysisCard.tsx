"use client"
import React from "react";
import {Highlight} from "~/app/_components/molecule/CardstackConstructed";
import {ml_main} from "@/utils/ONNX_utils";
type FileCardProps = {
    handleNextCard: () => void;
};


export const AnalyzeCard : React.FC<FileCardProps> = ({ handleNextCard }) => {
    const handleRunAnalysis = () => {
        ml_main("./model/original_small.onnx","mamamia taco", );
        handleNextCard();
    }

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