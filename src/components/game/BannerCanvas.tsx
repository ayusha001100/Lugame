import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Rect, Circle, IText, Textbox, Triangle, Shadow } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Square,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Type,
  Trash2,
  Download,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  Layers,
  Move,
  ZoomIn,
  ZoomOut,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BannerCanvasProps {
  width?: number;
  height?: number;
  onExport: (imageData: string, elements: CanvasElementData[]) => void;
  problemStatement: string;
}

interface CanvasElementData {
  type: string;
  properties: Record<string, unknown>;
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8B500', '#00CED1', '#FF69B4', '#32CD32', '#FF4500',
  '#1E90FF', '#FFD700', '#8A2BE2', '#00FA9A', '#DC143C',
  '#FFFFFF', '#000000', '#333333', '#666666', '#999999'
];

const GRADIENT_PRESETS = [
  { name: 'Sunset', colors: ['#FF6B6B', '#FFE66D'] },
  { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
  { name: 'Forest', colors: ['#11998e', '#38ef7d'] },
  { name: 'Fire', colors: ['#f12711', '#f5af19'] },
  { name: 'Purple', colors: ['#8E2DE2', '#4A00E0'] },
  { name: 'Dark', colors: ['#232526', '#414345'] },
];

export const BannerCanvas: React.FC<BannerCanvasProps> = ({
  width = 800,
  height = 450,
  onExport,
  problemStatement
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState('#4ECDC4');
  const [activeTool, setActiveTool] = useState<'select' | 'rectangle' | 'circle' | 'triangle' | 'text'>('select');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedObject, setSelectedObject] = useState<unknown>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#1a1a2e',
      selection: true,
      preserveObjectStacking: true,
    });

    // Initialize drawing brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = 2;
    }

    // Event listeners
    canvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0]));
    canvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0]));
    canvas.on('selection:cleared', () => setSelectedObject(null));

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  // Update active color on brush
  useEffect(() => {
    if (!fabricCanvas) return;
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
    }
  }, [activeColor, fabricCanvas]);

  const addRectangle = useCallback(() => {
    if (!fabricCanvas) return;
    const rect = new Rect({
      left: Math.random() * (width - 150),
      top: Math.random() * (height - 100),
      fill: activeColor,
      width: 150,
      height: 100,
      rx: 8,
      ry: 8,
      shadow: new Shadow({ color: 'rgba(0,0,0,0.3)', offsetX: 5, offsetY: 5, blur: 10 }),
    });
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
  }, [fabricCanvas, activeColor, width, height]);

  const addCircle = useCallback(() => {
    if (!fabricCanvas) return;
    const circle = new Circle({
      left: Math.random() * (width - 100),
      top: Math.random() * (height - 100),
      fill: activeColor,
      radius: 50,
      shadow: new Shadow({ color: 'rgba(0,0,0,0.3)', offsetX: 5, offsetY: 5, blur: 10 }),
    });
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.renderAll();
  }, [fabricCanvas, activeColor, width, height]);

  const addTriangle = useCallback(() => {
    if (!fabricCanvas) return;
    const triangle = new Triangle({
      left: Math.random() * (width - 100),
      top: Math.random() * (height - 100),
      fill: activeColor,
      width: 100,
      height: 100,
      shadow: new Shadow({ color: 'rgba(0,0,0,0.3)', offsetX: 5, offsetY: 5, blur: 10 }),
    });
    fabricCanvas.add(triangle);
    fabricCanvas.setActiveObject(triangle);
    fabricCanvas.renderAll();
  }, [fabricCanvas, activeColor, width, height]);

  const addText = useCallback(() => {
    if (!fabricCanvas || !textInput.trim()) return;
    const text = new Textbox(textInput, {
      left: Math.random() * (width - 200),
      top: Math.random() * (height - 50),
      fill: activeColor,
      fontSize: 32,
      fontFamily: 'Inter, sans-serif',
      fontWeight: 'bold',
      width: 300,
      shadow: new Shadow({ color: 'rgba(0,0,0,0.5)', offsetX: 2, offsetY: 2, blur: 4 }),
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    setTextInput('');
  }, [fabricCanvas, textInput, activeColor, width, height]);

  const addHeadline = useCallback(() => {
    if (!fabricCanvas) return;
    const text = new Textbox('Your Headline Here', {
      left: width / 2 - 200,
      top: 50,
      fill: '#FFFFFF',
      fontSize: 48,
      fontFamily: 'Inter, sans-serif',
      fontWeight: 'bold',
      width: 400,
      textAlign: 'center',
      shadow: new Shadow({ color: 'rgba(0,0,0,0.5)', offsetX: 2, offsetY: 2, blur: 8 }),
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  }, [fabricCanvas, width]);

  const addSubtext = useCallback(() => {
    if (!fabricCanvas) return;
    const text = new Textbox('Supporting text goes here', {
      left: width / 2 - 150,
      top: 120,
      fill: '#CCCCCC',
      fontSize: 24,
      fontFamily: 'Inter, sans-serif',
      width: 300,
      textAlign: 'center',
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  }, [fabricCanvas, width]);

  const addCTAButton = useCallback(() => {
    if (!fabricCanvas) return;
    
    // Button background
    const btnBg = new Rect({
      left: width / 2 - 75,
      top: height - 100,
      fill: '#FF6B6B',
      width: 150,
      height: 50,
      rx: 25,
      ry: 25,
      shadow: new Shadow({ color: 'rgba(255,107,107,0.4)', offsetX: 0, offsetY: 8, blur: 20 }),
    });
    
    // Button text
    const btnText = new IText('Get Started', {
      left: width / 2 - 50,
      top: height - 88,
      fill: '#FFFFFF',
      fontSize: 18,
      fontFamily: 'Inter, sans-serif',
      fontWeight: 'bold',
    });
    
    fabricCanvas.add(btnBg);
    fabricCanvas.add(btnText);
    fabricCanvas.renderAll();
  }, [fabricCanvas, width, height]);

  const applyGradientBackground = useCallback((colors: string[]) => {
    if (!fabricCanvas) return;
    
    // Create gradient background using a rect
    const gradientRect = new Rect({
      left: 0,
      top: 0,
      width: width,
      height: height,
      selectable: false,
      evented: false,
    });
    
    // Set gradient fill using fabric's gradient syntax
    gradientRect.set('fill', {
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: width, y2: height },
      colorStops: [
        { offset: 0, color: colors[0] },
        { offset: 1, color: colors[1] }
      ]
    });
    
    // Remove old background if exists
    const objects = fabricCanvas.getObjects();
    const oldBg = objects.find(obj => !obj.selectable && obj.type === 'rect');
    if (oldBg) {
      fabricCanvas.remove(oldBg);
    }
    
    fabricCanvas.add(gradientRect);
    fabricCanvas.sendObjectToBack(gradientRect);
    fabricCanvas.renderAll();
  }, [fabricCanvas, width, height]);

  const deleteSelected = useCallback(() => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    activeObjects.forEach(obj => {
      if (obj.selectable !== false) {
        fabricCanvas.remove(obj);
      }
    });
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
    setSelectedObject(null);
  }, [fabricCanvas]);

  const clearCanvas = useCallback(() => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#1a1a2e';
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const changeSelectedColor = useCallback((color: string) => {
    if (!fabricCanvas || !selectedObject) return;
    (selectedObject as { set: (prop: string, value: string) => void }).set('fill', color);
    fabricCanvas.renderAll();
  }, [fabricCanvas, selectedObject]);

  const bringForward = useCallback(() => {
    if (!fabricCanvas || !selectedObject) return;
    fabricCanvas.bringObjectForward(selectedObject as any);
    fabricCanvas.renderAll();
  }, [fabricCanvas, selectedObject]);

  const sendBackward = useCallback(() => {
    if (!fabricCanvas || !selectedObject) return;
    fabricCanvas.sendObjectBackwards(selectedObject as any);
    fabricCanvas.renderAll();
  }, [fabricCanvas, selectedObject]);

  const exportCanvas = useCallback(() => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
    
    // Collect element data for AI evaluation
    const elements: CanvasElementData[] = fabricCanvas.getObjects().map(obj => ({
      type: obj.type || 'unknown',
      properties: {
        fill: (obj as { fill?: string }).fill,
        width: obj.width,
        height: obj.height,
        left: obj.left,
        top: obj.top,
        text: (obj as { text?: string }).text,
        fontSize: (obj as { fontSize?: number }).fontSize,
        fontWeight: (obj as { fontWeight?: string }).fontWeight,
      }
    }));
    
    onExport(dataURL, elements);
  }, [fabricCanvas, onExport]);

  const zoomIn = () => setCanvasScale(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setCanvasScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="flex flex-col gap-4">
      {/* Problem Statement */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-4 border-l-4 border-primary"
      >
        <h3 className="font-semibold text-sm text-primary mb-2">📋 Design Brief</h3>
        <p className="text-sm text-muted-foreground">{problemStatement}</p>
      </motion.div>

      {/* Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 glass-card rounded-xl p-3"
      >
        {/* Shape Tools */}
        <div className="flex gap-1 border-r border-border/50 pr-2">
          <Button
            variant={activeTool === 'select' ? 'glow' : 'glass'}
            size="icon"
            onClick={() => setActiveTool('select')}
            title="Select/Move"
          >
            <Move className="w-4 h-4" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={addRectangle}
            title="Add Rectangle"
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={addCircle}
            title="Add Circle"
          >
            <CircleIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={addTriangle}
            title="Add Triangle"
          >
            <TriangleIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Text Tools */}
        <div className="flex gap-1 items-center border-r border-border/50 pr-2">
          <Input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text..."
            className="w-32 h-8 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addText()}
          />
          <Button variant="glass" size="icon" onClick={addText} title="Add Text">
            <Type className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Add */}
        <div className="flex gap-1 border-r border-border/50 pr-2">
          <Button variant="glass" size="sm" onClick={addHeadline} className="text-xs">
            Headline
          </Button>
          <Button variant="glass" size="sm" onClick={addSubtext} className="text-xs">
            Subtext
          </Button>
          <Button variant="glass" size="sm" onClick={addCTAButton} className="text-xs">
            CTA Button
          </Button>
        </div>

        {/* Color Picker */}
        <div className="relative">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{ backgroundColor: activeColor + '40' }}
          >
            <Palette className="w-4 h-4" style={{ color: activeColor }} />
          </Button>
          
          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-12 left-0 z-50 glass-card rounded-xl p-3 shadow-xl"
              >
                <div className="grid grid-cols-5 gap-1 mb-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        'w-6 h-6 rounded-full border-2 transition-transform hover:scale-110',
                        activeColor === color ? 'border-white ring-2 ring-primary' : 'border-transparent'
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setActiveColor(color);
                        if (selectedObject) changeSelectedColor(color);
                      }}
                    />
                  ))}
                </div>
                
                <div className="border-t border-border/50 pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Gradient Backgrounds</p>
                  <div className="grid grid-cols-3 gap-1">
                    {GRADIENT_PRESETS.map((gradient) => (
                      <button
                        key={gradient.name}
                        className="h-6 rounded-md border border-border/50 hover:scale-105 transition-transform"
                        style={{ 
                          background: `linear-gradient(135deg, ${gradient.colors[0]}, ${gradient.colors[1]})` 
                        }}
                        onClick={() => applyGradientBackground(gradient.colors)}
                        title={gradient.name}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Layer Controls */}
        <div className="flex gap-1 border-r border-border/50 pr-2">
          <Button variant="glass" size="icon" onClick={bringForward} title="Bring Forward" disabled={!selectedObject}>
            <Layers className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex gap-1 border-r border-border/50 pr-2">
          <Button variant="glass" size="icon" onClick={zoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs flex items-center px-2">{Math.round(canvasScale * 100)}%</span>
          <Button variant="glass" size="icon" onClick={zoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-1 ml-auto">
          <Button variant="glass" size="icon" onClick={deleteSelected} title="Delete Selected" disabled={!selectedObject}>
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
          <Button variant="glass" size="icon" onClick={clearCanvas} title="Clear All">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="glow" size="sm" onClick={exportCanvas} className="ml-2">
            <Download className="w-4 h-4 mr-1" />
            Submit Design
          </Button>
        </div>
      </motion.div>

      {/* Canvas Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-xl border border-border/50 shadow-2xl"
        style={{ transform: `scale(${canvasScale})`, transformOrigin: 'top left' }}
      >
        <canvas ref={canvasRef} className="block" />
        
        {/* Canvas Guidelines Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Center guides */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/10" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/10" />
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 text-xs text-muted-foreground"
      >
        <span>💡 Click and drag to move elements</span>
        <span>🎨 Select an element to change its color</span>
        <span>⌫ Press Delete to remove selected</span>
      </motion.div>
    </div>
  );
};
