"use client";
import { CardStack } from "~/app/_components/atoms/cardstack";
import { cn } from "@/utils/cn";
import {InputFile} from "~/app/_components/atoms/fileinput";
import React from "react";
import {FileCard} from "~/app/_components/atoms/fileCard";
import {AnalyzeCard} from "~/app/_components/atoms/analysisCard";


export function CardStackInput() {
    const [cards, setCards] = React.useState(CARDS);


    return (
        <div className="h-[40rem] flex items-center justify-center w-full">

            <CardStack items={cards}  />

        </div>
    );
}
// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
                              children,
                              className,
                          }: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <span
            className={cn(
                "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
                className
            )}
        >
      {children}
    </span>
    );
};

const CARDS = [
    {
        id: 0,
        name: "Manu Arora",
        designation: "Senior Software Engineer",
        content: (
        <FileCard handleNextCard={() => {}} />
        ),
    },
    {
        id: 1,
        name: "Elon Musk",
        designation: "Senior Shitposter",
        content: (
            <AnalyzeCard handleNextCard={() => {}} />

        ),
    },
    {
        id: 2,
        name: "Tyler Durden",
        designation: "Manager Project Mayhem",
        content: (
            <FileCard handleNextCard={() => {}} />

        ),
    },
];