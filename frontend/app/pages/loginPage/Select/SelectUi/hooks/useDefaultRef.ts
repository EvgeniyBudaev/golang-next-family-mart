import * as React from 'react';

export const useDefaultRef = <T>(ref: React.ForwardedRef<T>): React.MutableRefObject<T> => {
    const defaultRef = React.useRef<T>(null);
    const resultRef = (ref || defaultRef) as React.MutableRefObject<T>;

    return resultRef;
};
