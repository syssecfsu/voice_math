import styled from "styled-components";

export const Container = styled.div`
	height: 100vh;
	display: flex;
	flex-direction: column;
`;

export const TopBar = styled.div`
	height: 6em;
	background-color: #219f94;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const Title = styled.h1`
	font-size: 4em;
	color: #313552;
	margin-left: 3.5em;
	/* color: white; */
`;

export const Left = styled.div`
	color: #313552;
	flex-grow: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const Right = styled.div`
	margin-right: 24px;
	width: 11em;
	display: flex;
	justify-content: end;
`;

export const Button = styled.button`
	border: none;
	background-color: transparent;
	margin: 0px;
	margin-right: 24px;
	color: ${(props) => props.color || "grey"};
	cursor: pointer;
`;

export const defaultSetting = {
	add: true,
	sub: false,
	mul: false,
	max: 9,
	min: 1,
	prompt: true,
};
export const primaryColor = "#313552";
