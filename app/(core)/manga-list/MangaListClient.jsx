// app/manga-list/MangaListClient.tsx
'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import MangaReadHistorySkeleton from '../../Components/Skeletons/MangaList/MangaReadHistorySkeleton';
import AsideComponentSkeleton from '../../Components/Skeletons/MangaList/AsideComponentSkeleton';
import MangaCardSkeleton from '../../Components/Skeletons/MangaList/MangaCardSkeleton';
import SliderComponentSkeleton from '../../Components/Skeletons/MangaList/SliderComponentSkeleton';
import LatestActivityCommentsSkeleton from '../../Components/Skeletons/MangaList/LatestActivityCommentsSkeleton';
import { useTheme } from '../../providers/ThemeContext';

const SliderComponent = dynamic(() => import('../../Components/MangaListComponents/SliderComponent'), {
    loading: () => <SliderComponentSkeleton isDark={false} />,
});

const LatestActivityComments = dynamic(() => import('../../Components/MangaListComponents/LatestActivityComments'), {
    loading: () => <LatestActivityCommentsSkeleton isDark={false} />,
});

const MangaCard = dynamic(() => import('../../Components/MangaListComponents/MangaCard'), {
    loading: () => <MangaCardSkeleton isDark={false} />,
});

const MangaReadHistory = dynamic(() => import('../../Components/MangaListComponents/MangaReadHistory'), {
    loading: () => <MangaReadHistorySkeleton isDark={false} />,
});

const AsideComponent = dynamic(() => import('../../Components/MangaListComponents/AsideComponent'), {
    loading: () => <AsideComponentSkeleton isDark={false} />,
});

export default function MangaListClient() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';


    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div className="w-full h-fit">
                <Suspense fallback={<SliderComponentSkeleton isDark={isDark} />}>
                    <SliderComponent />
                </Suspense>
            </div>
            <div className="hidden px-6 xl:px-16 lg:block">
                <Suspense fallback={<LatestActivityCommentsSkeleton isDark={isDark} />}>
                    <LatestActivityComments />
                </Suspense>
            </div>

            <div className="flex flex-col-reverse md:gap-3 md:flex-row mt-6">
                <div className="flex-1 px-2 md:pl-6 xl:pl-16 sm:px-0">
                    <Suspense fallback={<MangaCardSkeleton isDark={isDark} />}>
                        <MangaCard />
                    </Suspense>
                </div>
                <div className="w-full md:w-[30%] lg:w-[30%] overflow-x-hidden px-4 sm:pl-2 sm:pr-4 xl:pr-14 md:min-w-[250px]">
                    <Suspense fallback={<MangaReadHistorySkeleton isDark={isDark} />}>
                        <MangaReadHistory />
                    </Suspense>

                    <Suspense fallback={<AsideComponentSkeleton isDark={isDark} />}>
                        <AsideComponent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}