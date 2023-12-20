import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = (props: any) => (
  <>
  <ContentLoader
    speed={2}
    width={340}
    height={100}
    viewBox="0 0 340 100"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="232" y="-10" rx="3" ry="3" width="152" height="10" />
    <rect x="246" y="31" rx="3" ry="3" width="78" height="9" />
    <rect x="4" y="8" rx="3" ry="3" width="113" height="10" />
    <rect x="5" y="31" rx="3" ry="3" width="113" height="10" />
    <rect x="5" y="52" rx="3" ry="3" width="139" height="10" />
    <rect x="142" y="30" rx="0" ry="0" width="60" height="10" />
  </ContentLoader>
  </>
);

const MyLoaderContainer = () => (
  <div className='-mb-5 block bg-white-color' >
    {[...Array(3)].map((_, index) => (
      <MyLoader key={index} />
    ))}
  </div>
);

export default MyLoaderContainer;
