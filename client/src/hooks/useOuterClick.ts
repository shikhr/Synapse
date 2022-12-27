import { useCallback, useRef, useState } from 'react';

const useOuterClick = <T extends HTMLElement>() => {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const ref = useRef<T | null>(null);

  const _onClick = (e: MouseEvent): void => {
    const clickedOutside = !ref.current?.contains(e.target as Node);
    if (clickedOutside) {
      e.preventDefault();
      e.stopPropagation();
      setIsComponentVisible(false);
    }
  };

  const innerRef = useCallback((node: T) => {
    if (ref.current) {
      console.log('removing');
      document.removeEventListener('click', _onClick, true);
    }
    if (node !== null) {
      console.log('adding addEventListener');
      document.addEventListener('click', _onClick, true);
    }
    ref.current = node;
  }, []);

  return { innerRef, isComponentVisible, setIsComponentVisible };
};

export default useOuterClick;
