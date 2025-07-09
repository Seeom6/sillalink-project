// components/LoadingSpinner.tsx
"use client";

import { ClipLoader } from 'react-spinners';

interface loading{
  size : number
  color : string
}

const Loading = ({size , color} : loading) => {
  return (
    <ClipLoader color={color} size={size} />
  );
};

export default Loading;