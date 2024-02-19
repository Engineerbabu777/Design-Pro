


import React from 'react'
import CursorSVG from '@/assets/public/assets/CursorSVG';
import { CursorMode } from '@/types/type';


export default function CursorChat({
    cursor,cursorState,setCursorState,updateMyPresence
}: import('@/types/type').CursorChatProps) {


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
      updateMyPresence({
        message:e.target.value
      });
      setCursorState({
        mode:CursorMode.Chat,
        previousMessage:null,
        message:e.target.value
      })
    }

    const handleKeyDown = (e: React.KeyboardEvent) =>{
     if(e.key === "Enter"){
        setCursorState({
            previousMessage:cursorState.message,
            mode:CursorMode.Chat,
            message:''
          })
     }else if(e.key === "Escape"){
        setCursorState({
            previousMessage:null,
            mode:CursorMode.Hidden,
            message:''
          })
     }
    }
  return (
    <div className='absolute top-0 left-0'
    style={{transform:`translateX(${cursor.x}px) translateY(${cursor.y}px)`}}
    >
        {cursorState?.mode === CursorMode?.Chat && (
            <>
            <CursorSVG color={"#000"}/>
<div className='absolute left-2 top-5 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white rounded-[20px]'>
{cursorState.previousMessage && (
    <div className="">
      {cursorState.previousMessage}
    </div>
)}
<input 
 className="z-10 w-60 text-white placeholder-blue-300 outline-none border-none bg-transparent"
 autoFocus
 onChange={handleChange}
 onKeyDown={handleKeyDown}
 placeholder={
    cursorState.previousMessage ? "" : 'Type a message...'
 }
 value={cursorState.message}
 maxLength={50}
/>
</div>

            </>
          ) 

         }  
    
    
    </div>
  )
}