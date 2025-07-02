import React from 'react';
import MangaReadHistory from '../../Components/MangaListComponents/MangaReadHistory';
import LatestActivityComments from '../../Components/MangaListComponents/LatestActivityComments';
import MangaCard from '../../Components/MangaListComponents/MangaCard';
import AsideComponent from '../../Components/MangaListComponents/AsideComponent';
import SliderComponent from '../../Components/MangaListComponents/SliderComponent';

const MangaList = () => {
  return (
    <div className="relative min-h-screen w-full  overflow-hidden">
      <div className="w-full h-fit">
        <SliderComponent />
      </div>
      <div className="hidden md:block">
        <LatestActivityComments />
      </div>
      <div className="flex flex-col-reverse md:flex-row mt-6 md:mt-0">
        <div className="md:w-[70%]">
          <MangaCard />
        </div>
        <div className="md:w-[30%]">
          <MangaReadHistory />
          <AsideComponent />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MangaList);