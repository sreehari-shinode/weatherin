import React from 'react';

const WindMapSection = ({ latitude, longitude }) => {
    const windyUrl = `https://embed.windy.com/embed2.html?latitude=${latitude}&longitude=${longitude}&detaillatitude=${latitude}&detaillongitude=${longitude}&zoom=12&level=surface&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates`;

  return (
    <div className="mt-10 px-4">
      <h2 className="text-2xl font-bold text-white mb-4">Global Wind Map</h2>
      <div className="w-full rounded-xl overflow-hidden shadow-lg border border-white border-opacity-10">
        <iframe
          title="Windy Map"
          width="100%"
          height="500"
          src={windyUrl}
          frameBorder="0"
          className="w-full h-[500px] rounded-xl"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default WindMapSection;
