"use client"
import React from 'react'
import { useState } from 'react';
import FormLogin from './FormLogin';

export default function BtnLogin() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div>
        <button
            onClick={() => setIsLoginOpen(true)}
            className="px-4 py-2 text-white bg-gray-600 hover:bg-red-400 rounded-md">
            Logovanje
        </button>

            {isLoginOpen && (
                <FormLogin setIsLoginOpen={setIsLoginOpen}></FormLogin>
            )}
    </div>

    
  )
}