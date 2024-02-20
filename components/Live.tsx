import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@/liveblocks.config'
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import CursorChat from './cursor/CursorChat'
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type'
import ReactionSelector from './reaction/REactionButton'
import FlyingReaction from './reaction/FlyingReaction'
import useInterval from '@/hooks/useInterval'

type Props = {}

export default function Live ({}: Props) {
  // EXTRACT DATA FROM THE SAME ROOMS WHO HAVE JOINED THIS ROOM!
  const others = useOthers()

  // PRESENCE OF THE CURRENT USER FROM THE CURRENT ROOM(x,y)!
  const [{cursor},updateMyPresence] = useMyPresence() as any;

  const broadcast = useBroadcastEvent();


  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden
  });

  const [reactions, setReactions] = useState<Reaction[]>([])

  useInterval(() => {
     if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor){
        setReactions((r) => r.concat([{
          point:{x:cursor.x,y:cursor.y},
          value: cursorState.reaction,
          timestamp: Date.now()
        }]) )
          // Broadcast the reaction to other users
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
     }
  },20)

   /**
   * useEventListener is used to listen to events broadcasted by other
   * users.
   *
   * useEventListener: https://liveblocks.io/docs/api-reference/liveblocks-react#useEventListener
   */
   useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });


  const handlePointerMove = useCallback((event:React.PointerEvent) => {
    event.preventDefault();

    if(cursor === null || cursorState.mode !== CursorMode.ReactionSelector){
 // GETTING THE POINTER POSITION! FROM X AND Y !
 const x = event.clientX - event.currentTarget.getBoundingClientRect().x;

 const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

 updateMyPresence({cursor:{x,y}})
    }
    
   
  },[])

  const setReaction = useCallback((reaction:string) => {
    setCursorState({mode:CursorMode.Reaction,reaction,isPressed:false})
  },[])

  const handlePointerLeave = useCallback((event:React.PointerEvent) => {
    event.preventDefault();
    
    setCursorState({
        mode:CursorMode.Hidden
    })

    updateMyPresence({cursor:null,message:null})
  },[])

  const handlePointerUp = useCallback((event:React.PointerEvent) => {
     
    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction? {...StaticRange,isPressed:true}:state)
  },[cursorState.mode, setCursorState]);

  const handlePointerDown = useCallback((event:React.PointerEvent) => {
    event.preventDefault();
    
    // GETTING THE POINTER POSITION! FROM X AND Y !
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;

    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({cursor:{x,y}})
    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction? {...StaticRange,isPressed:true}:state)
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
   } else if(event.key === "e"){
     setCursorState({
      mode: CursorMode.ReactionSelector
     })
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
  onPointerUp={handlePointerUp}
  >
    <h1 className="text-2xl text-black">Cursor Movement Tracker</h1>

{reactions.map(r => (
  <FlyingReaction
  key={r.timestamp.toString()}
  x={r.point.x}
  y={r.point.y}
  timestamp={r.timestamp}
  value={r.value}
  />
))

}
    { cursor && <>
    <CursorChat 
    cursor={cursor}
    cursorState={cursorState}
    setCursorState={setCursorState}
    updateMyPresence={updateMyPresence}
    />
     
    </>}

    {cursorState.mode === CursorMode.ReactionSelector && (
      <ReactionSelector 
      setReaction={setReaction}
      />
    )

    }
    <LiveCursors others={others} />
    </div>
}
