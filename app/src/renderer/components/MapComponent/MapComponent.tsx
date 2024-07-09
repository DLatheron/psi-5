import React from "react";

import { useComponentSize } from "../../hooks";

import TestShip from "assets/ships/TestShip.png";

export interface MapComponentProps {}

export function MapComponent(props: MapComponentProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const { width, height } = useComponentSize(containerRef);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }
    
        let accumulatedTime = 0;
    
        console.warn('Canvas initialise - Should only happen once on map load!!!');

        let rotation = 0;
    
        function loop(time: number): void {
            const frameDelta = time - accumulatedTime;
   
            // Do rendering here...
            context!.clearRect(0, 0, width, height);

            const drawing = new Image(); drawing.src = TestShip
            const halfWidth = drawing.width / 2;
            const halfHeight = drawing.height / 2;
            rotation += 0.01 * frameDelta / 25;
            
            context!.save();
            context!.translate(drawing.width + 200, drawing.height + 400);
            context!.rotate(rotation);
            context!.drawImage(drawing, -halfWidth, -halfHeight);
            context!.restore();

            accumulatedTime = time;
            requestAnimationFrame(loop);
        }
    
        requestAnimationFrame(loop);
    }, []);

    return (
        <div 
            className="map-component" 
            ref={containerRef}
            style={{ width: "100%", height: "100vh" }}
        >
            <canvas
                id="main-map"
                ref={canvasRef}
                width={width}
                height={height}
            />
        </div>
    )
}
