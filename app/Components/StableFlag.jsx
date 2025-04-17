import { langToCountry } from "../constants/Flags";
import { lazy } from "react";

// Dynamically import Flag component with next/dynamic
const Flag = lazy(() => import("react-world-flags"));

const StableFlag = ({ code,className }) => {
  return <Flag code={langToCountry[code]} fallback={ <span>Unknown</span> } className={`${className?className:"w-6 shadow-md shadow-black mr-2"}`} />;
};

export default StableFlag;