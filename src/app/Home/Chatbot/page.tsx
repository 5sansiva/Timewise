"use client";
import React from "react";
import ChatInterface from "@/app/components/ChatInterface";


export default function ChatInterfacePage() {
    return (
        <div>
          <ChatInterface onEventCreate={(event) => console.log(event)} />
        </div>
      );
    
};