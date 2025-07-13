import { langToCountry } from "../constants/Flags";

// Dynamically import Flag component with next/dynamic
import Flag from "react-world-flags"
const StableFlag = ({ code,className }) => {
  return <Flag code={langToCountry[code] || "USA"} fallback={ <span>Unknown</span> } className={`${className?className:"w-6 shadow-md shadow-black mr-2"}`} />;
};

export default StableFlag;