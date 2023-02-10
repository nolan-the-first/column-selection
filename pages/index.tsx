import { MouseEvent, useEffect, useState, useRef } from "react";
// Functions
import { sendData } from "../Services/SendData";
import { v4 as uuidv4 } from "uuid";
import { calculateHypotenuse, calculateAngleFromSin } from "../utils/Math";
// Components
import Loading from "../Components/Common/Loading";
import CorrectlySentNotification from "../Components/Common/CorrectlySentNotification";
// Types
import { Accounts, lineCoordinates } from "../public/Assets/Types/types";
import { GetServerSideProps } from "next";

export default function Home({ accounts_1, accounts_2 }) {
  // Drawing Line Logic
  // Line Coordinates
  let [lineStartCoordinates, setLineStartCoordinates] =
    useState<lineCoordinates>({ x: 0, y: 0 });

  // Data Sending States
  let [isSending, setIsSending] = useState<Boolean>(false);
  let [isSentCorrectly, setIsSentCorrectly] = useState<Boolean>(false);
  let [isNotSent, setIsNotSent] = useState<Boolean>(false);

  // Handle Pressed Data
  // Pressed Columns elements data state
  let [column1Data, setColumn1Data] = useState<Accounts | null>();
  let [column2Data, setColumn2Data] = useState<Accounts | null>();
  // Handle Account element press
  function handleMouseDown(
    name: string,
    email: string,
    id: string,
    updateFunction,
    event: MouseEvent
  ) {
    // Remove Previous Data
    setColumn1Data(null);
    setColumn2Data(null);
    // Update Data based on pressed Accounts column
    updateFunction({ name, email, id });
    // Start Drawing the Line
    // Update the state (save the data)
    setLineStartCoordinates({ x: event.clientX, y: event.clientY });
    // Create the document Container
    let lineContainer = document.createElement("div");
    lineContainer.id = "lineContainer";
    lineContainer.classList.add(
      "absolute",
      "pointer-events-none",
      "selectionLine"
    );
    // Reset the width
    lineContainer.style.width = `0px`;
    // Give the point coordinates based on mouse event
    lineContainer.style.left = `${event.clientX}px`;
    lineContainer.style.top = `${event.clientY}px`;
    // add the point to the dom
    let parentDiv = document.getElementById("parentDiv") as HTMLElement;
    parentDiv.append(lineContainer);
    // Add the actual lineContainer
    let line = document.createElement("span");
    line.id = "line";
    line.classList.add(
      "absolute",
      "top-0",
      "left-0",
      "h-1",
      "bg-gray",
      "rounded-full",
      "origin-left",
      "pointer-events-none"
    );
    lineContainer.append(line);
  }
  // Handle Mouse Up Funciton, Update the state, check for the data, if found and correct, send to the api
  function handleMouseUp(
    name: string,
    email: string,
    id: string,
    firstColumn: boolean,
    event: MouseEvent
  ) {
    // Stop Event handling Propagation (Prevents deselection due to page mouse up listener)
    event.stopPropagation();
    // Remove The line
    let line = document.getElementById("line");
    let lineContainer = document.getElementById("lineContainer");
    line.remove();
    lineContainer.remove();
    // If mouse lift on the first column
    if (firstColumn) {
      // if the user pressed the second column before the first column, update the state
      if (column2Data) {
        setColumn1Data({ name, email, id });
        // if the user just pressed the element (mouse down and mouse up on the same element)
      } else {
        removeSelection();
      }
      // If mouse lift on the second column
    } else {
      // if the user pressed the First column before the second column, update the state
      if (column1Data) {
        setColumn2Data({ name, email, id });
        // if the user just pressed the element (mouse down and mouse up on the same element)
      } else {
        removeSelection();
      }
    }
  }

  // If data is found and correct => send data to the api
  useEffect(() => {
    if (column1Data && column2Data) {
      // Update Sending State
      setIsSending(true);
      sendData(column1Data.id, column2Data.id)
        // If Sent correctly, confirm the user
        .then((res) => {
          setIsSending(false);
          showCorrectlySendNotification();
        })
        // if error happend, tell the user
        .catch((err) => {
          setIsSending(false);
          setIsNotSent(true);
        });
    }
  }, [column1Data, column2Data]);

  // Function Update Sending Notification
  function showCorrectlySendNotification() {
    setIsSentCorrectly(true);
    setTimeout(() => {
      setIsSentCorrectly(false);
    }, 2500);
  }

  useEffect(() => {
    const lineMoveListener = window.addEventListener("mousemove", (e) => {
      let line = document.getElementById("line");
      if (line) {
        const lineContainer = document.getElementById("lineContainer");
        const newWidth = e.clientX - lineStartCoordinates.x;
        const newHeight = e.clientY - lineStartCoordinates.y;
        // Calculate Line Width
        let lineLength = calculateHypotenuse(newWidth, newHeight);
        // Calculate Angle
        let angle = calculateAngleFromSin(newHeight, lineLength);
        // Update line Rotation angle, and width
        line.style.width = `${lineLength}px`;
        // figure on what quarter is the line in
        let lineQuarter;
        switch (true) {
          case e.clientX > lineStartCoordinates.x &&
            e.clientY > lineStartCoordinates.y:
            lineQuarter = 4;
            break;
          case e.clientX <= lineStartCoordinates.x &&
            e.clientY >= lineStartCoordinates.y:
            lineQuarter = 3;
            break;
          case e.clientX < lineStartCoordinates.x &&
            e.clientY < lineStartCoordinates.y:
            lineQuarter = 2;
            break;
          case e.clientX >= lineStartCoordinates.x &&
            e.clientY <= lineStartCoordinates.y:
            lineQuarter = 1;
            break;
        }

        // set the line container properties
        let properties = {
          transform: "",
          transformOrigin: "",
          width: "",
          height: "",
        };
        // Modifi the container properties based on what quarter the line is in
        switch (lineQuarter) {
          case 1:
            properties.transform = "rotateY(0deg) rotateX(180deg)";
            properties.transformOrigin = "top center";
            properties.width = `${newWidth}px`;
            properties.height = `${newHeight}px`;
            line.style.transform = `rotate(${-angle}deg)`;
            break;
          case 2:
            properties.transform = "rotateY(180deg) rotateX(180deg)";
            properties.transformOrigin = "top left";
            properties.width = `${-newWidth}px`;
            properties.height = `${-newHeight}px`;
            line.style.transform = `rotate(${-angle}deg)`;
            break;
          case 3:
            properties.transform = "rotateY(180deg) rotateX(0deg)";
            properties.transformOrigin = "center left";
            properties.width = `${-newWidth}px`;
            properties.height = `${newHeight}px`;
            line.style.transform = `rotate(${angle}deg)`;
            break;
          case 4:
            properties.transform = "rotateY(0deg) rotateX(0deg)";
            properties.transformOrigin = "center left";
            properties.width = `${newWidth}px`;
            properties.height = `${newHeight}px`;
            line.style.transform = `rotate(${angle}deg)`;
            break;
        }
        // Update The container
        lineContainer.style.transform = properties.transform;
        lineContainer.style.transformOrigin = properties.transformOrigin;
        lineContainer.style.width = properties.width;
        lineContainer.style.height = properties.height;
      }
    });
  });
  // remove data selection
  function removeSelection() {
    // Remove Data
    setColumn1Data(null);
    setColumn2Data(null);
    // Remove The line
    let line = document.getElementById("line");
    let lineContainer = document.getElementById("lineContainer");
    line?.remove();
    lineContainer?.remove();
  }
  return (
    <div
      className="  relative flex items-center justify-center gap-40 h-screen bg-darkblue text-white overflow-hidden w-screen"
      id="parentDiv"
      onMouseUp={removeSelection}
    >
      {/* Data Preview */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        {/* Preview Column 1 Selection */}
        {column1Data && (
          <div className="bg-lightBlue text-center py-2 px-4 font-medium text-lg rounded-md rounded-b-none select-none border-4 border-skyBlue border-opacity-0 hover:border-opacity-100 animate-fadeIn duration-300">
            {column1Data.id}
          </div>
        )}
        {/* Preview Column 2 Selection */}
        {column2Data && (
          <div className="bg-violet text-center py-2 px-4 font-medium text-lg rounded-md rounded-t-none select-none border-4 border-skyBlue border-opacity-0 hover:border-opacity-100 animate-fadeIn duration-300">
            {column2Data.id}
          </div>
        )}
      </div>
      {/* Start Column 1 (Accounts) */}
      <div className="bg-violet py-8 px-8 rounded-2xl shadow-md flex flex-col items-stretch gap-8 animate-fadeIn opacity-0">
        {accounts_1.map(({ name, email, id }, i) => {
          return (
            <div
              key={i}
              className={`group relative bg-lightBlue text-center py-2 px-4 font-medium text-xl rounded-md select-none duration-100 border-4 border-skyBlue border-opacity-0 hover:border-opacity-100 animate-fadeInRight opacity-0 ${
                column1Data?.id == id && "border-opacity-100"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
              // Handle Mouse Press
              onMouseDown={(e) =>
                handleMouseDown(name, email, id, setColumn1Data, e)
              }
              // Hanle Mouse Lift
              onMouseUp={(e) => {
                handleMouseUp(name, email, id, true, e);
              }}
            >
              <p
                className={`absolute -top-1 left-0 -translate-y-full text-xs text-start whitespace-nowrap duration-300 group-hover:opacity-100 ${
                  column1Data?.id == id ? "opacity-100" : "opacity-30"
                }`}
              >
                {id}
              </p>
              {email}
            </div>
          );
        })}
      </div>
      {/* End Column 1 (Accounts) */}
      {/* Start Column 2 (Accounts) */}
      <div
        className="bg-violet py-8 px-8 rounded-2xl shadow-md flex flex-col items-stretch gap-8 animate-fadeIn opacity-0 overflow-hidden"
        style={{ animationDelay: "250ms" }}
      >
        {accounts_2.map(({ name, email, id }, i) => {
          return (
            <div
              key={i}
              className={`group relative bg-lightBlue text-center py-2 px-4 font-medium text-xl rounded-md select-none duration-100 border-4 border-skyBlue border-opacity-0 hover:border-opacity-100 animate-fadeInLeft opacity-0 ${
                column2Data?.id == id && "border-opacity-100"
              }`}
              style={{ animationDelay: `${i * 200}ms` }}
              // Handle Mouse Press
              onMouseDown={(e) =>
                handleMouseDown(name, email, id, setColumn2Data, e)
              }
              // Hanle Mouse Lift
              onMouseUp={(e) => {
                handleMouseUp(name, email, id, false, e);
              }}
            >
              {email}
              <p
                className={`absolute -top-1 left-0 -translate-y-full text-xs text-start whitespace-nowrap duration-300 group-hover:opacity-100 ${
                  column2Data?.id == id ? "opacity-100" : "opacity-30"
                }`}
              >
                {id}
              </p>
            </div>
          );
        })}
      </div>
      {/* Loading Circle */}
      {isSending && <Loading />}
      {/* Correctly Sent Notification */}
      {isSentCorrectly && <CorrectlySentNotification />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  let accounts_1: Accounts[] = [
    {
      name: "John Doe 1",
      email: "Matt@domain.tld",
      id: uuidv4(),
    },
    {
      name: "John Doe 2",
      email: "Simon@domain.tld",
      id: uuidv4(),
    },
    {
      name: "John Doe 3",
      email: "Walter@domain.tld",
      id: uuidv4(),
    },
    {
      name: "John Doe 4",
      email: "Robert@domain.tld",
      id: uuidv4(),
    },
  ];
  let accounts_2: Accounts[] = [
    {
      name: "John Doe 1",
      email: "John@domain.tld",
      id: uuidv4(),
    },
    {
      name: "John Doe 2",
      email: "Chris@domain.tld",
      id: uuidv4(),
    },
    {
      name: "John Doe 3",
      email: "Jason@domain.tld",
      id: uuidv4(),
    },
    {
      name: "John Doe 4",
      email: "Bruce@domain.tld",
      id: uuidv4(),
    },
  ];
  return {
    props: {
      accounts_1: accounts_1,
      accounts_2: accounts_2,
    },
  };
};
