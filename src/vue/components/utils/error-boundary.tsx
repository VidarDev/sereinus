"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

import { Button } from "@/vue/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/vue/components/ui/card";

interface Props {
	children?: ReactNode;
	fallback?: ReactNode | ((error: string) => ReactNode);
	title?: string;
	description?: string;
}

interface State {
	hasError: boolean;
	error: string;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: ""
	};

	public static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI.
		console.error("ErrorBoundary: ", error.message);
		return { hasError: true, error: error.message };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public async render() {
		if (!this.state.hasError) {
			return this.props.children;
		}

		if (this.props.fallback) {
			if (typeof this.props.fallback === "function") return this.props.fallback(this.state.error);

			return this.props.fallback;
		}

		const { title = "Something went wrong", description = "Please try again later" } = this.props;

		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardFooter>
					<Button
						variant="outline"
						onClick={() => {
							this.setState({ hasError: false });
						}}
					>
						Retry
					</Button>
				</CardFooter>
			</Card>
		);
	}
}
