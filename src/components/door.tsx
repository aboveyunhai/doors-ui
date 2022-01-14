/***
 * Huge parts of codes are directly copy/paste and heavily modified from chakra-ui transition
 * credit to chakra-ui
 * https://github.com/chakra-ui/chakra-ui/tree/main/packages/transition
 */
import * as React from 'react';
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  MotionStyle,
  useDragControls,
  useMotionValue,
  Variants as TVariants,
} from 'framer-motion';
import {
  isNumber,
  determineLazyBehavior,
  useOutsideClick,
  UseDisclosureProps,
} from '../utils';
import { Target, TargetAndTransition, Transition } from 'framer-motion';

type TargetResolver<P = {}> = (
  props: P & {
    transition?: TransitionConfig;
    transitionEnd?: TransitionEndConfig;
    delay?: number | DelayConfig;
  }
) => TargetAndTransition;

type Variant<P = {}> = TargetAndTransition | TargetResolver<P>;

export type Variants<P = {}> = {
  enter: Variant<P>;
  exit: Variant<P>;
  maximized: Variant<P>;
  initial?: Variant<P>;
};

type WithMotionState<P> = Partial<Record<'enter' | 'exit' | 'maximized', P>>;

export type TransitionConfig = WithMotionState<Transition>;

export type TransitionEndConfig = WithMotionState<Target>;

export type DelayConfig = WithMotionState<number>;

const TransitionEasings = {
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
} as const;

const defaultTransition: Record<string, Transition> = {
  exit: {
    duration: 0.15,
    ease: TransitionEasings.easeInOut,
  },
  enter: {
    type: 'spring',
    damping: 25,
    stiffness: 180,
  },
  maximizied: {
    type: 'spring',
    damping: 25,
    stiffness: 180,
  },
};

export const TransitionVariants = {
  default: {
    position: { left: 0, top: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    exit: { x: 0, y: 0, opacity: 0 },
    maximized: { left: 0, top: 0, opacity: 1 },
  },
};

export type SlideDirection = 'default';

export function slideTransition(options?: { direction?: SlideDirection }) {
  const side = options?.direction ?? 'default';
  switch (side) {
    case 'default':
      return TransitionVariants.default;
    default:
      return TransitionVariants.default;
  }
}

export const TransitionDefaults = {
  enter: {
    duration: 0.2,
    ease: TransitionEasings.easeOut,
  },
  exit: {
    duration: 0.1,
    ease: TransitionEasings.easeIn,
  },
  maximized: {
    duration: 0.1,
    ease: TransitionEasings.easeOut,
  },
} as const;

export type WithTransitionConfig<P extends object> = Omit<P, 'transition'> & {
  /**
   * If `true`, the element will unmount when `in={false}` and animation is done
   */
  unmountOnExit?: boolean;
  /**
   * Show the component; triggers the enter or exit states
   */
  in?: boolean;
  /**
   * Custom `transition` definition for `enter` and `exit`
   */
  transition?: TransitionConfig;
  /**
   * Custom `transitionEnd` definition for `enter` and `exit`
   */
  transitionEnd?: TransitionEndConfig;
  /**
   * Custom `delay` definition for `enter` and `exit`
   */
  delay?: number | DelayConfig;
};

export const withDelay = {
  enter: (transition: Transition, delay?: number | DelayConfig) => ({
    ...transition,
    delay: isNumber(delay) ? delay : delay?.enter,
  }),
  exit: (transition: Transition, delay?: number | DelayConfig) => ({
    ...transition,
    delay: isNumber(delay) ? delay : delay?.exit,
  }),
  maximized: (transition: Transition, delay?: number | DelayConfig) => ({
    ...transition,
    delay: isNumber(delay) ? delay : delay?.maximized,
  }),
};

const variants: Variants<ToolItemPanelOptions> = {
  exit: ({ direction, transition, transitionEnd, delay }) => {
    const { exit: exitStyles } = slideTransition({ direction });
    return {
      ...exitStyles,
      transition:
        transition?.exit ?? withDelay.exit(defaultTransition.exit, delay),
      transitionEnd: transitionEnd?.exit,
    };
  },
  enter: ({ direction, transitionEnd, transition, delay }) => {
    const { enter: enterStyles } = slideTransition({ direction });
    return {
      ...enterStyles,
      transition:
        transition?.enter ?? withDelay.enter(defaultTransition.enter, delay),
      transitionEnd: transitionEnd?.enter,
    };
  },
  maximized: ({ direction, transitionEnd, transition, delay }) => {
    const { maximized: maximizedStyles } = slideTransition({ direction });
    return {
      ...maximizedStyles,
      transition:
        transition?.maximized ??
        withDelay.maximized(defaultTransition.maximizied, delay),
      transitionEnd: transitionEnd?.maximized,
    };
  },
};

export interface ToolItemPanelOptions {
  /**
   * The direction to slide from
   * @default "default"
   */
  direction?: SlideDirection;
  isLazy?: boolean;
  isMaximized?: boolean;
}

export interface SlideProps
  extends WithTransitionConfig<HTMLMotionProps<'div'>>,
    ToolItemPanelOptions {}

const DoorPanel = React.forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  const {
    direction = 'default',
    style,
    unmountOnExit,
    in: isOpen,
    className,
    transition,
    transitionEnd,
    delay,
    isLazy = true,
    isMaximized = false,
    children,
    ...rest
  } = props;

  const hasBeenOpened = React.useRef(false);
  if (isOpen) {
    hasBeenOpened.current = true;
  }

  const shouldRenderChildren = determineLazyBehavior({
    hasBeenSelected: hasBeenOpened.current,
    isLazy,
    lazyBehavior: 'keepMounted',
    isSelected: isOpen,
  });

  // const transitionStyles = slideTransition({ direction });
  const computedStyle: MotionStyle = Object.assign(
    { position: 'fixed' },
    // transitionStyles.position,
    {
      left: 0,
      top: 0,
    },
    style
  );

  const show = unmountOnExit ? isOpen && unmountOnExit : true;
  const animate =
    isMaximized && isOpen
      ? 'maximized'
      : isOpen || unmountOnExit
      ? 'enter'
      : 'exit';

  const custom = { transitionEnd, transition, direction, delay };

  return (
    <AnimatePresence custom={custom}>
      {show && (
        <motion.div
          {...rest}
          ref={ref}
          initial="exit"
          animate={animate}
          exit="exit"
          custom={custom}
          variants={variants as TVariants}
          style={computedStyle}
        >
          {shouldRenderChildren ? children : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const HandlerSvg = (props: {
  pathStyles?: React.SVGProps<SVGPathElement>['style'];
  svgStyles?: React.SVGProps<SVGSVGElement>['style'];
}) => {
  const { pathStyles, svgStyles } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      width="100%"
      viewBox="0 0 24 24"
      style={svgStyles}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        style={pathStyles}
      />
    </svg>
  );
};

export const Door: React.FC<{
  title?: string;
  isLazy?: boolean;
  width?: number;
  height?: number;
  disclosureProps: UseDisclosureProps & { onToggle?: () => void };
  lessThanScreen?: boolean;
}> = ({
  title,
  isLazy,
  children,
  width = 300,
  height = 400,
  disclosureProps,
  lessThanScreen = false,
}) => {
  const { isOpen, onOpen, onClose, onToggle } = disclosureProps;
  const dragControls = useDragControls();
  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isFocus, setIsFocus] = React.useState(true);
  const [isMaximize, setMaximize] = React.useState(false);

  // windows size
  const x = useMotionValue(width);
  const y = useMotionValue(height);
  const [memoSize, setMemoSize] = React.useState({
    x: width,
    y: height,
  });

  const headBarHeight = 32;
  const handleSize = 15;
  const borderColor = '1px solid rgba(186, 188, 190, 0.5)';

  const handleDragX = React.useCallback(
    (event, info) => {
      let newHeight = x.get() + info.delta.x;
      if (newHeight > 100) {
        x.set(x.get() + info.delta.x);
      }
    },
    [x]
  );

  const handleDragY = React.useCallback(
    (event, info) => {
      let newHeight = y.get() + info.delta.y;
      if (newHeight > 100) {
        y.set(y.get() + info.delta.y);
      }
    },
    [y]
  );

  useOutsideClick({
    ref: ref,
    handler: () => setIsFocus(false),
  });

  const cleanAllSelection = React.useCallback(() => {
    // does not include IE
    window.getSelection()?.empty();
  }, []);

  const getScreenSize = React.useCallback(() => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    const screenHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    return { screenWidth, screenHeight };
  }, []);

  const toggleSize = React.useCallback(() => {
    if (isMaximize) {
      x.set(memoSize.x);
      y.set(memoSize.y);
    } else {
      setMemoSize({ x: x.get(), y: y.get() });
      const { screenWidth, screenHeight } = getScreenSize();
      x.set(screenWidth);
      y.set(screenHeight);
    }
    setMaximize(!isMaximize);
  }, [isMaximize, memoSize, x, y, getScreenSize]);

  const updateDimension = React.useCallback(() => {
    const { screenWidth, screenHeight } = getScreenSize();

    if (isMaximize) {
      x.set(screenWidth);
      y.set(screenHeight);
      return;
    }

    if (x.get() > screenWidth) x.set(screenWidth);
    if (y.get() > screenHeight) y.set(screenHeight);
  }, [getScreenSize, isMaximize, x, y]);

  React.useEffect(() => {
    if (lessThanScreen) {
      window.addEventListener('resize', updateDimension);
      return () => window.removeEventListener('resize', updateDimension);
    }
  }, [lessThanScreen, updateDimension]);

  const btnStyle: React.CSSProperties | undefined = {
    height: `${headBarHeight}px`,
    width: '45px',
    minWidth: '45px',
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: '5px',
    paddingLeft: '15px',
    paddingRight: '15px',
  };

  return (
    <React.Fragment>
      <DoorPanel
        ref={ref}
        in={isOpen}
        style={{
          width: x,
          height: y,
          minWidth: '200px',
          backgroundColor: 'white',
          border: borderColor,
          zIndex: isFocus ? 19999 : 9999,
          visibility: isOpen ? 'visible' : 'hidden',
        }}
        onPointerDownCapture={(e) => {
          setIsFocus(true);
        }}
        isMaximized={isMaximize}
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        isLazy={isLazy}
      >
        <div
          className="door-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            userSelect: 'none',
            height: `${headBarHeight}px`,
            backgroundColor: isDragging
              ? 'rgb(222, 225, 230)'
              : 'rgb(241, 243, 244)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '16px',
            }}
            onPointerDown={(e) => {
              setIsDragging(true);
              // not sure about the selection,
              // could be annoying though
              cleanAllSelection();
              dragControls.start(e);
            }}
            onPointerUp={(e) => {
              setIsDragging(false);
            }}
          >
            {title}
          </div>
          <button className="door-btn" style={btnStyle} onClick={toggleSize}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="100%"
              width="100%"
              viewBox="0 0 24 24"
            >
              {isMaximize ? (
                <path d="M6 19h12v2H6z" />
              ) : (
                <path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12z" />
              )}
            </svg>
          </button>
          <button
            aria-label="Close Panel"
            className="door-btn door-warning"
            style={btnStyle}
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="100%"
              width="100%"
              viewBox="0 0 24 24"
            >
              {/* <path d="M0 0h24v24H0z" fill="none" /> */}
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            height: `calc(100% - ${headBarHeight + handleSize}px)`,
          }}
        >
          <div
            className="door-panel"
            style={{
              // this prevents text-selection outside of div
              overflow: 'auto',
              height: '100%',
              width: '100%',
            }}
          >
            {children}
          </div>
          {!isMaximize && (
            <motion.div
              style={{
                cursor: 'e-resize',
                textAlign: 'center',
                height: '100%',
                width: `${handleSize}px`,
                backgroundColor: isDragging
                  ? 'rgb(222, 225, 230)'
                  : 'rgb(241, 243, 244)',
              }}
              drag="x"
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={handleDragX}
            >
              <HandlerSvg />
            </motion.div>
          )}
        </div>
        {!isMaximize && (
          <motion.div
            style={{
              cursor: 'n-resize',
              textAlign: 'center',
              height: `${handleSize}px`,
              backgroundColor: isDragging
                ? 'rgb(222, 225, 230)'
                : 'rgb(241, 243, 244)',
            }}
            drag="y"
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDragY}
          >
            <HandlerSvg
              pathStyles={{
                transform: 'rotate(90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </motion.div>
        )}
      </DoorPanel>
    </React.Fragment>
  );
};

/***

current color palette to simulate chrome vibe
https://www.schemecolor.com/google-chrome-ui.php

Name: Granite Gray
Hex: #5F6368
RGB: (95, 99, 104)
CMYK: 0.086, 0.048, 0, 0.592

PLATINUM	
Name: Platinum
Hex: #DEE1E6
RGB: (222, 225, 230)
CMYK: 0.034, 0.021, 0, 0.098

ANTI-FLASH WHITE	
Name: Anti-Flash White
Hex: #F1F3F4
RGB: (241, 243, 244)
CMYK: 0.012, 0.004, 0, 0.043

X11 GRAY	
Name: X11 Gray
Hex: #BABCBE
RGB: (186, 188, 190)
CMYK: 0.021, 0.010, 0, 0.254

DAVY'S GREY	
Name: Davy's Grey
Hex: #535353
RGB: (83, 83, 83)
CMYK: 0, 0, 0, 0.674

RAISIN BLACK	
Name: Raisin Black
Hex: #202124
RGB: (32, 33, 36)
CMYK: 0.111, 0.083, 0, 0.858

***/
