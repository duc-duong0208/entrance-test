import React, {
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";

import InputCommon from "@/components/Input/InputCommon";
import ButtonCommon from "@/components/Button/ButtonCommon";
import { Circle } from "@/utils/type";

const Game = () => {
  const [numberOfCircles, setNumberOfCircles] = useState<null | number>(null);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [status, setStatus] = useState("");
  const [time, setTime] = useState<string>("");
  const [timer, setTimer] = useState<null | NodeJS.Timeout>(null);

  const startTimer = useCallback(() => {
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      setTime(elapsedTime);
    }, 100);
    setTimer(intervalId);
  }, []);
  const stopTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [timer]);

  useEffect(() => {
    if (status === "win" || status === "lose") {
      stopTimer();
    }
  }, [status, stopTimer]);

  const title = useMemo(() => {
    switch (status) {
      case "start":
        return { text: "LET'S PLAY", color: "text-black" };
      case "win":
        return { text: "ALL CLEARED", color: "text-green-600" };
      case "lose":
        return { text: "GAME OVER", color: "text-red-600" };
      default:
        return { text: "LET'S PLAY", color: "text-black" };
    }
  }, [status]);

  const initializeCircles = useCallback(() => {
    if (numberOfCircles) {
      let newCircles: Circle[] = [];
      for (let i = 1; i <= numberOfCircles; i++) {
        const left = Math.random() * 90 + "%";
        const top = Math.random() * 90 + "%";
        const hide = false;
        const active = false;
        newCircles.push({ number: i, hide, active, left, top });
      }
      setCircles(newCircles);
    }
  }, [numberOfCircles]);

  const handleStartGame = useCallback(() => {
    if (numberOfCircles) {
      setStatus("start");
      setTime("");
      initializeCircles();
      startTimer();
    }
  }, [numberOfCircles, initializeCircles, startTimer]);

  const handleRestartGame = () => {
    stopTimer();
    handleStartGame();
  };
  useLayoutEffect(() => {
    if (circles.every((circle) => circle.hide)) {
      setStatus("win");
    }
  }, [circles]);

  const handleCircleClick = (circle: Circle) => {
    const newCircles = [...circles];
    let countCheck = 0;
    for (let i = 0; i < newCircles.length; i++) {
      if (newCircles[i].active) {
        countCheck += 1;
      }
    }
    if (circle.number === countCheck + 1) {
      setCircles((prev) => {
        const updatedCircles = [...prev];
        updatedCircles[countCheck].active = true;
        return updatedCircles;
      });
      setTimeout(() => {
        setCircles((prev) => {
          const updatedCircles = [...prev];
          updatedCircles[countCheck].hide = true;
          return updatedCircles;
        });
      }, 1000);
    } else {
      setStatus("lose");
    }
  };

  return (
    <div className="w-[500px] h-[700px] flex flex-col items-start gap-2 p-5 border border-black">
      <p className={`font-bold ${title.color}`}>{title.text}</p>
      <div className="w-full flex">
        <p className="w-[100px] text-left">Point:</p>
        <InputCommon value={numberOfCircles} setValue={setNumberOfCircles} />
      </div>
      <div className="w-full flex">
        <p className="w-[100px] text-left">Time:</p>
        <span>{time || "0.0"}s</span>
      </div>
      {status === "start" ? (
        <ButtonCommon title="Play" handleOnClick={handleStartGame} />
      ) : (
        <ButtonCommon title="Restart" handleOnClick={handleRestartGame} />
      )}

      <div className="relative w-full h-full border border-black">
        {circles &&
          circles.map((circle) => (
            <>
              {!circle.hide && (
                <div
                  key={circle.number}
                  className={`absolute w-10 h-10 flex items-center justify-center rounded-full border border-black  hover:bg-red-500 cursor-pointer ${
                    circle.active ? "bg-red-500" : "bg-white"
                  }`}
                  style={{ left: `${circle.left}`, top: `${circle.top}` }}
                  onClick={() => handleCircleClick(circle)}
                >
                  {circle.number}
                </div>
              )}
            </>
          ))}
      </div>
    </div>
  );
};

export default Game;
