"use client";
import { Input } from "~/components/ui/input"
import { useAtom } from 'jotai';
import { fileAtom, fileStorageAtom } from '~/app/store/fileAtom';
interface InputFileProps {
    id: string;
    onFileSelect: (file: File) => void;
    onError: (error: string) => void;
}


export function InputFile({ id, onFileSelect, onError }: InputFileProps) {

    const handleFileChange = (event) => {
        // Get the file from the input event
        const file = event.target.files[0];

        // Call the callback function passed from the parent
        onFileSelect(file);
    };


    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id={id} type="file" accept=".json" onChange={handleFileChange} multiple/>
        </div>
    )
}