import React, { useRef, useEffect } from 'react';
const Canvas = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        console.log('here1123')
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'red';
                ctx.fillRect(0, 0, 100, 100);

                //add text that says "hello world ten times in a row" to the center of the canvas
                ctx.font = '30px Arial';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText('Hello World', canvas.width / 2, canvas.height / 2);

            }
        }
    }, []);

    return (
        <div className="canvas">
            <h1>yoyoyo</h1>
            <canvas id='canvas' ref={canvasRef} />
        </div>
    )
}

export default Canvas;