"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {InputFile} from "~/app/_components/atoms/fileinput";
import {useState} from "react";

interface FileUploadProps {
    title: string;
    description: string;
}

export default function FileUpload() {

    const [isFlipped, setIsFlipped] = useState(false);
    const handleFileSelect = (file) => {
        console.log('Selected file:', file);
         setIsFlipped(true);
            console.log('fliparoo')
    };
    const handleError = (error: string) => {
        console.error('Error:', error);
        // Handle the error appropriately
    };
return(
    <div className="w-[30vw] h-[30vh] perspective">

        <div className={`dcard  transform ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className={`front ${isFlipped ? 'rotate-y-180 hidey' : ''}`}>

            <Card>
                <CardHeader>
                    <CardTitle>Load Messages</CardTitle>
                    <CardDescription> All Handled on your browser (No snooping 🤞)</CardDescription>
                </CardHeader>
                <CardContent>
                    <InputFile id="msg" onFileSelect={handleFileSelect} onError={handleError}/>
                </CardContent>
    </Card>
            </div>
            <div className="back rotate-y-180">
                <Card>
                    <CardHeader>
                        <CardTitle>Analyze</CardTitle>
                        <CardDescription> Press the button for funny text AI stuff</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InputFile id="msg" onFileSelect={handleFileSelect} onError={handleError}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
)
}