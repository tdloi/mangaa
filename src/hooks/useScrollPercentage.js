import { useState, useEffect } from 'react';
import throttle from 'lodash.throttle';

export default function useScrollPercentage() {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const height = document.body.scrollHeight - window.innerHeight;

  useEffect(() => {
    const setScroll = throttle(() => {
      const percentage = Math.round(window.scrollY / height * 100);
      setScrollPercentage(percentage);
    }, 150)

    document.addEventListener('scroll', setScroll);

    return () => document.removeEventListener('scroll', setScroll);
  })

  return scrollPercentage;
}
