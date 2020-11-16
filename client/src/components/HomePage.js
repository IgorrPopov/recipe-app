import React from 'react';
import RecipeCard from './RecipeCard';

const HomePage = () => {
  return (
    <>
      <section className='section-about'>
        <div className='section-about__container'>
          <div className='section-about__text-box'>
            <div className='heading-primary-box'>
              <h1 className='heading-primary'>
                <span className='heading-primary__text'>Life tastes great</span>
              </h1>
              <span className='heading-primary__sticker'>and</span>
            </div>
            <h2 className='heading-secondary'>
              <span className='heading-secondary__char1'>A</span>
              <span className='heading-secondary__char2'>l</span>
              <span className='heading-secondary__char3'>l</span>
              <span> </span>
              <span className='heading-secondary__char4'>y</span>
              <span className='heading-secondary__char5'>o</span>
              <span className='heading-secondary__char6'>u</span>
              <span> </span>
              <span className='heading-secondary__char7'>n</span>
              <span className='heading-secondary__char8'>e</span>
              <span className='heading-secondary__char9'>e</span>
              <span className='heading-secondary__char10'>d</span>
              <span> </span>
              <span className='heading-secondary__char11'>i</span>
              <span className='heading-secondary__char12'>s</span>
              <span> </span>
              <span className='heading-secondary__char13'>F</span>
              <span className='heading-secondary__char14'>O</span>
              <span className='heading-secondary__char15'>O</span>
              <span className='heading-secondary__char16'>D</span>
            </h2>
            {/* <a href='#' className='button-text'>
              <div className='button-text__text'>Just try it</div>
            </a> */}
          </div>
        </div>
      </section>
      <section className='section-recipes'>
        <h3 className='heading-tertiary'>Just try our recipes</h3>
        <div className='section-recipes__container'>
          <RecipeCard />
          <RecipeCard />
          <RecipeCard />
        </div>
      </section>
    </>
  );
};

export default HomePage;
