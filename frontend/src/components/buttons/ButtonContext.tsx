import { TfiAngleLeft } from "react-icons/tfi";
import { TfiAngleRight } from "react-icons/tfi";

import { TfiClose } from "react-icons/tfi";

const ButtonContext = () => {
  return (
    <>
      <button id="BackBtns" className="BackBtn max-h-6 max-w-6 p-2 block">
        ${<TfiAngleLeft />}
      </button>

      <button className="NextBtn max-h-6 max-w-6 p-2 block hover:color-green-500">
        ${<TfiAngleRight />}
      </button>
      <button className="CloseBtn max-h-6 max-w-6 p-2 block hover:color-red-500">
        ${<TfiClose />}
      </button>
    </>
  );
};

export default ButtonContext;
