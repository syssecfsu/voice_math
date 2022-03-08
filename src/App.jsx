import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneLines } from "@fortawesome/free-solid-svg-icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useElapsedTime } from "use-elapsed-time";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  height: 96px;
  background-color: #219f94;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Middle = styled.div`
  color: #313552;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #c1deae;
`;

const Bottom = styled.div`
  background-color: #f2f5c8;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const Title = styled.h1`
  font-size: 64px;
  /* color: white; */
`;

const Left = styled.div`
  color: #313552;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Right = styled.div`
  margin-right: 24px;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  margin: 0px;
  color: ${(props) => props.color || "grey"};
  cursor: pointer;
`;

const Equation = styled.h1`
  font-size: 160px;
  display: flex;
`;

const Answer = styled.h1`
  font-size: 160px;
  margin-right: 32px;
  color: ${(props) => props.color || "#313552"};
`;

const Result = styled.h1`
  font-size: 64px;
  color: ${(props) => props.color || "white"};
`;

const Time = styled.h1`
  width: 360px;
  color: #313552;
  font-size: 64px;
  display: flex;
`;

const TimeComponent = (props) => {
  const { ticking } = props;

  const { elapsedTime, reset } = useElapsedTime({
    isPlaying: ticking,
    updateInterval: 1,
    startAt: 0,
  });

  useEffect(() => {
    if (ticking) {
      reset();
    }
  }, [ticking, reset]);

  return <Time color="black">Time: {elapsedTime}</Time>;
};

function App() {
  const MaxNum = 15;
  const defaultColor = "#313552";

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("?");
  const [color, setColor] = useState(defaultColor);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [pressedKey, setPressedKey] = useState("");

  const newQuestion = () => {
    setNum1(Math.ceil(Math.random() * MaxNum));
    setNum2(Math.ceil(Math.random() * MaxNum));
    setAnswer("?");
  };

  const nextQuestion = () => {
    if (answer === num1 + num2) {
      setCorrect(correct + 1);
    } else {
      setWrong(wrong + 1);
    }

    setColor(defaultColor);
    resetTranscript();
    setPressedKey("");
    newQuestion();
  };

  const newPractice = () => {
    setCorrect(0);
    setWrong(0);
    newQuestion();
  };

  const Question = () => {
    return (
      <>
        <Equation>
          {num1} + {num2} =
        </Equation>
        <Answer color={color}>{answer}</Answer>
      </>
    );
  };

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const onKeyDown = (e) => {
      setPressedKey(e.key);
    };

    // add event listener
    window.addEventListener("keydown", onKeyDown);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!ticking) {
      return;
    }

    // resetTranscript should only be called after recognizing the next
    // command otherwise the speech recognition won't work properly.
    // As such, we just find the last number in the sequence as answer.
    console.log(transcript);

    const tokens = transcript.split(" ");

    let i = NaN;
    let next = false;

    tokens.forEach((val) => {
      i = parseInt(val, 10) || i;

      if (val === "next") {
        next = true;
      }
    });

    if (!isNaN(i) && answer !== num1 + num2) {
      setAnswer(i);

      // set the color to give a hint to the answer
      if (i === num1 + num2) {
        setColor("green");
      } else {
        setColor("red");
      }
    }

    if (next || pressedKey === "n" || pressedKey === " ") {
      nextQuestion();
    }
  }, [transcript, pressedKey, ticking, answer]);

  const onClick = () => {
    // switch listening
    if (ticking) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
      newPractice();
    }

    setTicking(!ticking);
  };

  return (
    <Container>
      <TopBar>
        <Left>
          <Title>Speed Math</Title>
        </Left>

        <Right>
          <Button
            color={ticking ? "black" : "grey"}
            onClick={onClick}
            onKeyDown={(e) => e.preventDefault()}
          >
            <FontAwesomeIcon icon={faMicrophoneLines} size="4x" />
          </Button>
        </Right>
      </TopBar>

      <Middle>{ticking ? <Question /> : <Equation>Ready?</Equation>}</Middle>

      <Bottom>
        <Result color="green">{correct}</Result>
        <Result color="red">{wrong}</Result>
        <TimeComponent ticking={ticking} />
      </Bottom>
    </Container>
  );
}

export default App;
