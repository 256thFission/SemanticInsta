"use client"
import React from "react";
import {Highlight} from "~/app/_components/molecule/CardstackConstructed";
import {InputFile} from "~/app/_components/atoms/fileinput";
type FileCardProps = {
    handleNextCard: () => void;
};


export const FileCard : React.FC<FileCardProps> = ({ handleNextCard }) => {


    return(
        <div>
            <p>
                These cards are amazing, <Highlight>I want to use them</Highlight> in my
                project. Framer motion is a godsend ngl tbh fam 🙏
            </p>
            <InputFile id={"msgfile"} onFileSelect={()=>handleNextCard()} onError={(error) => console.log(error)}/>
        </div>
    )
}