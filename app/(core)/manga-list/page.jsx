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
      <div className="hidden px-6 xl:px-16   lg:block">
        <LatestActivityComments />
      </div>
      <div className="flex flex-col-reverse md:gap-3  md:flex-row mt-6 ">
        <div className="flex-1 px-2 md:pl-6 xl:pl-16 sm:px-0 ">
          <MangaCard />
        </div>
        <div className="w-full md:w-[30%] lg:w-[30%] overflow-x-hidden px-4 sm:pl-2 sm:pr-4 xl:pr-14   md:min-w-[250px]">
          <MangaReadHistory />
          <AsideComponent />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MangaList);