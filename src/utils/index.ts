export * from './isLazy';
export * from './use-callback-ref';
export * from './use-controllable';
export * from './use-disclosure';
export * from './use-id';
export * from './use-safe-layout-effect';
export * from './use-outside-click';

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}
