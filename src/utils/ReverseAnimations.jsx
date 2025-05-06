// ReversedLottie.js
import React, { useEffect } from 'react';
import { useLottie } from 'lottie-react';

const ReversedLottie = ({ animationData, className = "" }) => {
  const options = {
    animationData,
    loop: true,
    autoplay: false,
  };

  const { View, animation } = useLottie(options);

  useEffect(() => {
    if (animation) {
      animation.setDirection(-1);
      animation.play();
    }
  }, [animation]);

  return <div className={className}>{View}</div>;
};

export default ReversedLottie;
