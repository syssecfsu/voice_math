import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faGear } from "@fortawesome/free-solid-svg-icons";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useElapsedTime } from "use-elapsed-time";
import {
	Container,
	TopBar,
	Left,
	Right,
	Button,
	Title,
	primaryColor,
	defaultSetting,
} from "./Components";
import { useNavigate } from "react-router-dom";

const Middle = styled.div`
	color: #313552;
	flex-grow: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #c1deae;
`;

const Bottom = styled.div`
	background-color: #c1deae;
	height: 6em;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
`;

const Equation = styled.h1`
	font-size: 10em;
	display: flex;
`;

const Answer = styled.h1`
	font-size: 10em;
	width: 2em;
	color: ${(props) => props.color || "#313552"};
`;

const Result = styled.h1`
	width: 3em;
	font-size: 4.5em;
	color: ${(props) => props.color || "white"};
`;

const Time = styled.h1`
	width: 6em;
	color: #313552;
	font-size: 4.5em;
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

	return <Time>Time: {elapsedTime}</Time>;
};

function randInt(min, max) {
	var stepSize = 1 / (max - min + 1),
		nSteps = Math.floor(Math.random() / stepSize);
	return min + nSteps;
}

function Main() {
	const [max, setMax] = useState(10);
	const [min, setMin] = useState(1);
	const [prompt, setPrompt] = useState(true);
	const [num1, setNum1] = useState(0);
	const [num2, setNum2] = useState(0);
	const [ops, setOps] = useState([]);
	const [op, setOp] = useState("+");
	const [answer, setAnswer] = useState("?");
	const [color, setColor] = useState(primaryColor);
	const [correct, setCorrect] = useState(0);
	const [wrong, setWrong] = useState(0);
	const [ticking, setTicking] = useState(false);
	const [pressedKey, setPressedKey] = useState("");
	let navigate = useNavigate();

	const newQuestion = () => {
		let n1 = randInt(min, max);
		let n2 = randInt(min, max);

		// randomly pick an op
		const idx = randInt(0, ops.length - 1);
		const p = ops[idx] || "+";

		// avoid some simple cases
		if (p === "-" && (n1 === n2 || n1 === n2 + 1 || n1 === n2 - 1)) {
			return newQuestion();
		}

		// avoid negative results
		if (p === "-" && n1 < n2) {
			setNum1(n2);
			setNum2(n1);
		} else {
			setNum1(n1);
			setNum2(n2);
		}

		setOp(p);
		setAnswer("?");
	};

	const isCorrect = (i) => {
		return (
			(op === "+" && i === num1 + num2) ||
			(op === "-" && i === num1 - num2) ||
			(op === "??" && i === num1 * num2)
		);
	};

	const nextQuestion = () => {
		if (isCorrect(answer)) {
			setCorrect(correct + 1);
		} else {
			setWrong(wrong + 1);
		}

		setColor(primaryColor);
		resetTranscript();
		setPressedKey("");
		newQuestion();
	};

	const readSetting = () => {
		const saved = localStorage.getItem("setting");
		let setting = JSON.parse(saved) || defaultSetting;
		console.log(saved, setting);

		let a = [];
		setting.add && a.push("+");
		setting.sub && a.push("-");
		setting.mul && a.push("??");
		a.length === 0 && a.push("+");

		setOps(a);
		setMax(setting.max);
		setMin(setting.min);
		setPrompt(setting.prompt);
	};

	const newPractice = () => {
		setCorrect(0);
		setWrong(0);
		setColor(primaryColor);
		resetTranscript();
		setPressedKey("");
		newQuestion();
	};

	const Question = () => {
		return (
			<>
				<Equation>
					{num1} {op} {num2} =
				</Equation>
				<Answer color={color}>{answer}</Answer>
			</>
		);
	};

	const { transcript, resetTranscript } = useSpeechRecognition();

	useEffect(() => {
		readSetting();

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

		if (!isNaN(i) && !isCorrect(answer)) {
			setAnswer(i);

			// set the color to give a hint to the answer
			if (prompt) {
				if (isCorrect(i)) {
					setColor("green");
				} else {
					setColor("red");
				}
			}
		}

		if (next || pressedKey === "n" || pressedKey === " ") {
			nextQuestion();
		}
	}, [transcript, pressedKey, ticking, prompt, answer]);

	const onClick = () => {
		// switch listening
		if (ticking) {
			SpeechRecognition.stopListening();
		} else {
			SpeechRecognition.startListening({
				continuous: true,
			});
			newPractice();
		}

		setTicking(!ticking);
	};

	const onClickSetting = () => {
		SpeechRecognition.stopListening();
		navigate("/settings");
	};

	return (
		<Container>
			<TopBar>
				<Left>
					<Title>Speed Math</Title>
				</Left>

				<Right>
					<Button
						color={ticking ? primaryColor : "grey"}
						onClick={onClick}
						onKeyDown={(e) => e.preventDefault()}
					>
						<FontAwesomeIcon icon={faMicrophone} size="4x" />
					</Button>

					<Button
						color={primaryColor}
						onClick={onClickSetting}
						onKeyDown={(e) => e.preventDefault()}
					>
						<FontAwesomeIcon icon={faGear} size="4x" />
					</Button>
				</Right>
			</TopBar>

			<Middle>
				{ticking ? <Question /> : <Equation>Ready?</Equation>}
			</Middle>

			<Bottom>
				<Result color="green">{correct}</Result>
				<Result color="red">{wrong}</Result>
				<TimeComponent ticking={ticking} />
			</Bottom>
		</Container>
	);
}

export default Main;
