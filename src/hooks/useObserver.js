import { useEffect, useRef } from "react";

export const useObserver = (ref, canLoad, isLoading, callback) => {
    const observer = useRef(null);
      useEffect(() => {
        if(isLoading) return;
        if(!ref.current) return;

        if (observer.current) observer.current.disconnect();

        const cb = (entries) => {
            if (entries[0].isIntersecting && canLoad) {
                callback();
            }
        };

        observer.current = new IntersectionObserver(cb);
        observer.current.observe(ref.current);

        return () => observer.current.disconnect();
    }, [isLoading, canLoad, callback, ref]);
};