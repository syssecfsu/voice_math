import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SettingArea = styled.div`
	color: #313552;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #c1deae;
`;

const Operators = styled.ul`
	list-style: none;
`;

const Label = styled.h1`
	font-size: 32px;
	color: ${(props) => props.color || primaryColor};
	margin-right: 24px;
`;

const Operator = (props) => {
	return (
		<li>
			<Label {...props}> {props.title}</Label>
		</li>
	);
};

const InputContainer = styled.div`
	display: flex;
	align-items: center;
`;

const Input = styled.input.attrs({
	type: "text",
})`
	font-size: 32px;
	font-weight: 700;
	width: 40%;
	border: 0px;
	background-color: #f2f5c8;
`;

const Top = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const Bottom = styled.div`
	display: flex;
	align-items: center;
`;

function Settings() {
	let navigate = useNavigate();
	const maxInput = useRef(null);
	const [add, setAdd] = useState(true);
	const [sub, setSub] = useState(false);
	const [mul, setMul] = useState(false);
	const [max, setMax] = useState(10);

	useEffect(() => {
		const saved = localStorage.getItem("setting");
		let setting = JSON.parse(saved) || defaultSetting;
		setAdd(setting.add);
		setSub(setting.sub);
		setMul(setting.mul);
		setMax(setting.max);
		maxInput.current.value = setting.max;
	}, []);

	const onSave = (e) => {
		const setting = {
			add,
			sub,
			mul,
			max,
		};

		localStorage.setItem("setting", JSON.stringify(setting));
		navigate("/");
	};

	const getMax = () => {
		const n = parseInt(maxInput.current.value, 10);
		if (!isNaN(n) && n >= 5 && n < 100) {
			setMax(n);
		}
	};

	return (
		<Container>
			<TopBar>
				<Left>
					<Title>Speed Math</Title>
				</Left>

				<Right>
					<Button
						color={primaryColor}
						onClick={onSave}
						onKeyDown={(e) => e.preventDefault()}
					>
						<FontAwesomeIcon icon={faFloppyDisk} size="4x" />
					</Button>
				</Right>
			</TopBar>
			<SettingArea>
				<Top>
					<Label>Click questions to practice:</Label>
					<Operators>
						<Operator
							title="Addition"
							onClick={() => setAdd(!add)}
							color={add ? primaryColor : "gray"}
						/>
						<Operator
							title="Subtraction"
							onClick={() => setSub(!sub)}
							color={sub ? primaryColor : "gray"}
						/>
						<Operator
							title="Multiplication"
							onClick={() => setMul(!mul)}
							color={mul ? primaryColor : "gray"}
						/>
					</Operators>
					<InputContainer>
						<Label>Max number:</Label>
						<Input ref={maxInput} onChange={getMax} />
					</InputContainer>
				</Top>
				<Bottom>
					<Label> Setting:</Label>
					<Label> {add ? "+" : ""}</Label>
					<Label> {sub ? "-" : ""}</Label>
					<Label> {mul ? "x" : ""}</Label>
					<Label> {max}</Label>
				</Bottom>
			</SettingArea>
		</Container>
	);
}

export default Settings;
