import * as React from 'react';

type TUseClickBodyArgs = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    wrapperRef: React.RefObject<HTMLDivElement>;
    portalRef?: React.RefObject<HTMLDivElement>;
};

export const useClickBody = <T extends HTMLElement>({
    isOpen,
    setIsOpen,
    wrapperRef,
    portalRef,
}: TUseClickBodyArgs): void => {
    React.useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (wrapperRef.current && isOpen) {
                const target = event.target as T;
                const wrapperRefHasTarget = wrapperRef.current.contains(target);
                const documentHasTarget = document.contains(target);
                const portalRefHasTarget = portalRef?.current?.contains(target) ?? false;

                if (documentHasTarget && !wrapperRefHasTarget && !portalRefHasTarget) {
                    setIsOpen((prevState) => (prevState ? false : prevState));
                }
            }
        };

        document.body.addEventListener('mousedown', handleClick);

        return () => {
            document.body.removeEventListener('mousedown', handleClick);
        };
    }, [isOpen, portalRef, setIsOpen, wrapperRef]);
};
