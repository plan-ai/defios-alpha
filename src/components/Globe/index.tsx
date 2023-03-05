import React, { useEffect, useRef, useState } from 'react';
import { arcsData, ripplesData } from './dataset';
import AnimatedGlobe from 'react-globe.gl';

const Globe = () => {
  const globeEl = useRef<any>();
  const [countries, setCountries] = useState({ features: [] });
  useEffect(() => {
    fetch('datasets/ne_110m_admin_0_countries.json')
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().enableZoom = false;
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 2;
      globeEl.current.controls().enabled = false;
    }
  }, []);

  return (
    <AnimatedGlobe
      ref={globeEl}
      width={900}
      height={900}
      waitForGlobeReady={true}
      arcsData={arcsData}
      arcColor={() => '#FFFFFF'}
      arcDashLength={() => Math.random()}
      arcDashGap={() => Math.random()}
      arcDashAnimateTime={() => Math.random() * 4000 + 500}
      backgroundColor={'#00000000'}
      showGlobe={false}
      showAtmosphere={false}
      hexPolygonsData={countries.features}
      hexPolygonResolution={3}
      hexPolygonMargin={0.3}
      hexPolygonColor={() => '#90A9FC'}
      ringsData={ripplesData}
      ringColor={() => '#FFFFFF'}
      ringMaxRadius="maxR"
      ringPropagationSpeed="propagationSpeed"
      ringRepeatPeriod="repeatPeriod"
    />
  );
};

export default Globe;
