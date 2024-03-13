"use client";
import React, {Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {InputFile} from "~/app/_components/atoms/fileinput";


// let interval: any;

export type Card = {
    id: number;
    name: string;
    designation: string;
    content: React.ReactNode | ((props: { setCards: (cards: Card[]) => void; cardId: number; }) => React.ReactNode);
};

export type CardsProps = {
    setCards: Dispatch<SetStateAction<Card[]>>;
};

export const CardStack = ({
                              items,
                              offset,
                              scaleFactor,
                          }: {
    items: Card[];
    offset?: number;
    scaleFactor?: number;
}) => {
    const CARD_OFFSET = offset || 10;
    const SCALE_FACTOR = scaleFactor || 0.06;
    const [cards, setCards] = useState<Card[]>(items);


    return (
        <div className="relative  h-60 w-60 md:h-60 md:w-96">
            {cards.map((card, index) => {
                return (
                    <motion.div
                        key={card.id}
                        className="absolute dark:bg-black bg-white h-60 w-60 md:h-60 md:w-96 rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
                        style={{
                            transformOrigin: "top center",
                        }}
                        animate={{
                            top: index * -CARD_OFFSET,
                            scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
                            zIndex: cards.length - index, //  decrease z-index for the cards that are behind
                        }}
                    >
                        <div className="font-normal text-neutral-700 dark:text-neutral-200">
                            {typeof card.content === 'function' ?
                                card.content({ setCards, cardId: card.id }) :
                                card.content}
                        </div>
                        <div>
                            <p className="text-neutral-500 font-medium dark:text-white">
                                {card.name}
                            </p>
                            <p className="text-neutral-400 font-normal dark:text-neutral-200">
                                {card.designation}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
