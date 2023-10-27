import * as React from 'react';

export type TIntervalId = NodeJS.Timeout | undefined;

type TUseIntervalId = () => React.MutableRefObject<TIntervalId>;

export const useIntervalId: TUseIntervalId = () => {
    const intervalId = React.useRef<TIntervalId>(undefined);

    React.useEffect(() => () => clearInterval(intervalId.current), []);

    return intervalId;
};
