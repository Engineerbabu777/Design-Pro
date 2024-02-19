


import React from 'react'
import Cursor from './Cursor';
import { COLORS } from '@/constants';

type Props = {
    others: import('@/types/type').LiveCursorProps
}

export default function LiveCursors({others}: Props) {
  
    return others.map(({connectionId, presence}) => {
        
        // IF WE DON'T HAVE ANY PRESENCE!
        if(!presence?.cursor){
            return null;
        }
        
        // IF WE HAVE ANY PRESENCE!
        return(<>
        <Cursor 
        key={connectionId}
        color={COLORS[Number(connectionId) % COLORS.length]}
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message}
        />
        </>)
    })
}