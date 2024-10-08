import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { PixelRatio, StyleSheet, View } from 'react-native';
import createElement from 'react-native-web/dist/exports/createElement';
function getElement(component) {
    try {
        return findDOMNode(component);
    }
    catch {
        return component;
    }
}
function setRef(refProp, ref) {
    if (!refProp)
        return;
    if (typeof refProp === 'function') {
        refProp(ref);
    }
    else if ('current' in refProp) {
        // @ts-ignore
        refProp.current = ref;
    }
}
const Canvas = React.forwardRef((props, ref) => createElement('canvas', { ...props, ref }));
const CanvasWrapper = ({ pointerEvents, children, style, ...props }) => {
    const [size, setSize] = React.useState(null);
    const ref = React.useRef(null);
    const _canvasRef = React.useRef(null);
    function updateCanvasSize() {
        const canvas = _canvasRef.current;
        if (typeof HTMLCanvasElement !== 'undefined' && canvas instanceof HTMLCanvasElement) {
            const size = getSize();
            const scale = PixelRatio.get();
            canvas.style.width = `${size.width}px`;
            canvas.style.height = `${size.height}px`;
            canvas.width = size.width * scale;
            canvas.height = size.height * scale;
        }
    }
    function getSize() {
        if (size) {
            return size;
        }
        else if (!ref.current || typeof window === 'undefined') {
            return { width: 0, height: 0 };
        }
        const element = getElement(ref.current);
        const { offsetWidth: width = 0, offsetHeight: height = 0 } = element;
        return { width, height };
    }
    const onLayout = (event) => {
        const { nativeEvent: { layout: { width, height }, }, } = event;
        if (width !== size?.width || height !== size.height) {
            setSize({ width, height });
            if (props.onLayout) {
                props.onLayout(event);
            }
        }
    };
    React.useEffect(() => {
        if (ref.current != null) {
            setSize(getSize());
        }
    }, [ref]);
    React.useEffect(() => {
        updateCanvasSize();
    }, [size]);
    React.useEffect(() => {
        const canvas = _canvasRef.current;
        if (canvas) {
            updateCanvasSize();
        }
        setRef(props.canvasRef, canvas);
    }, [_canvasRef]);
    return (<View {...props} style={[styles.wrapper, style]} ref={ref} onLayout={onLayout}>
      <Canvas ref={_canvasRef} pointerEvents={pointerEvents} style={StyleSheet.absoluteFill}/>
      {children}
    </View>);
};
const styles = StyleSheet.create({
    wrapper: {
        pointerEvents: 'box-none',
    },
});
export default CanvasWrapper;
//# sourceMappingURL=Canvas.js.map