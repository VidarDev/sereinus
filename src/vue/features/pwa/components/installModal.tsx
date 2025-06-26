"use client";

import { memo, type ReactNode } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/vue/components/ui/dialog";

interface InstallModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	className?: string;
}

export const InstallModal = memo<InstallModalProps>(({ open, onClose, title, children, className }) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className={className} disableAutoFocus>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription className="mt-4">
						Suivez ces étapes pour installer l&apos;application sur votre appareil.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4">{children}</div>
			</DialogContent>
		</Dialog>
	);
});

InstallModal.displayName = "InstallModal";
