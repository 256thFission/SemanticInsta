"use client"
import React, {useEffect, useState} from "react";
import {Highlight} from "~/app/_components/molecule/CardstackConstructed";
import {InputFile} from "~/app/_components/atoms/fileinput";
import {useAtom} from "jotai";
import {filesAtom} from "~/app/store/fileAtom";
type FileCardProps = {
    handleNextCard: () => void;
};

type FileChangeEvent = React.ChangeEvent<HTMLInputElement>;

export const FileCard : React.FC<FileCardProps> = ({ handleNextCard }) => {
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        console.log(files);
    }, [files]);
    const handleFileChangeParent = (event: FileChangeEvent) => {
        // Get the file from the input event
        if (event.target.files) {
            const uploadedFiles: File[] = Array.from(event.target.files);
            const jsonFiles: File[] = uploadedFiles.filter(file => file.type === 'application/json');
            if (jsonFiles.length > 0) {
                setFiles(jsonFiles);
                console.log(files)
                handleNextCard();
            }

        }
    };
    return(
    <div>

        <p>
            All Handled on your browser  <Highlight>(No snooping 🤞)</Highlight>
        </p>
        <InputFile id={"msgfile"} onFileSelect={handleFileChangeParent} onError={(error) => console.log(error)}/>
</div>
    )
}
