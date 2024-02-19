import { useMyPresence, useOthers } from '@/liveblocks.config'
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import CursorChat from './cursor/CursorChat'
import { CursorMode } from '@/types/type'

type Props = {}

export default function Live ({}: Props) {
  // EXTRACT DATA FROM THE SAME ROOMS WHO HAVE JOINED THIS ROOM!
  const others = useOthers()

  // PRESENCE OF THE CURRENT USER FROM THE CURRENT ROOM(x,y)!
  const [{cursor},updateMyPresence] = useMyPresence() as any;

  const [cursorState, setCursorState] = useState({
    mode: CursorMode.Hidden
  });


  const handlePointerMove = useCallback((event:React.PointerEvent) => {
    event.preventDefault();
    
    // GETTING THE POINTER POSITION! FROM X AND Y !
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;

    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({cursor:{x,y}})
  },[])

  const handlePointerLeave = useCallback((event:React.PointerEvent) => {
    event.preventDefault();
    
    setCursorState({
        mode:CursorMode.Hidden
    })

    updateMyPresence({cursor:null,message:null})
  },[])

  const handlePointerDown = useCallback((event:React.PointerEvent) => {
    event.preventDefault();
    
    // GETTING THE POINTER POSITION! FROM X AND Y !
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;

    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({cursor:{x,y}})
  },[])

  useEffect(() => {
const onKeyUp = (event:KeyboardEvent) =>{
   if(event.key === "/"){
     setCursorState({
        mode:CursorMode.Chat,
        previousMessage: null,
        message:'',
     })
   }else if(event.key === "Escape"){
     updateMyPresence({message:''});
     setCursorState({mode:CursorMode.Hidden})
   }
}

const onKeyDown = (event:KeyboardEvent) =>{
    if(event.key === "/"){
        event.preventDefault();
      }
}

window.addEventListener("keyup",onKeyUp);
window.addEventListener("keydown",onKeyDown);

return () => {
    window.removeEventListener("keyup",onKeyUp);
    window.removeEventListener("keydown",onKeyDown)
}
  },[])

  return <div
  className="h-[100vh] w-full flex justify-center items-center text-center border-2 border-green-500"
  onPointerMove={handlePointerMove}
  onPointerDown={handlePointerDown}
  onPointerLeave={handlePointerLeave}
  >
    <h1 className="text-2xl text-black">Cursor Movement Tracker</h1>

    { cursor && <>
    <CursorChat 
    cursor={cursor}
    cursorState={cursorState}
    setCursorState={setCursorState}
    updateMyPresence={updateMyPresence}
    />
     
    </>}
    <LiveCursors others={others} />
    </div>
}
