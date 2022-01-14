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

export function isFunction<T extends Function = Function>(
  value: any
): value is T {
  return typeof value === 'function';
}

export function runIfFn<T, U>(
  valueOrFn: T | ((...fnArgs: U[]) => T),
  ...args: U[]
): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}

export type FunctionArguments<T extends Function> = T extends (
  ...args: infer R
) => any
  ? R
  : never;

export function callAllHandlers<T extends (event: any) => void>(
  ...fns: (T | undefined)[]
) {
  return function func(event: FunctionArguments<T>[0]) {
    fns.some((fn) => {
      fn?.(event);
      return event?.defaultPrevented;
    });
  };
}
