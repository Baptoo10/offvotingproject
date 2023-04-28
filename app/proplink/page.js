"use client"; // this is a client component

import React from 'react';
import { useRouter } from 'next/router'

export default function  Proplink () {
    const router = useRouter();
    const { id } = router.query;
   // const { id } = router.query ? router.query : {};

    return (
        <div>
            <h1>Les règles du vote</h1>
            <p>Voici les règles du vote:</p>
            <ul>
                <li>Règle 1</li>
                <li>Règle 2</li>
                <li>Règle 3</li>
            </ul>
        </div>
    );
}

