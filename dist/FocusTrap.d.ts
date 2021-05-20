/// <reference types="react" />
export interface FocusTrapOptions {
    focusOn?: 'firstFocusableElement' | 'modalRoot';
}
interface FocusTrapProps {
    container?: React.RefObject<HTMLElement> | null;
    options?: FocusTrapOptions;
}
export declare const FocusTrap: ({ container, options }: FocusTrapProps) => null;
export {};
