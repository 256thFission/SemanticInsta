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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0) {
            onFileSelect(event);
        } else {
            onError('No file selected')
            console.log("that screwed up");
        }
    };


    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id={id} type="file" accept=".json" onChange={handleFileChange} multiple/>
        </div>
    )
}